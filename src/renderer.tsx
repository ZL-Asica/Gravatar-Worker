import { jsxRenderer } from 'hono/jsx-renderer'
import Head from './components/head'
import { loadConfig } from './config'
import { buildHead } from './web/seo'

export const renderer = jsxRenderer(({ children }, c) => {
  const config = loadConfig(c.env as EnvRecord)
  const meta = buildHead(config, new URL(c.req.url))
  return (
    <html lang="en">
      <Head config={config} meta={meta} />
      <body>{children}</body>
    </html>
  )
})
