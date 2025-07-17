const fs = require('fs')
const path = require('path')

console.log('🔍 Verifying build hash system...')

function verifyBuildHashFiles() {
  const publicHashPath = path.join(process.cwd(), 'public', 'build-hash.json')
  const rootHashPath = path.join(process.cwd(), '.build-hash')

  console.log('📋 Checking build hash files...')

  // Check public build-hash.json
  if (fs.existsSync(publicHashPath)) {
    try {
      const buildInfo = JSON.parse(fs.readFileSync(publicHashPath, 'utf8'))
      console.log('✅ Found public/build-hash.json')
      console.log(`   Build hash: ${buildInfo.buildHash}`)
      console.log(`   Files: ${buildInfo.totalFiles}`)
      console.log(`   Size: ${Math.round(buildInfo.totalSize / 1024)} KB`)
      console.log(`   Timestamp: ${buildInfo.timestamp}`)

      if (buildInfo.files && buildInfo.files.length > 0) {
        console.log('📄 Sample hashed files:')
        buildInfo.files.slice(0, 3).forEach(file => {
          console.log(`   ${file.path}: ${file.hash}`)
        })
        if (buildInfo.files.length > 3) {
          console.log(`   ... and ${buildInfo.files.length - 3} more files`)
        }
      }
    } catch (error) {
      console.error('❌ Invalid build-hash.json:', error.message)
      return false
    }
  } else {
    console.error('❌ Missing public/build-hash.json')
    return false
  }

  // Check root .build-hash
  if (fs.existsSync(rootHashPath)) {
    const rootHash = fs.readFileSync(rootHashPath, 'utf8').trim()
    console.log('✅ Found .build-hash')
    console.log(`   Hash: ${rootHash}`)
  } else {
    console.error('❌ Missing .build-hash')
    return false
  }

  return true
}

function simulateBrowserHashCheck() {
  console.log('\n🌐 Simulating browser hash calculation...')

  const buildDir = path.join(process.cwd(), '.next')
  if (!fs.existsSync(buildDir)) {
    console.error('❌ No build directory found. Run "npm run build" first.')
    return false
  }

  // Find some sample files that would be available to the browser
  const sampleFiles = [
    path.join(buildDir, 'static', 'chunks', 'main.js'),
    path.join(buildDir, 'static', 'chunks', 'webpack.js'),
  ]

  const availableFiles = sampleFiles.filter(file => fs.existsSync(file))

  if (availableFiles.length === 0) {
    console.warn('⚠️ No sample build files found for simulation')
    return false
  }

  console.log(`📄 Found ${availableFiles.length} sample files for browser simulation:`)
  availableFiles.forEach(file => {
    const relativePath = path.relative(process.cwd(), file)
    const size = fs.statSync(file).size
    console.log(`   ${relativePath} (${Math.round(size / 1024)} KB)`)
  })

  return true
}

function checkGitHubIntegration() {
  console.log('\n🐙 Checking GitHub integration readiness...')

  // Check if we're in a git repository
  const gitDir = path.join(process.cwd(), '.git')
  if (!fs.existsSync(gitDir)) {
    console.warn('⚠️ Not in a git repository')
    return false
  }

  // Check for git commit
  try {
    const { execSync } = require('child_process')
    const commit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
    console.log(`✅ Git commit: ${commit.substring(0, 8)}`)

    // Check if there are uncommitted changes
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim()
      if (status) {
        console.warn('⚠️ There are uncommitted changes')
        console.log('   Commit changes for accurate build tracking')
      } else {
        console.log('✅ Working directory is clean')
      }
    } catch (error) {
      console.warn('⚠️ Could not check git status')
    }
  } catch (error) {
    console.error('❌ Could not get git commit:', error.message)
    return false
  }

  // Check for GitHub remote
  try {
    const { execSync } = require('child_process')
    const remotes = execSync('git remote -v', { encoding: 'utf8' })
    if (remotes.includes('github.com')) {
      console.log('✅ GitHub remote found')

      // Extract repository info
      const githubMatch = remotes.match(/github\.com[:/]([^/]+)\/([^/\s]+)/)
      if (githubMatch) {
        const [, owner, repo] = githubMatch
        const cleanRepo = repo.replace('.git', '')
        console.log(`   Repository: ${owner}/${cleanRepo}`)

        // Check if build hash would be accessible via GitHub API
        console.log('📡 Build hash should be accessible at:')
        console.log(
          `   https://raw.githubusercontent.com/${owner}/${cleanRepo}/main/public/build-hash.json`
        )
        console.log(`   https://raw.githubusercontent.com/${owner}/${cleanRepo}/main/.build-hash`)
      }
    } else {
      console.warn('⚠️ No GitHub remote found')
    }
  } catch (error) {
    console.warn('⚠️ Could not check git remotes')
  }

  return true
}

function generateTestReport() {
  console.log('\n📊 Build Hash System Test Report')
  console.log('=====================================')

  const tests = [
    { name: 'Build hash files', fn: verifyBuildHashFiles },
    { name: 'Browser simulation', fn: simulateBrowserHashCheck },
    { name: 'GitHub integration', fn: checkGitHubIntegration },
  ]

  const results = tests.map(test => {
    console.log(`\n🧪 Testing: ${test.name}`)
    const passed = test.fn()
    console.log(`   Result: ${passed ? '✅ PASS' : '❌ FAIL'}`)
    return { name: test.name, passed }
  })

  console.log('\n📋 Summary:')
  results.forEach(result => {
    console.log(`   ${result.passed ? '✅' : '❌'} ${result.name}`)
  })

  const passCount = results.filter(r => r.passed).length
  console.log(`\n🎯 Tests passed: ${passCount}/${results.length}`)

  if (passCount === results.length) {
    console.log('🎉 All tests passed! Build hash system is ready.')
  } else {
    console.log('⚠️ Some tests failed. Check the issues above.')
  }

  console.log('\n📚 Next steps:')
  console.log('1. Run "npm run build" to generate a production build')
  console.log('2. The build hash will be automatically generated in postbuild')
  console.log('3. Commit the .build-hash file to your repository')
  console.log('4. Deploy the application with the build-hash.json file')
  console.log('5. Click the build ID in the header to test hash comparison')

  return passCount === results.length
}

// Run verification
try {
  const success = generateTestReport()
  process.exit(success ? 0 : 1)
} catch (error) {
  console.error('💥 Verification failed:', error)
  process.exit(1)
}
