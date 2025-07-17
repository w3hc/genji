import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

export async function GET() {
  try {
    console.log('🔍 Build Info API: Getting deployed commit hash for GitHub verification')

    let deployedCommitHash: string
    let source: string

    // Strategy 1: Check hosting platform environment variables
    if (process.env.NETLIFY_COMMIT_REF) {
      deployedCommitHash = process.env.NETLIFY_COMMIT_REF
      source = 'hosting-env'
      console.log('✅ Build Info API: Found commit from hosting environment')
    } else if (process.env.VERCEL_GIT_COMMIT_SHA) {
      deployedCommitHash = process.env.VERCEL_GIT_COMMIT_SHA
      source = 'hosting-env'
      console.log('✅ Build Info API: Found commit from hosting environment')
    } else if (process.env.GITHUB_SHA) {
      deployedCommitHash = process.env.GITHUB_SHA
      source = 'hosting-env'
      console.log('✅ Build Info API: Found commit from hosting environment')
    } else if (process.env.CF_PAGES_COMMIT_SHA) {
      deployedCommitHash = process.env.CF_PAGES_COMMIT_SHA
      source = 'hosting-env'
      console.log('✅ Build Info API: Found commit from hosting environment')
    }
    // Strategy 2: Try git command
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
        return NextResponse.json(
          {
            error: 'Could not determine deployed commit hash',
            message: 'Build verification requires access to the deployed commit SHA',
            source: 'unavailable',
            timestamp: new Date().toISOString(),
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
