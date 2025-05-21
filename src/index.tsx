import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { secureHeaders } from 'hono/secure-headers'
import { md5 } from 'hono/utils/crypto'
import ApiDocs from './ApiDocs'
import { renderer } from './renderer'
import { emailSchema, hashSchema } from './schemas'
import { fetchGravatar } from './utils'

const DEFAULT_CAHE = 30 // 30 s

const app = new Hono()

app.use(secureHeaders())
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
  const hash = await md5(result.data)
  return fetchGravatar(c, hash)
})

export default app
