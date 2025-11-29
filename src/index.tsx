import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { cors } from 'hono/cors'
import { poweredBy } from 'hono/powered-by'
import { secureHeaders } from 'hono/secure-headers'
import { sha256 } from 'hono/utils/crypto'
import ApiDocs from './components/api-docs'
import { renderer } from './renderer'
import { fetchGravatar } from './utils'

const DEFAULT_CACHE = 5 * 60 // 5 minutes

interface Bindings {
  HASH: string
  DEFAULT_SIZE: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(cors())
app.use(poweredBy({ serverName: 'ZL Asica with Hono' }))
app.use(
  secureHeaders({
    crossOriginEmbedderPolicy: false, // no COEP
    crossOriginResourcePolicy: false, // no CORP
    crossOriginOpenerPolicy: 'unsafe-none', // allow cross-origin opener
    xContentTypeOptions: 'nosniff', // nosniff for content/type
    xPermittedCrossDomainPolicies: false, // Turn off cross-domain policy
  }),
)

app.use(renderer)

app.get(
  '*',
  cache({
    cacheName: 'zla-gravatar',
    cacheControl: `max-age=${DEFAULT_CACHE}`,
  }),
)

app.get('/', c => c.render(<ApiDocs />))

// Your own gravatar link
app.get('/avatar/me', async (c) => {
  const hash = c.env.HASH
  const defaultSize = c.env.DEFAULT_SIZE ?? 512
  if (hash === undefined) {
    return c.text('Set `HASH` in your Cloudflare Worker Settings Environment Variables to enable this endpoint.')
  }
  return fetchGravatar(c, hash, defaultSize)
})

// Hash route
app.get('/avatar/:hash', async (c) => {
  const hashValue = c.req.param('hash')

  return fetchGravatar(c, hashValue)
})

// Email as query
app.get('/avatar', async (c) => {
  const emailValue = c.req.query('email') ?? 'email@example.com'
  const hash = await sha256(emailValue)

  if (hash === null) {
    return c.text('Internal Server Error', 500)
  }
  return fetchGravatar(c, hash)
})

export default app
