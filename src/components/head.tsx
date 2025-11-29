import { Link, ViteClient } from 'vite-ssr-components/hono'

const Head = () => {
  // TODO: Add dynamic title and description support
  return (
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="icon" href="favicon.ico" type="image/x-icon" />
      <title>ZLA Gravatar CDN - Fast & Modern Avatar Proxy with WebP/AVIF Support</title>
      <meta name="author" content="ZL Asica" />
      <meta name="generator" content="Hono JSX" />
      <meta name="creator" content="ZL Asica" />
      <meta name="publisher" content="ZL Asica" />
      {/* SEO */}
      <meta name="keywords" content="Gravatar CDN, Avatar Proxy, WebP, AVIF, Cloudflare Workers, Fast Avatar Service, Image Optimization, Modern Gravatar, ZL Asica" />
      <meta name="description" content="A fast, modern, and cache-friendly Gravatar CDN proxy built with Cloudflare Workers. Supports WebP/AVIF conversion, intelligent caching, and MD5/SHA-256 hash lookups." />
      <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <meta name="apple-mobile-web-app-title" content="Gravatar CDN" />
      <link rel="manifest" href="/site.webmanifest" />
      {/* Open Graph */}
      <meta property="og:site_name" content="ZLA Gravatar CDN" />
      <meta property="og:title" content="ZLA Gravatar CDN - Fast & Modern Avatar Proxy" />
      <meta property="og:description" content="A fast, modern, and cache-friendly Gravatar CDN proxy built with Cloudflare Workers. Supports WebP/AVIF conversion, intelligent caching, and MD5/SHA-256 hash lookups." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://gravatar.zla.app/" />
      <meta property="og:image" content="https://gravatar.zla.app/og-image.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="ZLA Gravatar CDN - Modern Avatar Proxy Service" />
      <meta property="og:locale" content="en_US" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@ZL_Asica" />
      <meta name="twitter:creator" content="@ZL_Asica" />
      <meta name="twitter:title" content="ZLA Gravatar CDN - Fast & Modern Avatar Proxy" />
      <meta name="twitter:description" content="A fast, modern, and cache-friendly Gravatar CDN proxy built with Cloudflare Workers. Supports WebP/AVIF conversion, intelligent caching, and MD5/SHA-256 hash lookups." />
      <meta name="twitter:image" content="https://gravatar.zla.app/og-image.png" />
      <meta name="twitter:image:alt" content="ZLA Gravatar CDN - Modern Avatar Proxy Service" />
      {/* Additional SEO */}
      <link rel="canonical" href="https://gravatar.zla.app/" />
      <meta name="theme-color" content="#FFFFFF" />
      <meta name="application-name" content="ZLA Gravatar CDN" />
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      <link rel="dns-prefetch" href="https://www.gravatar.com" />
      {/* Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet" />
      {/* <link
        href={import.meta.env.PROD ? `/assets/style.css` : `/src/style.css`}
        rel="stylesheet"
      /> */}
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': 'ZLA Gravatar CDN',
          'url': 'https://gravatar.zla.app/',
          'description': 'A fast, modern, and cache-friendly Gravatar CDN proxy built with Cloudflare Workers. Supports WebP/AVIF conversion, intelligent caching, and MD5/SHA-256 hash lookups.',
          'keywords': ['Gravatar CDN', 'Avatar Proxy', 'WebP', 'AVIF', 'Cloudflare Workers', 'Image Optimization'],
          'applicationCategory': 'WebApplication',
          'operatingSystem': 'Any',
          'author': {
            '@type': 'Person',
            'name': 'Zhuoran (Elara) Liu',
            'additionalName': 'ZL Asica',
            'url': 'https://zla.pub/',
            'sameAs': [
              'https://github.com/ZL-Asica/',
              'https://elaraliu.com/',
            ],
          },
          'publisher': {
            '@type': 'Person',
            'name': 'Zhuoran (Elara) Liu',
            'url': 'https://zla.pub/',
          },
          'editor': 'Zhuoran (Elara) Liu',
          'codeRepository': 'https://github.com/ZL-Asica/Gravatar-Worker',
          'license': 'https://github.com/ZL-Asica/Gravatar-Worker/blob/main/LICENSE',
          'isBasedOn': 'https://www.gravatar.com/',
        })}
      </script>
      <ViteClient />
      <Link href="/src/style.css" rel="stylesheet" />
    </head>
  )
}

export default Head
