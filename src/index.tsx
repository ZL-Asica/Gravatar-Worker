import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { cors } from 'hono/cors'
import { poweredBy } from 'hono/powered-by'
import { secureHeaders } from 'hono/secure-headers'
import { sha256 } from 'hono/utils/crypto'
import ApiDocs from './ApiDocs'
import { renderer } from './renderer'
import { emailSchema, hashSchema } from './schemas'
import { fetchGravatar } from './utils'

const DEFAULT_CAHE = 30 // 30 s

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
    cacheControl: `max-age=${DEFAULT_CAHE}`,
  }),
)

app.get('/', async c => c.render(ApiDocs()))

// Your own gravatar link
app.get('/avatar/me', async (c) => {
  const hash = c.env.HASH
  const defaultSize = c.env.DEFAULT_SIZE ?? 512
  if (hash === undefined) {
    return c.text('Set `HASH` in your Cloudflare Worker Settings Enviroment Variables to enbale this endpoint.')
  }
  return fetchGravatar(c, hash, defaultSize)
})

// Hash route
app.get('/avatar/:hash', async (c) => {
  const result = hashSchema.safeParse(c.req.param('hash'))
  let hashValue = result.data

  if (!result.success || hashValue === undefined) {
    hashValue = c.req.param('hash')?.trim() ?? ''
  }

  return fetchGravatar(c, hashValue)
})

// Email as query
app.get('/avatar', async (c) => {
  const result = emailSchema.safeParse(c.req.query('email'))
  let emailValue = result.data

  if (!result.success || emailValue === undefined) {
    emailValue = c.req.query('email')?.trim() ?? 'email@example.com'
  }

  const hash = await sha256(emailValue)

  if (hash === null) {
    return c.text('Internal Server Error', 500)
  }
  return fetchGravatar(c, hash)
})

export default app
