import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

export async function GET() {
  try {
    console.log('🏗️ API: Extracting build info...')

    let buildId: string
    let source: string

    try {
      // Try to get git hash
      const gitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
      const shortHash = gitHash.substring(0, 8)
      buildId = shortHash
      source = 'git'
      console.log('🏗️ API: Using git hash as build ID:', shortHash, '(full:', gitHash + ')')
    } catch (error) {
      // Fallback to environment variables or timestamp
      buildId =
        process.env.NETLIFY_COMMIT_REF?.substring(0, 8) ||
        process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 8) ||
        `build-${Date.now()}`
      source = 'fallback'
      console.log('🏗️ API: Using fallback build ID:', buildId)
    }

    const buildInfo = {
      buildId,
      source,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      platform: process.env.NETLIFY ? 'netlify' : process.env.VERCEL ? 'vercel' : 'unknown',
    }

    console.log('🏗️ API: Build info generated:', buildInfo)

    return NextResponse.json(buildInfo)
  } catch (error) {
    console.error('💥 API: Error generating build info:', error)

    return NextResponse.json(
      {
        buildId: `error-${Date.now()}`,
        source: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
