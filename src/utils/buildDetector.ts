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
    const shortId = this.buildId.length > 8 ? this.buildId.slice(0, 8) : this.buildId
    console.log(`✂️ Short build ID: ${shortId} (from ${this.buildId})`)
    return shortId
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
    }
  }

  if (!buildDetectorInstance) {
    console.log('🚀 Initializing build detector singleton...')
    buildDetectorInstance = new BuildDetector()
  }

  return buildDetectorInstance
})()
