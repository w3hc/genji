export interface BuildStatus {
  currentBuildId: string
  latestCommitSha: string
  isUpToDate: boolean
  latestCommit?: {
    sha: string
    message: string
    author: string
    date: string
    url: string
  }
}

export class BuildDetector {
  private buildId: string | null = null
  private initialized: boolean = false

  constructor() {
    // Don't extract on server-side
    if (typeof window !== 'undefined') {
      this.initializeBuildId()
    }
  }

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
        this.initialized = true // Mark as initialized even if failed
      }
    } catch (error) {
      console.error('💥 Error during build ID extraction:', error)
      this.initialized = true // Mark as initialized even if failed
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

  // NEW: Extract build ID from live build files
  async extractBuildIdFromLiveFiles(): Promise<string | null> {
    console.log('🔍 Extracting build ID from live build files...')

    try {
      // Strategy 1: Look for Next.js build ID in static paths
      console.log('🎯 Strategy 1: Looking for Next.js build ID in static paths...')
      const staticPathId = this.tryExtractFromStaticPaths()
      if (staticPathId) {
        console.log(`✅ Found build ID in static paths: ${staticPathId}`)
        return staticPathId
      }

      // Strategy 2: Try build manifests
      console.log('🎯 Strategy 2: Checking build manifests...')
      const manifestId = await this.tryFetchBuildManifest()
      if (manifestId) {
        console.log(`✅ Found build ID in manifest: ${manifestId}`)
        return manifestId
      }

      // Strategy 3: Try webpack runtime
      console.log('🎯 Strategy 3: Checking webpack runtime...')
      const webpackId = await this.tryFetchWebpackRuntime()
      if (webpackId) {
        console.log(`✅ Found build ID in webpack runtime: ${webpackId}`)
        return webpackId
      }

      // Strategy 4: Extract from chunk hashes (fallback)
      console.log('🎯 Strategy 4: Falling back to chunk hashes...')
      const chunkId = this.tryExtractFromChunkHashes()
      if (chunkId) {
        console.log(`⚠️ Using chunk hash as build ID: ${chunkId}`)
        return chunkId
      }

      console.warn('❌ Could not extract build ID from any live build files')
      return null
    } catch (error) {
      console.error('💥 Error extracting build ID from live files:', error)
      return null
    }
  }

  private tryExtractFromStaticPaths(): string | null {
    const scripts = Array.from(document.querySelectorAll('script[src]'))
    console.log(`📄 Found ${scripts.length} script tags with src attributes`)

    for (const script of scripts) {
      const src = script.getAttribute('src') || ''
      console.log(`🔗 Checking script: ${src}`)

      // Look for the build ID in the _next/static/{buildId}/ structure
      const buildIdMatch = src.match(/_next\/static\/([a-f0-9]{8,})\//)
      if (buildIdMatch && buildIdMatch[1] && buildIdMatch[1] !== 'chunks') {
        console.log(`🎯 Found Next.js build ID in static path: ${buildIdMatch[1]}`)
        return buildIdMatch[1]
      }
    }

    console.log('⚠️ No build ID found in static paths')
    return null
  }

  private async tryFetchBuildManifest(): Promise<string | null> {
    try {
      console.log('📋 Trying to fetch build manifest...')

      const manifestPaths = [
        '/_next/static/chunks/manifest.json',
        '/_buildManifest.js',
        '/_next/static/chunks/_buildManifest.js',
      ]

      for (const path of manifestPaths) {
        try {
          console.log(`📋 Trying manifest at: ${path}`)
          const response = await fetch(path)
          if (response.ok) {
            const content = await response.text()
            console.log(`📋 Found manifest at ${path}, content length:`, content.length)

            // Look for build ID patterns in manifest content
            const patterns = [
              /"buildId":\s*"([a-f0-9]+)"/,
              /buildId["\']?:\s*["\']([a-f0-9]+)["\']/,
              /__BUILD_ID__["\']?:\s*["\']([a-f0-9]+)["\']/,
            ]

            for (const pattern of patterns) {
              const match = content.match(pattern)
              if (match && match[1]) {
                console.log(`✅ Found build ID in manifest: ${match[1]}`)
                return match[1]
              }
            }
          }
        } catch (pathError) {
          console.log(`⚠️ Could not fetch ${path}:`, pathError)
        }
      }

      console.log('⚠️ No build ID found in any manifest files')
      return null
    } catch (error) {
      console.warn('⚠️ Error in manifest fetching:', error)
      return null
    }
  }

  private async tryFetchWebpackRuntime(): Promise<string | null> {
    try {
      console.log('⚙️ Trying to fetch webpack runtime...')
      const response = await fetch('/_next/static/chunks/webpack-runtime.js')
      if (response.ok) {
        const content = await response.text()
        console.log('📦 Webpack runtime content length:', content.length)

        // Look for build ID patterns in the webpack runtime
        const patterns = [
          /buildId["\']?:\s*["\']([a-f0-9]+)["\']/,
          /__BUILD_ID__["\']?:\s*["\']([a-f0-9]+)["\']/,
          /BUILD_ID["\']?=\s*["\']([a-f0-9]+)["\']/,
        ]

        for (const pattern of patterns) {
          const match = content.match(pattern)
          if (match && match[1]) {
            console.log(`✅ Found build ID in webpack runtime: ${match[1]}`)
            return match[1]
          }
        }

        console.log('⚠️ No build ID patterns found in webpack runtime')
      }
      return null
    } catch (error) {
      console.warn('⚠️ Could not fetch webpack runtime:', error)
      return null
    }
  }

  private tryExtractFromChunkHashes(): string | null {
    const scripts = Array.from(document.querySelectorAll('script[src]'))
    console.log('🔄 Attempting to extract from chunk hashes as last resort...')

    for (const script of scripts) {
      const src = script.getAttribute('src') || ''

      // Check for webpack chunks with hashes
      let match = src.match(/webpack-([a-f0-9]+)\.js/)
      if (match && match[1]) {
        console.log(`⚠️ Using webpack chunk hash as fallback: ${match[1]}`)
        return match[1]
      }

      // Check for any Next.js chunk pattern
      match = src.match(/_next\/static\/chunks\/.*?-([a-f0-9]{8,})\.js/)
      if (match && match[1]) {
        console.log(`⚠️ Using Next.js chunk hash as fallback: ${match[1]}`)
        return match[1]
      }
    }

    console.log('❌ No chunk hashes found for fallback')
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

  // NEW: Get build ID from live files and compare with GitHub
  async checkBuildStatusFromLiveFiles(owner: string, repo: string): Promise<BuildStatus | null> {
    console.log(`🔍 Checking build status using live build files for ${owner}/${repo}`)

    // Extract build ID from the actual build files the user is running
    const liveBuildId = await this.extractBuildIdFromLiveFiles()

    if (!liveBuildId) {
      console.warn('❌ No live build ID available for comparison')
      return null
    }

    try {
      console.log('🌐 Fetching latest commit from GitHub API...')

      // Get latest commit from main branch
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/main`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      })

      if (!response.ok) {
        console.error(`❌ GitHub API error: ${response.status} ${response.statusText}`)
        throw new Error('Failed to fetch latest commit')
      }

      const latestCommit = await response.json()
      const latestSha = latestCommit.sha
      const latestShortSha = latestSha.substring(0, 8)

      console.log(`📊 Live Build Comparison:`)
      console.log(`   Live build ID:    ${liveBuildId}`)
      console.log(`   Live short ID:    ${liveBuildId.substring(0, 8)}`)
      console.log(`   Latest commit:    ${latestSha}`)
      console.log(`   Latest short:     ${latestShortSha}`)

      // Check multiple comparison strategies
      const isUpToDate =
        liveBuildId === latestSha ||
        liveBuildId === latestShortSha ||
        liveBuildId.substring(0, 8) === latestShortSha ||
        liveBuildId.substring(0, 7) === latestSha.substring(0, 7) // Sometimes commits are truncated to 7 chars

      console.log(`✅ Live build up to date: ${isUpToDate}`)

      const status: BuildStatus = {
        currentBuildId: liveBuildId,
        latestCommitSha: latestSha,
        isUpToDate,
        latestCommit: {
          sha: latestSha,
          message: latestCommit.commit.message,
          author: latestCommit.commit.author.name,
          date: latestCommit.commit.author.date,
          url: latestCommit.html_url,
        },
      }

      console.log('📋 Live build status:', status)
      return status
    } catch (error) {
      console.error('💥 Error checking live build status:', error)
      return null
    }
  }

  async checkIfUpToDate(owner: string, repo: string): Promise<BuildStatus | null> {
    await this.ensureInitialized()
    console.log(`🔍 Checking if build is up to date for ${owner}/${repo}`)

    if (!this.buildId) {
      console.warn('❌ No build ID available for comparison')
      return null
    }

    try {
      console.log('🌐 Fetching latest commit from GitHub API...')

      // Get latest commit from main branch
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/main`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      })

      if (!response.ok) {
        console.error(`❌ GitHub API error: ${response.status} ${response.statusText}`)
        throw new Error('Failed to fetch latest commit')
      }

      const latestCommit = await response.json()
      const latestSha = latestCommit.sha
      const latestShortSha = latestSha.substring(0, 8)

      console.log(`📊 Comparison:`)
      console.log(`   Current build ID: ${this.buildId}`)
      console.log(`   Current short ID: ${this.buildId.substring(0, 8)}`)
      console.log(`   Latest commit:    ${latestSha}`)
      console.log(`   Latest short:     ${latestShortSha}`)

      // Check multiple comparison strategies
      const isUpToDate =
        this.buildId === latestSha ||
        this.buildId === latestShortSha ||
        this.buildId.substring(0, 8) === latestShortSha ||
        this.buildId.substring(0, 7) === latestSha.substring(0, 7) // Sometimes commits are truncated to 7 chars

      console.log(`✅ Build up to date: ${isUpToDate}`)

      const status: BuildStatus = {
        currentBuildId: this.buildId,
        latestCommitSha: latestSha,
        isUpToDate,
        latestCommit: {
          sha: latestSha,
          message: latestCommit.commit.message,
          author: latestCommit.commit.author.name,
          date: latestCommit.commit.author.date,
          url: latestCommit.html_url,
        },
      }

      console.log('📋 Final status:', status)
      return status
    } catch (error) {
      console.error('💥 Error checking build status:', error)
      return null
    }
  }
}

// Create singleton instance only on client-side
let buildDetectorInstance: BuildDetector | null = null

export const buildDetector = (() => {
  if (typeof window === 'undefined') {
    // Return a mock object for server-side rendering
    return {
      getBuildId: async () => null,
      getShortBuildId: async () => null,
      checkIfUpToDate: async () => null,
      checkBuildStatusFromLiveFiles: async () => null,
      extractBuildIdFromLiveFiles: async () => null,
    }
  }

  if (!buildDetectorInstance) {
    console.log('🚀 Initializing build detector singleton...')
    buildDetectorInstance = new BuildDetector()
  }

  return buildDetectorInstance
})()
