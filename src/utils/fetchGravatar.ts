import type { Context } from 'hono'
import { parseAcceptHeader } from './avatarInput'
import { cacheHeaders } from './cacheHeader'
import { imgProcessor } from './imgProcessor'

const TRANSFORM_MIMES = ['image/avif', 'image/webp']
const TRANSFORM_SOURCE_MIMES = ['image/jpeg', 'image/png']
const MAX_TRANSFORM_BYTES = 4 * 1024 * 1024
const MAX_TRANSFORM_PIXELS = 1024 * 1024
const UPSTREAM_TIMEOUT_MS = 10_000

const getContentType = (headers: Headers): string => {
  return headers.get('Content-Type')?.split(';')[0]?.trim().toLowerCase() ?? 'image/jpeg'
}

const shouldTransformImage = (
  contentType: string,
  contentLength: string | null,
  acceptTypes: string[],
  size: number,
) => {
  if (!TRANSFORM_SOURCE_MIMES.includes(contentType)) {
    return false
  }
  if (!acceptTypes.some(type => TRANSFORM_MIMES.includes(type))) {
    return false
  }
  if (size * size > MAX_TRANSFORM_PIXELS) {
    return false
  }
  if (contentLength !== null) {
    const bytes = Number.parseInt(contentLength, 10)
    if (Number.isFinite(bytes) && bytes > MAX_TRANSFORM_BYTES) {
      return false
    }
  }
  return true
}

const proxiedImageResponse = (
  data: BodyInit | null,
  status: number,
  hash: string,
  config: SiteConfig,
  contentType: string,
) => {
  return new Response(data, {
    status,
    headers: {
      ...cacheHeaders(status >= 200 && status < 300, hash, config),
      'Content-Type': contentType,
    },
  })
}

const upstreamErrorResponse = () => {
  return new Response('Upstream Error', {
    status: 502,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}

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

  const normalizedAccept = parseAcceptHeader(c.req.header('Accept'))

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

  let res: Response
  try {
    res = await fetch(gravatarUrl, {
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      cf: {
        cacheEverything: true,
        cacheTtlByStatus: {
          '200-299': config.cache.edgeTtlOk,
          '404': config.cache.edgeTtl404,
        },
      },
    })
  }
  catch {
    return upstreamErrorResponse()
  }

  if (!res.ok) {
    return proxiedImageResponse('Not Found', 404, hash, config, 'text/plain; charset=utf-8')
  }

  const contentType = getContentType(res.headers)
  if (!shouldTransformImage(contentType, res.headers.get('Content-Length'), normalizedAccept, size)) {
    return proxiedImageResponse(res.body, res.status, hash, config, contentType)
  }

  try {
    const imageBuffer = await res.arrayBuffer()
    const { data, mime } = await imgProcessor(imageBuffer, contentType, normalizedAccept)
    return proxiedImageResponse(data, res.status, hash, config, mime)
  }
  catch {
    return upstreamErrorResponse()
  }
}
