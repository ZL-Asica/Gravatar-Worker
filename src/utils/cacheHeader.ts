export const cacheHeaders = (
  ok: boolean,
  hash: string,
  config: SiteConfig,
): HeadersInit => {
  const browserTTL = ok ? config.cache.browserTtlOk : config.cache.browserTtl404
  const edgeTTL = ok ? config.cache.edgeTtlOk : config.cache.edgeTtl404
  const staleReval = ok ? config.cache.staleRevalidateOk : config.cache.staleRevalidate404

  return {
    'X-Gravatar-CDN': config.branding.siteUrl ?? 'https://gravatar.zla.app',
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
