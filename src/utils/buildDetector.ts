export interface BuildStatus {
  currentBuildId: string
  currentBuildHash?: string
  latestCommitSha: string
  isUpToDate: boolean
  latestCommit?: {
    sha: string
    message: string
    author: string
    date: string
    url: string
  }
  hashMethod?: 'git-commit' | 'file-hash' | 'hybrid'
}

export interface FileHash {
  path: string
  hash: string
  size: number
}

export interface FileHashRecord {
  [filePath: string]: string
}

export class BuildDetector {
  private buildId: string | null = null
  private initialized: boolean = false
  private fileHashes: FileHashRecord = {}

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeBuildId()
    }
  }

  // Calculate SHA-256 hash of file content
  private async calculateFileHash(content: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(content)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  // Get all critical build files and their hashes
  private async calculateBuildHash(): Promise<string> {
    console.log('🔒 Calculating build hash from deployed files...')

    const criticalFiles: string[] = []
    const fileHashes: FileHash[] = []

    try {
      // Strategy 1: Hash all JavaScript chunks
      const scripts = Array.from(document.querySelectorAll('script[src]'))
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i]
        const src = script.getAttribute('src')
        if (src && src.includes('_next/static/chunks/')) {
          criticalFiles.push(src)
        }
      }

      // Strategy 2: Hash CSS files
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      for (let i = 0; i < links.length; i++) {
        const link = links[i]
        const href = link.getAttribute('href')
        if (href && href.includes('_next/static/css/')) {
          criticalFiles.push(href)
        }
      }

      // Strategy 3: Hash main application files
      const mainFiles = [
        '/_next/static/chunks/main.js',
        '/_next/static/chunks/pages/_app.js',
        '/_next/static/chunks/webpack.js',
        '/_next/static/chunks/framework.js',
      ]
      criticalFiles.push(...mainFiles)

      // Fetch and hash each file
      const fetchPromises = criticalFiles.map(async filePath => {
        try {
          console.log(`📄 Fetching file for hash: ${filePath}`)
          const response = await fetch(filePath)
          if (response.ok) {
            const content = await response.text()
            const hash = await this.calculateFileHash(content)
            const fileHash: FileHash = {
              path: filePath,
              hash: hash.substring(0, 16), // Use first 16 chars for brevity
              size: content.length,
            }
            fileHashes.push(fileHash)
            console.log(`✅ Hashed ${filePath}: ${fileHash.hash} (${fileHash.size} bytes)`)
            return fileHash
          }
        } catch (error) {
          console.warn(`⚠️ Could not fetch ${filePath}:`, error)
          return null
        }
        return null
      })

      const results = await Promise.all(fetchPromises)
      const validHashes = results.filter((result): result is FileHash => result !== null)

      if (validHashes.length === 0) {
        throw new Error('No files could be hashed')
      }

      // Sort files by path for consistent ordering
      validHashes.sort((a, b) => a.path.localeCompare(b.path))

      // Combine all file hashes into a single build hash
      const combinedHash = validHashes.map(f => f.hash).join('')
      const buildHash = await this.calculateFileHash(combinedHash)
      const shortBuildHash = buildHash.substring(0, 8)

      console.log(`🔒 Build hash calculated from ${validHashes.length} files: ${shortBuildHash}`)
      console.log('📋 Hashed files:', validHashes)

      // Store file hashes for debugging using object instead of Map
      this.fileHashes = {}
      validHashes.forEach(f => {
        this.fileHashes[f.path] = f.hash
      })

      return shortBuildHash
    } catch (error) {
      console.error('💥 Error calculating build hash:', error)
      throw error
    }
  }

  // Enhanced method that uses both git commit and file hash
  async checkBuildStatusWithFileHash(owner: string, repo: string): Promise<BuildStatus | null> {
    console.log(`🔍 Checking build status with file hashing for ${owner}/${repo}`)

    try {
      // Step 1: Calculate current build hash from deployed files
      const currentBuildHash = await this.calculateBuildHash()

      // Step 2: Get git commit ID (fallback method)
      const gitCommitId = await this.extractBuildIdFromLiveFiles()

      // Step 3: Fetch latest commit from GitHub
      console.log('🌐 Fetching latest commit from GitHub API...')
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/main`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const latestCommit = await response.json()
      const latestSha = latestCommit.sha
      const latestShortSha = latestSha.substring(0, 8)

      // Step 4: Try to fetch build hash from GitHub for this commit
      const githubBuildHash = await this.fetchBuildHashFromGitHub(owner, repo, latestSha)

      console.log(`📊 Enhanced Build Comparison:`)
      console.log(`   Current build hash:   ${currentBuildHash}`)
      console.log(`   GitHub build hash:    ${githubBuildHash || 'not available'}`)
      console.log(`   Git commit ID:        ${gitCommitId || 'not available'}`)
      console.log(`   Latest GitHub commit: ${latestShortSha}`)

      // Step 5: Determine if up-to-date using multiple strategies
      let isUpToDate = false
      let method: 'git-commit' | 'file-hash' | 'hybrid' = 'hybrid'

      if (githubBuildHash && currentBuildHash === githubBuildHash) {
        // Best case: file hashes match
        isUpToDate = true
        method = 'file-hash'
        console.log('✅ Build up-to-date: File hashes match')
      } else if (gitCommitId && (gitCommitId === latestSha || gitCommitId === latestShortSha)) {
        // Fallback: git commits match
        isUpToDate = true
        method = 'git-commit'
        console.log('✅ Build up-to-date: Git commits match')
      } else {
        console.log('❌ Build appears to be outdated')
      }

      const status: BuildStatus = {
        currentBuildId: gitCommitId || currentBuildHash,
        currentBuildHash,
        latestCommitSha: latestSha,
        isUpToDate,
        hashMethod: method,
        latestCommit: {
          sha: latestSha,
          message: latestCommit.commit.message,
          author: latestCommit.commit.author.name,
          date: latestCommit.commit.author.date,
          url: latestCommit.html_url,
        },
      }

      console.log('📋 Enhanced build status:', status)
      return status
    } catch (error) {
      console.error('💥 Error in enhanced build status check:', error)
      return null
    }
  }

  // Fetch build hash from GitHub (if available)
  private async fetchBuildHashFromGitHub(
    owner: string,
    repo: string,
    commitSha: string
  ): Promise<string | null> {
    try {
      // Try to fetch a build manifest or hash file from GitHub
      const possiblePaths = [
        `https://raw.githubusercontent.com/${owner}/${repo}/${commitSha}/public/build-hash.json`,
        `https://raw.githubusercontent.com/${owner}/${repo}/${commitSha}/.build-hash`,
        `https://api.github.com/repos/${owner}/${repo}/contents/public/build-hash.json?ref=${commitSha}`,
      ]

      for (let i = 0; i < possiblePaths.length; i++) {
        const url = possiblePaths[i]
        try {
          console.log(`🔍 Trying to fetch build hash from: ${url}`)
          const response = await fetch(url)
          if (response.ok) {
            const content = await response.text()

            try {
              // Try parsing as JSON first
              const data = JSON.parse(content)
              if (data.buildHash) {
                console.log(`✅ Found build hash in GitHub: ${data.buildHash}`)
                return data.buildHash
              }
            } catch {
              // If not JSON, treat as plain text hash
              const hash = content.trim()
              if (hash.length >= 8 && /^[a-f0-9]+$/i.test(hash)) {
                console.log(`✅ Found build hash in GitHub: ${hash}`)
                return hash
              }
            }
          }
        } catch (error) {
          console.log(`⚠️ Could not fetch from ${url}:`, error)
        }
      }

      console.log('ℹ️ No build hash found in GitHub repository')
      return null
    } catch (error) {
      console.warn('⚠️ Error fetching build hash from GitHub:', error)
      return null
    }
  }

  // Get debug information about file hashes
  getFileHashes(): FileHashRecord {
    return { ...this.fileHashes }
  }

  // Generate a build hash file for CI/CD to store in repository
  async generateBuildHashFile(): Promise<{ buildHash: string; files: FileHash[] }> {
    try {
      const buildHash = await this.calculateBuildHash()
      const files: FileHash[] = []

      // Convert object to array
      Object.keys(this.fileHashes).forEach(path => {
        files.push({
          path,
          hash: this.fileHashes[path],
          size: 0, // Size would need to be stored separately
        })
      })

      const buildInfo = {
        buildHash,
        files,
        timestamp: new Date().toISOString(),
        method: 'file-hash',
      }

      console.log('📋 Generated build hash file:', buildInfo)
      return buildInfo
    } catch (error) {
      console.error('💥 Error generating build hash file:', error)
      throw error
    }
  }

  // Existing methods for backward compatibility
  private async initializeBuildId(): Promise<void> {
    try {
      await this.extractBuildId()
    } catch (error) {
      console.error('💥 Error initializing build ID:', error)
    }
  }

  private async extractBuildId(): Promise<void> {
    console.log('🔍 Starting build ID extraction from API...')
    try {
      await this.tryFetchBuildInfoAPI()
      if (this.buildId) {
        console.log(`✅ Build ID successfully extracted: ${this.buildId}`)
        this.initialized = true
      } else {
        console.warn('❌ Could not extract build ID from API')
        this.initialized = true
      }
    } catch (error) {
      console.error('💥 Error during build ID extraction:', error)
      this.initialized = true
    }
  }

  private async tryFetchBuildInfoAPI(): Promise<void> {
    try {
      console.log('🌐 Fetching build info from /api/build-info...')
      const response = await fetch('/api/build-info')
      if (response.ok) {
        const buildInfo = await response.json()
        console.log('📋 Build info from API:', buildInfo)
        if (buildInfo.buildId) {
          console.log(`🎯 Found build ID from API: ${buildInfo.buildId}`)
          this.buildId = buildInfo.buildId
          return
        }
      } else {
        console.warn(`⚠️ Build info API returned ${response.status}`)
      }
    } catch (error) {
      console.warn('⚠️ Could not fetch build info from API:', error)
    }
  }

  async extractBuildIdFromLiveFiles(): Promise<string | null> {
    console.log('🔍 Extracting build ID from live build files...')

    try {
      // Strategy 0: Check for injected global build ID first
      console.log('🎯 Strategy 0: Checking for global __NEXT_BUILD_ID__...')
      if (typeof window !== 'undefined' && (window as any).__NEXT_BUILD_ID__) {
        const globalBuildId = (window as any).__NEXT_BUILD_ID__
        console.log(`✅ Found build ID from global variable: ${globalBuildId}`)
        return globalBuildId
      }

      // Strategy 1: Look for Next.js build ID in static paths
      console.log('🎯 Strategy 1: Looking for Next.js build ID in static paths...')
      const staticPathId = this.tryExtractFromStaticPaths()
      if (staticPathId) {
        console.log(`✅ Found build ID in static paths: ${staticPathId}`)
        return staticPathId
      }

      // Strategy 2: Try API as fallback for live builds
      console.log('🎯 Strategy 2: Trying API as fallback...')
      const apiId = await this.tryFetchAPIBuildId()
      if (apiId) {
        console.log(`✅ Found build ID from API: ${apiId}`)
        return apiId
      }

      console.warn('❌ Could not extract build ID from any live build files')
      return null
    } catch (error) {
      console.error('💥 Error extracting build ID from live files:', error)
      return null
    }
  }

  private async tryFetchAPIBuildId(): Promise<string | null> {
    try {
      console.log('🌐 Fetching build ID from API as fallback...')
      const response = await fetch('/api/build-info')

      if (response.ok) {
        const buildInfo = await response.json()
        if (buildInfo.buildId || buildInfo.shortCommitHash || buildInfo.deployedCommitHash) {
          const buildId =
            buildInfo.buildId || buildInfo.shortCommitHash || buildInfo.deployedCommitHash
          console.log(`🎯 API provided build ID: ${buildId}`)
          return buildId
        }
      }

      console.log('⚠️ API did not provide a usable build ID')
      return null
    } catch (error) {
      console.warn('⚠️ Could not fetch from API:', error)
      return null
    }
  }

  private tryExtractFromStaticPaths(): string | null {
    const scripts = Array.from(document.querySelectorAll('script[src]'))
    console.log(`📄 Found ${scripts.length} script tags with src attributes`)

    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i]
      const src = script.getAttribute('src') || ''
      console.log(`🔗 Checking script: ${src}`)

      // Look for the build ID in the _next/static/{buildId}/ structure
      const buildIdMatch = src.match(/_next\/static\/([a-f0-9]{8,})\//)
      if (buildIdMatch && buildIdMatch[1] && buildIdMatch[1] !== 'chunks') {
        console.log(`🎯 Found Next.js build ID in static path: ${buildIdMatch[1]}`)
        return buildIdMatch[1]
      }
    }

    // Also check link tags for CSS files
    const links = Array.from(document.querySelectorAll('link[href]'))
    console.log(`📄 Found ${links.length} link tags with href attributes`)

    for (let i = 0; i < links.length; i++) {
      const link = links[i]
      const href = link.getAttribute('href') || ''
      console.log(`🔗 Checking link: ${href}`)

      const buildIdMatch = href.match(/_next\/static\/([a-f0-9]{8,})\//)
      if (buildIdMatch && buildIdMatch[1] && buildIdMatch[1] !== 'chunks') {
        console.log(`🎯 Found Next.js build ID in static path: ${buildIdMatch[1]}`)
        return buildIdMatch[1]
      }
    }

    console.log('⚠️ No build ID found in static paths')
    return null
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized && typeof window !== 'undefined') {
      console.log('🔄 Re-initializing build detector...')
      await this.initializeBuildId()
    }
  }

  async getBuildId(): Promise<string | null> {
    await this.ensureInitialized()
    console.log(`🎯 Current build ID: ${this.buildId}`)
    return this.buildId
  }

  async getShortBuildId(): Promise<string | null> {
    await this.ensureInitialized()
    if (!this.buildId) {
      console.log('❌ No build ID available for shortening')
      return null
    }
    const shortId = this.buildId.length > 7 ? this.buildId.slice(0, 7) : this.buildId
    console.log(`✂️ Short build ID: ${shortId} (from ${this.buildId})`)
    return shortId
  }
}

// Create singleton instance only on client-side
let buildDetectorInstance: BuildDetector | null = null

export const buildDetector = (() => {
  if (typeof window === 'undefined') {
    return {
      getBuildId: async () => null,
      getShortBuildId: async () => null,
      checkBuildStatusWithFileHash: async () => null,
      generateBuildHashFile: async () => ({ buildHash: '', files: [] }),
      getFileHashes: () => ({}),
    }
  }

  if (!buildDetectorInstance) {
    console.log('🚀 Initializing enhanced build detector singleton...')
    buildDetectorInstance = new BuildDetector()
  }

  return buildDetectorInstance
})()
