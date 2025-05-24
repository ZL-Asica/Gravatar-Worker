const BROWSER_TTL_OK = 60 * 60 * 24 * 3 // 3 day
const BROWSER_TTL_404 = 60 * 5 // 5 min
const STALE_REVAL = 60 * 60 * 24 * 30 // 30 days

export const cacheHeaders = (
  ok: boolean,
  hash: string,
): HeadersInit => {
  const browserTTL = ok ? BROWSER_TTL_OK : BROWSER_TTL_404
  return {
    'X-Gravatar-CDN': 'https://gravatar.zla.app',
    'Cache-Control': `public, max-age=${browserTTL}, stale-while-revalidate=${STALE_REVAL}`,
    // ! Only useful if you have CF Business/Enterprise and use tag-based purging
    ...(ok && { 'Cache-Tag': `avatar-${hash}` }),
  }
}
