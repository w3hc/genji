const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

console.log('🔒 Generating build hash from production files...')

function calculateFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return crypto.createHash('sha256').update(content).digest('hex')
  } catch (error) {
    console.warn(`⚠️ Could not hash ${filePath}:`, error.message)
    return null
  }
}

function findBuildFiles(buildDir) {
  const files = []

  try {
    // Find all JavaScript chunks
    const chunksDir = path.join(buildDir, 'static', 'chunks')
    if (fs.existsSync(chunksDir)) {
      const chunkFiles = fs.readdirSync(chunksDir, { recursive: true })
      chunkFiles.forEach(file => {
        if (file.endsWith('.js') && !file.includes('.map')) {
          files.push(path.join(chunksDir, file))
        }
      })
    }

    // Find CSS files
    const cssDir = path.join(buildDir, 'static', 'css')
    if (fs.existsSync(cssDir)) {
      const cssFiles = fs.readdirSync(cssDir)
      cssFiles.forEach(file => {
        if (file.endsWith('.css')) {
          files.push(path.join(cssDir, file))
        }
      })
    }

    // Add critical files if they exist
    const criticalFiles = [
      path.join(buildDir, 'static', 'chunks', 'main.js'),
      path.join(buildDir, 'static', 'chunks', 'webpack.js'),
      path.join(buildDir, 'static', 'chunks', 'framework.js'),
      path.join(buildDir, 'static', 'chunks', 'pages', '_app.js'),
    ]

    criticalFiles.forEach(file => {
      if (fs.existsSync(file) && !files.includes(file)) {
        files.push(file)
      }
    })

    return files
  } catch (error) {
    console.error('💥 Error finding build files:', error)
    return []
  }
}

function generateBuildHash() {
  const buildDir = path.join(process.cwd(), '.next')

  if (!fs.existsSync(buildDir)) {
    console.error('❌ Build directory not found. Run this script after "npm run build"')
    process.exit(1)
  }

  const buildFiles = findBuildFiles(buildDir)
  console.log(`📄 Found ${buildFiles.length} build files to hash`)

  const fileHashes = []

  buildFiles.forEach(filePath => {
    const hash = calculateFileHash(filePath)
    if (hash) {
      const relativePath = path.relative(process.cwd(), filePath)
      fileHashes.push({
        path: relativePath.replace(/\\/g, '/'), // Normalize path separators
        hash: hash.substring(0, 16), // Use first 16 chars
        size: fs.statSync(filePath).size,
      })
      console.log(`✅ Hashed ${relativePath}: ${hash.substring(0, 16)}`)
    }
  })

  if (fileHashes.length === 0) {
    console.error('❌ No files could be hashed')
    process.exit(1)
  }

  // Sort files by path for consistent ordering
  fileHashes.sort((a, b) => a.path.localeCompare(b.path))

  // Combine all file hashes into a single build hash
  const combinedHash = fileHashes.map(f => f.hash).join('')
  const buildHash = crypto.createHash('sha256').update(combinedHash).digest('hex')
  const shortBuildHash = buildHash.substring(0, 8)

  // Get git commit info
  let gitCommit = 'unknown'
  try {
    const { execSync } = require('child_process')
    gitCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
  } catch (error) {
    console.warn('⚠️ Could not get git commit:', error.message)
  }

  const buildInfo = {
    buildHash: shortBuildHash,
    fullBuildHash: buildHash,
    gitCommit: gitCommit,
    files: fileHashes,
    timestamp: new Date().toISOString(),
    method: 'file-hash',
    totalFiles: fileHashes.length,
    totalSize: fileHashes.reduce((sum, f) => sum + f.size, 0),
  }

  // Write build hash file to public directory (will be available at runtime)
  const publicPath = path.join(process.cwd(), 'public', 'build-hash.json')
  fs.writeFileSync(publicPath, JSON.stringify(buildInfo, null, 2))

  // Also write to root for CI/CD to commit back to repository
  const rootPath = path.join(process.cwd(), '.build-hash')
  fs.writeFileSync(rootPath, shortBuildHash)

  console.log(`🔒 Build hash generated: ${shortBuildHash}`)
  console.log(`📋 Build info written to:`)
  console.log(`   ${publicPath}`)
  console.log(`   ${rootPath}`)
  console.log(`📊 Summary:`)
  console.log(`   Files hashed: ${fileHashes.length}`)
  console.log(`   Total size: ${Math.round(buildInfo.totalSize / 1024)} KB`)
  console.log(`   Git commit: ${gitCommit.substring(0, 8)}`)

  return buildInfo
}

// Run the script
try {
  const buildInfo = generateBuildHash()
  console.log('✅ Build hash generation completed successfully')

  // Output for CI/CD scripts
  if (process.env.CI) {
    console.log(`::set-output name=build-hash::${buildInfo.buildHash}`)
    console.log(`::set-output name=git-commit::${buildInfo.gitCommit}`)
  }
} catch (error) {
  console.error('💥 Build hash generation failed:', error)
  process.exit(1)
}
