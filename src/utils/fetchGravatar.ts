import type { Context } from 'hono'
import { cacheHeaders } from './cacheHeader'
import { imgProcessor } from './imgProcessor'

const ALLOWED_MIMES = ['image/avif', 'image/webp', 'image/jpeg', 'image/png']

export const fetchGravatar = async (
  c: Context,
  hash: string,
  config: SiteConfig,
  fallbackSize?: number,
): Promise<Response> => {
  // Normalize query params
  const sizeParam = c.req.query('s') ?? c.req.query('size')
  const rawSize = sizeParam !== undefined
    ? Number.parseInt(sizeParam, 10)
    : (fallbackSize ?? config.api.defaultSize)
  const size = Number.isFinite(rawSize)
    ? Math.max(16, Math.min(rawSize, config.api.maxSize))
    : config.api.defaultSize
  const fallback = c.req.query('d') ?? c.req.query('default') ?? '404'
  const initials = c.req.query('initials')
  const name = c.req.query('name')

  const acceptTypeString = c.req.header('Accept')
  const acceptTypes = acceptTypeString !== undefined
    ? acceptTypeString.split(',').map(t => t.trim())
    : ['image/webp']
  const normalizedAccept = acceptTypes.filter(type => ALLOWED_MIMES.includes(type))

  const params = new URLSearchParams({
    s: `${size}`,
    d: fallback,
  })

  if (fallback === 'initials' && initials !== undefined) {
    params.append('initials', initials)
  }
  else if (fallback === 'initials' && name !== undefined) {
    params.append('name', name)
  }

  const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?${params.toString()}`

  const res = await fetch(gravatarUrl, {
    cf: {
      cacheEverything: true,
      cacheTtlByStatus: {
        '200-299': config.cache.edgeTtlOk,
        '404': config.cache.edgeTtl404,
      },
    },
  })

  if (!res.ok) {
    return c.notFound()
  }

  const contentType = res.headers.get('Content-Type') ?? 'image/jpeg'
  const imageBuffer = await res.arrayBuffer()
  const { data, mime } = await imgProcessor(imageBuffer, contentType, normalizedAccept)
  return new Response(data, {
    headers: {
      ...cacheHeaders(res.ok, hash, config),
      'Content-Type': mime,
    },
  })
}
