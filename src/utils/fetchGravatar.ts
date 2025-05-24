import type { Context } from 'hono'
import { cacheHeaders } from './cacheHeader'
import { imgProcessor } from './imgProcessor'

const EDGE_TTL_OK = 60 * 60 * 24 * 2 // 2 day
const EDGE_TTL_404 = 60 * 60 // 1 hour

export const fetchGravatar = async (
  c: Context,
  hash: string,
  fallbackSize: string = '200',
): Promise<Response> => {
  // Normalize query params
  const size = c.req.query('s') ?? c.req.query('size') ?? fallbackSize
  const fallback = c.req.query('d') ?? c.req.query('default') ?? '404'
  const initials = c.req.query('initials')
  const name = c.req.query('name')

  const acceptTypeString = c.req.header('Accept')
  const acceptTypes = acceptTypeString !== undefined
    ? acceptTypeString.split(',').map(t => t.trim())
    : ['image/webp']

  const params = new URLSearchParams({
    s: size,
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
        '200-299': EDGE_TTL_OK,
        '404': EDGE_TTL_404,
      },
    },
  })

  if (!res.ok) {
    return c.notFound()
  }

  const contentType = res.headers.get('Content-Type') ?? 'image/jpeg'
  const imageBuffer = await res.arrayBuffer()
  const { data, mime } = await imgProcessor(imageBuffer, contentType, acceptTypes)
  return new Response(data, {
    headers: {
      ...cacheHeaders(res.ok, hash),
      'Content-Type': mime,
    },
  })
}
