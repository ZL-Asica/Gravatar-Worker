import { jsxRenderer } from 'hono/jsx-renderer'
import Head from './components/head'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="en">
      <Head />
      <body>{children}</body>
    </html>
  )
})
