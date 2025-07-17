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
    // Strategy 3: Try git command
    else {
      try {
        console.log('🔄 Build Info API: No environment variables found, trying git command')
        deployedCommitHash = execSync('git rev-parse HEAD', {
          encoding: 'utf8',
          timeout: 5000,
        }).trim()
        source = 'git-command'
        console.log('✅ Build Info API: Git command successful')
      } catch (error) {
        console.error('❌ Build Info API: Could not determine deployed commit hash')
        console.error('❌ Build Info API: Available env vars:', {
          COMMIT_REF: !!process.env.COMMIT_REF,
          HEAD: !!process.env.HEAD,
          CACHED_COMMIT_REF: !!process.env.CACHED_COMMIT_REF,
          NETLIFY_COMMIT_REF: !!process.env.NETLIFY_COMMIT_REF,
          VERCEL_GIT_COMMIT_SHA: !!process.env.VERCEL_GIT_COMMIT_SHA,
          GITHUB_SHA: !!process.env.GITHUB_SHA,
          CF_PAGES_COMMIT_SHA: !!process.env.CF_PAGES_COMMIT_SHA,
        })

        return NextResponse.json(
          {
            error: 'Could not determine deployed commit hash',
            message: 'Build verification requires access to the deployed commit SHA',
            source: 'unavailable',
            timestamp: new Date().toISOString(),
            debug: {
              availableEnvVars: {
                COMMIT_REF: !!process.env.COMMIT_REF,
                HEAD: !!process.env.HEAD,
                CACHED_COMMIT_REF: !!process.env.CACHED_COMMIT_REF,
                NETLIFY_COMMIT_REF: !!process.env.NETLIFY_COMMIT_REF,
                VERCEL_GIT_COMMIT_SHA: !!process.env.VERCEL_GIT_COMMIT_SHA,
                GITHUB_SHA: !!process.env.GITHUB_SHA,
                CF_PAGES_COMMIT_SHA: !!process.env.CF_PAGES_COMMIT_SHA,
              },
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
