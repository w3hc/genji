// src/app/api/build-info/route.ts
import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

export async function GET() {
  try {
    console.log('🔍 Build Info API: Getting deployed commit hash for GitHub verification')

    let deployedCommitHash: string
    let source: string

    // Strategy 1: Check Netlify environment variables (most common)
    if (process.env.COMMIT_REF) {
      deployedCommitHash = process.env.COMMIT_REF
      source = 'netlify-commit-ref'
      console.log('✅ Build Info API: Found commit from COMMIT_REF')
    } else if (process.env.HEAD) {
      deployedCommitHash = process.env.HEAD
      source = 'netlify-head'
      console.log('✅ Build Info API: Found commit from HEAD')
    } else if (process.env.CACHED_COMMIT_REF) {
      deployedCommitHash = process.env.CACHED_COMMIT_REF
      source = 'netlify-cached'
      console.log('✅ Build Info API: Found commit from CACHED_COMMIT_REF')
    } else if (process.env.NETLIFY_COMMIT_REF) {
      deployedCommitHash = process.env.NETLIFY_COMMIT_REF
      source = 'netlify-commit-ref-alt'
      console.log('✅ Build Info API: Found commit from NETLIFY_COMMIT_REF')
    }
    // Strategy 2: Check other hosting platform environment variables
    else if (process.env.VERCEL_GIT_COMMIT_SHA) {
      deployedCommitHash = process.env.VERCEL_GIT_COMMIT_SHA
      source = 'vercel-env'
      console.log('✅ Build Info API: Found commit from Vercel environment')
    } else if (process.env.GITHUB_SHA) {
      deployedCommitHash = process.env.GITHUB_SHA
      source = 'github-actions'
      console.log('✅ Build Info API: Found commit from GitHub Actions')
    } else if (process.env.CF_PAGES_COMMIT_SHA) {
      deployedCommitHash = process.env.CF_PAGES_COMMIT_SHA
      source = 'cloudflare-pages'
      console.log('✅ Build Info API: Found commit from Cloudflare Pages')
    }
    // Strategy 3: Try git command with better error handling
    else {
      try {
        console.log('🔄 Build Info API: No environment variables found, trying git command')

        // Try multiple git approaches
        let gitHash: string

        try {
          // Method 1: Standard git command
          gitHash = execSync('git rev-parse HEAD', {
            encoding: 'utf8',
            timeout: 5000,
            stdio: ['ignore', 'pipe', 'pipe'],
          }).trim()
          console.log('✅ Build Info API: Standard git command successful')
        } catch (standardError) {
          console.log('⚠️ Build Info API: Standard git failed, trying alternatives')

          try {
            // Method 2: Check if we're in a git repository
            const isGitRepo = execSync('git status --porcelain', {
              encoding: 'utf8',
              timeout: 3000,
              stdio: ['ignore', 'pipe', 'ignore'],
            })
            gitHash = execSync('git log -1 --format=%H', {
              encoding: 'utf8',
              timeout: 3000,
            }).trim()
            console.log('✅ Build Info API: Git log method successful')
          } catch (logError) {
            console.log('⚠️ Build Info API: Git log failed, checking for shallow repo')

            try {
              // Method 3: For shallow repositories
              gitHash = execSync('git rev-parse --verify HEAD', {
                encoding: 'utf8',
                timeout: 3000,
              }).trim()
              console.log('✅ Build Info API: Shallow repo method successful')
            } catch (shallowError) {
              console.error('❌ Build Info API: All git methods failed')
              throw new Error(`Git unavailable: ${standardError}`)
            }
          }
        }

        deployedCommitHash = gitHash
        source = 'git-command'
        console.log('✅ Build Info API: Git command successful')
      } catch (error) {
        console.error('❌ Build Info API: Could not determine deployed commit hash')

        // Get all environment variables that might contain commit info
        const allEnvVars = Object.keys(process.env)
          .filter(
            key =>
              key.includes('COMMIT') ||
              key.includes('SHA') ||
              key.includes('HEAD') ||
              key.includes('GIT') ||
              key.includes('NETLIFY') ||
              key.includes('VERCEL') ||
              key.includes('GITHUB')
          )
          .reduce(
            (acc, key) => {
              acc[key] = process.env[key] ? process.env[key].substring(0, 8) + '...' : 'not set'
              return acc
            },
            {} as Record<string, string>
          )

        console.error('❌ Build Info API: All relevant env vars:', allEnvVars)

        return NextResponse.json(
          {
            error: 'Could not determine deployed commit hash',
            message: 'Build verification requires access to the deployed commit SHA',
            source: 'unavailable',
            timestamp: new Date().toISOString(),
            debug: {
              checkedVars: {
                COMMIT_REF: !!process.env.COMMIT_REF,
                HEAD: !!process.env.HEAD,
                CACHED_COMMIT_REF: !!process.env.CACHED_COMMIT_REF,
                NETLIFY_COMMIT_REF: !!process.env.NETLIFY_COMMIT_REF,
                VERCEL_GIT_COMMIT_SHA: !!process.env.VERCEL_GIT_COMMIT_SHA,
                GITHUB_SHA: !!process.env.GITHUB_SHA,
                CF_PAGES_COMMIT_SHA: !!process.env.CF_PAGES_COMMIT_SHA,
              },
              availableGitVars: allEnvVars,
              gitError: error instanceof Error ? error.message : String(error),
            },
          },
          { status: 503 }
        )
      }
    }

    const shortCommitHash = deployedCommitHash.substring(0, 8)

    const buildInfo = {
      deployedCommitHash,
      shortCommitHash,
      buildId: shortCommitHash, // For compatibility
      source,
      timestamp: new Date().toISOString(),
      purpose: 'github-verification',
    }

    console.log('📋 Build Info API: Deployed commit info ready:', shortCommitHash)

    return NextResponse.json(buildInfo)
  } catch (error) {
    console.error('💥 Build Info API: Error getting deployed commit info:', error)

    return NextResponse.json(
      {
        error: 'Failed to get deployed commit information',
        buildId: `error-${Date.now()}`,
        source: 'error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
