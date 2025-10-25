// Browser cache TTLs
const BROWSER_TTL_OK = 60 * 60 * 24 * 3 // 3 days
const BROWSER_TTL_404 = 60 * 5 // 5 minutes

// Edge cache TTLs (for CDN-Cache-Control)
const EDGE_TTL_OK = 60 * 60 * 24 * 7 // 7 days
const EDGE_TTL_404 = 60 * 60 // 1 hour

// Stale-while-revalidate durations
const STALE_REVAL_OK = 60 * 60 * 24 * 7 // 7 days
const STALE_REVAL_404 = 60 * 60 // 1 hour

export const cacheHeaders = (
  ok: boolean,
  hash: string,
): HeadersInit => {
  const browserTTL = ok ? BROWSER_TTL_OK : BROWSER_TTL_404
  const edgeTTL = ok ? EDGE_TTL_OK : EDGE_TTL_404
  const staleReval = ok ? STALE_REVAL_OK : STALE_REVAL_404

  return {
    'X-Gravatar-CDN': 'https://gravatar.zla.app',
    // Browser cache: shorter TTL, allows stale content during revalidation
    'Cache-Control': `public, max-age=${browserTTL}, stale-while-revalidate=${staleReval}`,
    // CDN cache: longer TTL for edge caching
    'CDN-Cache-Control': `public, max-age=${edgeTTL}, stale-while-revalidate=${staleReval}`,
    // Content negotiation based on Accept header
    'Vary': 'Accept',
    // ETag for better cache validation
    'ETag': `"${hash}"`,
    // ! Only useful if you have CF Business/Enterprise and use tag-based purging
    ...(ok && { 'Cache-Tag': `avatar-${hash}` }),
  }
}
