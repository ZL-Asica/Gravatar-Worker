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

const app = new Hono()

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

// Hash route
app.get('/avatar/:hash', async (c) => {
  const result = hashSchema.safeParse(c.req.param('hash'))
  if (!result.success || result.data === undefined) {
    return c.text('Invalid hash value', 400)
  }
  return fetchGravatar(c, result.data)
})

// Email as query
app.get('/avatar', async (c) => {
  const result = emailSchema.safeParse(c.req.query('email'))
  if (!result.success || result.data === undefined) {
    return c.text('Invalid email address', 400)
  }
  const hash = await sha256(result.data)
  if (hash === null) {
    return c.text('Internal Server Error', 500)
  }
  return fetchGravatar(c, hash)
})

export default app
