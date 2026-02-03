interface HeadMeta {
  title: string
  description: string
  canonicalUrl: string
  ogImageUrl: string
  robotsMeta: string
  siteName: string
}

interface SiteConfig {
  branding: {
    siteName: string
    siteTagline?: string
    siteDescription: string
    siteUrl?: string
    ogImageUrl: string
    faviconPath: string
    footerText?: string
    contactUrl?: string
  }
  seo: {
    robotsAllow: boolean | null
    robotsMeta: string
  }
  api: {
    meEmail?: string
    meHash?: string
    allowRawEmail: boolean
    defaultSize: number
    maxSize: number
  }
  cache: {
    browserTtlOk: number
    browserTtl404: number
    edgeTtlOk: number
    edgeTtl404: number
    staleRevalidateOk: number
    staleRevalidate404: number
    htmlTtl: number
  }
}
