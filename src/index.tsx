import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { cors } from 'hono/cors'
import { poweredBy } from 'hono/powered-by'
import { secureHeaders } from 'hono/secure-headers'
import { sha256 } from 'hono/utils/crypto'
import ApiDocs from './components/api-docs'
import { loadConfig } from './config'
import { renderer } from './renderer'
import { fetchGravatar } from './utils'

const app = new Hono<{ Bindings: EnvRecord }>()

app.use(cors())
app.use(poweredBy({ serverName: 'Gravatar Worker built by ZL Asica with Hono' }))
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

app.use('*', async (c, next) => {
  const config = loadConfig(c.env)
  return cache({
    cacheName: 'zla-gravatar-worker',
    cacheControl: `max-age=${config.cache.htmlTtl}`,
  // eslint-disable-next-line ts/no-unsafe-argument
  })(c, next)
})

app.get('/', (c) => {
  const config = loadConfig(c.env)
  return c.render(<ApiDocs config={config} />)
})

app.get('/robots.txt', (c) => {
  const config = loadConfig(c.env)
  const siteUrl = config.branding.siteUrl ?? new URL(c.req.url).origin
  if (config.seo.robotsAllow === false) {
    return c.text('User-agent: *\nDisallow: /', 200, {
      'Content-Type': 'text/plain; charset=utf-8',
    })
  }
  const lines = [
    'User-agent: *',
    'Allow: /',
    `Sitemap: ${new URL('/sitemap.xml', siteUrl).toString()}`,
  ]
  return c.text(`${lines.join('\n')}\n`, 200, {
    'Content-Type': 'text/plain; charset=utf-8',
  })
})

app.get('/sitemap.xml', (c) => {
  const config = loadConfig(c.env)
  const siteUrl = config.branding.siteUrl ?? new URL(c.req.url).origin
  const now = new Date().toISOString().split('T')[0]
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl.replace(/\/$/, '')}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
  return c.text(sitemap, 200, {
    'Content-Type': 'application/xml; charset=utf-8',
  })
})

// Your own gravatar link
app.get('/avatar/me', async (c) => {
  const config = loadConfig(c.env)
  const hash = config.api.meHash
  if (hash === undefined && config.api.meEmail === undefined) {
    return c.text('Set `ME_EMAIL` or `ME_HASH` (legacy: `HASH`) in your Cloudflare Worker environment variables to enable this endpoint.')
  }
  const resolvedHash = hash ?? await sha256(config.api.meEmail ?? '')
  if (resolvedHash === null) {
    return c.text('Internal Server Error', 500)
  }
  return fetchGravatar(c, resolvedHash, config, config.api.defaultSize)
})

// Hash route
app.get('/avatar/:hash', async (c) => {
  const config = loadConfig(c.env)
  const hashValue = c.req.param('hash')

  return fetchGravatar(c, hashValue, config)
})

// Email as query
app.get('/avatar', async (c) => {
  const config = loadConfig(c.env)
  if (!config.api.allowRawEmail) {
    return c.text('Raw email lookup is disabled on this deployment.', 403)
  }
  const emailValue = c.req.query('email') ?? 'email@example.com'
  const hash = await sha256(emailValue)

  if (hash === null) {
    return c.text('Internal Server Error', 500)
  }
  return fetchGravatar(c, hash, config)
})

export default app
