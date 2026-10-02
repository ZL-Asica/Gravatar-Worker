export const getTransformCacheKey = (
  requestUrl: string,
  hash: string,
  size: number,
  fallback: string,
  initials: string | undefined,
  name: string | undefined,
  outputMime: string,
) => {
  const url = new URL('/__avatar-transform-cache/v2', requestUrl)
  url.searchParams.set('hash', hash)
  url.searchParams.set('size', String(size))
  url.searchParams.set('default', fallback)
  url.searchParams.set('format', outputMime)
  if (fallback === 'initials') {
    if (initials !== undefined) {
      url.searchParams.set('initials', initials)
    }
    else if (name !== undefined) {
      url.searchParams.set('name', name)
    }
  }
  return new Request(url, { method: 'GET' })
}

export const readTransformCache = async (key: Request): Promise<Response | undefined> => {
  try {
    return typeof caches === 'undefined' ? undefined : await caches.default.match(key)
  }
  catch {
    // Caching is an optimization; an unavailable cache must not break avatars.
    return undefined
  }
}

export const writeTransformCache = async (key: Request, response: Response, ttl: number): Promise<void> => {
  try {
    if (typeof caches !== 'undefined') {
      const headers = new Headers(response.headers)
      // The key already contains the negotiated format. Cache API does not
      // support stale-while-revalidate; use the configured edge lifetime.
      headers.delete('Vary')
      headers.set('Cache-Control', `public, max-age=${ttl}`)
      await caches.default.put(key, new Response(response.body, { status: response.status, headers }))
    }
  }
  catch {
    // Do not turn a successful image response into an error on cache failures.
  }
}
