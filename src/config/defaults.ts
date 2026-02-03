export const DEFAULT_CONFIG: SiteConfig = {
  branding: {
    siteName: 'ZLA Gravatar CDN',
    siteTagline: 'Serve avatars from Gravatar with modern WebP/AVIF support, intelligent caching, and graceful fallback handling.',
    siteDescription: 'A fast, modern, and cache-friendly Gravatar CDN proxy built with Cloudflare Workers. Supports WebP/AVIF conversion, intelligent caching, and MD5/SHA-256 hash lookups.',
    siteUrl: 'https://gravatar.zla.app',
    ogImageUrl: '/og.png',
    faviconPath: '/favicon.ico',
    footerText: 'ZL Asica',
    contactUrl: 'https://zla.pub/',
  },
  seo: {
    robotsAllow: true,
    robotsMeta: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  api: {
    meEmail: undefined,
    meHash: undefined,
    allowRawEmail: true,
    defaultSize: 200,
    maxSize: 2048,
  },
  cache: {
    browserTtlOk: 60 * 60 * 24 * 3, // 3 days
    browserTtl404: 60 * 5, // 5 minutes
    edgeTtlOk: 60 * 60 * 24 * 7, // 7 days
    edgeTtl404: 60 * 60, // 1 hour
    staleRevalidateOk: 60 * 60 * 24 * 7, // 7 days
    staleRevalidate404: 60 * 60, // 1 hour
    htmlTtl: 5 * 60, // 5 minutes
  },
}
