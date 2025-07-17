// src/app/api/build-info/route.ts
import { NextResponse } from 'next/server'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    console.log('🔍 Build Info API: Getting deployed commit hash for GitHub verification')

    let deployedCommitHash: string
    let source: string

    // Strategy 1: Read from build-time generated file (most reliable for production)
    try {
      console.log('🎯 Build Info API: Checking for build-time generated info')
      const buildInfoPath = path.join(process.cwd(), 'public', 'build-info.json')

      if (fs.existsSync(buildInfoPath)) {
        const buildInfoContent = fs.readFileSync(buildInfoPath, 'utf8')
        const buildInfo = JSON.parse(buildInfoContent)

        if (buildInfo.commitHash && !buildInfo.commitHash.startsWith('error-')) {
          deployedCommitHash = buildInfo.commitHash
          source = buildInfo.source + '-static'
          console.log('✅ Build Info API: Found commit from build-time file')
        } else {
          throw new Error('Build-time file contains error or invalid data')
        }
      } else {
        throw new Error('Build-time file not found')
      }
    } catch (fileError) {
      console.log('⚠️ Build Info API: Build-time file not available, trying runtime methods')

      // Strategy 2: Try environment variables
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
      } else if (process.env.VERCEL_GIT_COMMIT_SHA) {
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
      // Strategy 3: Try git command (for local development)
      else {
        try {
          console.log('🔄 Build Info API: Trying git command (local dev)')
          deployedCommitHash = execSync('git rev-parse HEAD', {
            encoding: 'utf8',
            timeout: 5000,
            stdio: ['ignore', 'pipe', 'pipe'],
          }).trim()
          source = 'git-runtime'
          console.log('✅ Build Info API: Git command successful')
        } catch (gitError) {
          console.error('❌ Build Info API: All methods failed')

          return NextResponse.json(
            {
              error: 'Could not determine deployed commit hash',
              message: 'Build verification requires access to the deployed commit SHA',
              source: 'unavailable',
              timestamp: new Date().toISOString(),
              debug: {
                buildFileError: fileError instanceof Error ? fileError.message : String(fileError),
                gitError: gitError instanceof Error ? gitError.message : String(gitError),
              },
            },
            { status: 503 }
          )
        }
      }
    }

    const shortCommitHash = deployedCommitHash.substring(0, 8)

    const buildInfo = {
      deployedCommitHash,
      shortCommitHash,
      buildId: shortCommitHash,
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
