const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🏗️ Generating build info...')

try {
  // Get the current commit hash
  let commitHash
  let source

  try {
    // Try git command first
    commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
    source = 'git-build-time'
    console.log('✅ Got commit hash from git:', commitHash.substring(0, 8))
  } catch (gitError) {
    // Fallback to environment variables
    commitHash =
      process.env.COMMIT_REF ||
      process.env.HEAD ||
      process.env.NETLIFY_COMMIT_REF ||
      process.env.VERCEL_GIT_COMMIT_SHA ||
      process.env.GITHUB_SHA ||
      `build-${Date.now()}`
    source = 'env-build-time'
    console.log('⚠️ Git not available, using fallback:', commitHash.substring(0, 8))
  }

  const buildInfo = {
    commitHash,
    shortCommitHash: commitHash.substring(0, 8),
    source,
    buildTime: new Date().toISOString(),
    platform: process.env.NETLIFY ? 'netlify' : process.env.VERCEL ? 'vercel' : 'local',
  }

  // Write to public directory so it's accessible at runtime
  const outputPath = path.join(process.cwd(), 'public', 'build-info.json')
  fs.writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2))

  console.log('✅ Build info written to public/build-info.json')
  console.log('📋 Build info:', buildInfo)
} catch (error) {
  console.error('💥 Error generating build info:', error)

  // Create fallback build info
  const fallbackInfo = {
    commitHash: `error-${Date.now()}`,
    shortCommitHash: 'error',
    source: 'error',
    buildTime: new Date().toISOString(),
    error: error.message,
  }

  const outputPath = path.join(process.cwd(), 'public', 'build-info.json')
  fs.writeFileSync(outputPath, JSON.stringify(fallbackInfo, null, 2))

  console.log('⚠️ Created fallback build info')
}
