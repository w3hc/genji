// src/utils/buildDetector.ts
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
      this.extractBuildId()
    }
  }

  private extractBuildId(): void {
    try {
      // Extract from webpack chunk (most reliable for Next.js App Router)
      const webpackScript = document.querySelector('script[src*="webpack-"]')
      if (webpackScript) {
        const src = webpackScript.getAttribute('src') || ''
        const match = src.match(/webpack-([a-f0-9]+)\.js/)
        if (match && match[1]) {
          this.buildId = match[1]
          this.initialized = true
          console.log('Extracted buildId:', this.buildId)
          return
        }
      }

      console.log('Could not extract build ID from webpack chunk')
    } catch (error) {
      console.warn('Could not extract build ID:', error)
    }
  }

  private ensureInitialized(): void {
    if (!this.initialized && typeof window !== 'undefined') {
      this.extractBuildId()
    }
  }

  getBuildId(): string | null {
    this.ensureInitialized()
    return this.buildId
  }

  getShortBuildId(): string | null {
    this.ensureInitialized()
    if (!this.buildId) return null
    return this.buildId.length > 8 ? this.buildId.slice(0, 8) : this.buildId
  }

  async checkIfUpToDate(owner: string, repo: string): Promise<BuildStatus | null> {
    this.ensureInitialized()
    if (!this.buildId) return null

    try {
      // Get latest commit from main branch
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/main`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      })

      if (!response.ok) throw new Error('Failed to fetch latest commit')

      const latestCommit = await response.json()
      const latestSha = latestCommit.sha
      const latestShortSha = latestSha.substring(0, 8)

      return {
        currentBuildId: this.buildId,
        latestCommitSha: latestSha,
        isUpToDate: this.buildId === latestSha || this.buildId === latestShortSha,
        latestCommit: {
          sha: latestSha,
          message: latestCommit.commit.message,
          author: latestCommit.commit.author.name,
          date: latestCommit.commit.author.date,
          url: latestCommit.html_url,
        },
      }
    } catch (error) {
      console.warn('Error checking build status:', error)
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
      getBuildId: () => null,
      getShortBuildId: () => null,
      checkIfUpToDate: async () => null,
    }
  }

  if (!buildDetectorInstance) {
    buildDetectorInstance = new BuildDetector()
  }

  return buildDetectorInstance
})()
