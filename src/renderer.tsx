import { jsxRenderer } from 'hono/jsx-renderer'
import Head from './components/head'
import { loadConfig } from './config'
import { resolveLocale } from './i18n'
import { buildHead } from './web/seo'

export const renderer = jsxRenderer(({ children }, c) => {
  const config = loadConfig(c.env as Partial<CloudflareBindings>)
  const meta = buildHead(config, new URL(c.req.url), c.req.header('Accept-Language'))
  const requestUrl = new URL(c.req.url)
  const locale = resolveLocale(requestUrl.searchParams.get('lang') ?? undefined, c.req.header('Accept-Language'))
  return (
    <html lang={locale}>
      <Head config={config} meta={meta} locale={locale} />
      <body>{children}</body>
    </html>
  )
})
