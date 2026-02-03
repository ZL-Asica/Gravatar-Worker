import { Link, ViteClient } from 'vite-ssr-components/hono'

interface HeadProps {
  config: SiteConfig
  meta: HeadMeta
}

const Head = ({ config, meta }: HeadProps) => {
  return (
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content={meta.robotsMeta} />
      <link rel="icon" href={config.branding.faviconPath} type="image/x-icon" />
      <title>{meta.title}</title>
      <meta name="author" content={meta.siteName} />
      <meta name="generator" content="Hono JSX" />
      <meta name="creator" content={meta.siteName} />
      <meta name="publisher" content={meta.siteName} />
      {/* SEO */}
      <meta name="keywords" content={`Gravatar CDN, Avatar Proxy, WebP, AVIF, Cloudflare Workers, Fast Avatar Service, Image Optimization, Modern Gravatar, ${meta.siteName}`} />
      <meta name="description" content={meta.description} />
      <meta name="apple-mobile-web-app-title" content={meta.siteName} />
      {/* Open Graph */}
      <meta property="og:site_name" content={meta.siteName} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={meta.canonicalUrl} />
      <meta property="og:image" content={meta.ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${meta.siteName} - Modern Gravatar Proxy Service`} />
      <meta property="og:locale" content="en_US" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.ogImageUrl} />
      <meta name="twitter:image:alt" content={`${meta.siteName} - Modern Gravatar Proxy Service`} />
      {/* Additional SEO */}
      <link rel="canonical" href={meta.canonicalUrl} />
      <meta name="theme-color" content="#FFFFFF" />
      <meta name="application-name" content={meta.siteName} />
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      <link rel="dns-prefetch" href="https://www.gravatar.com" />
      {/* Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet" />
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': meta.siteName,
          'url': meta.canonicalUrl,
          'description': meta.description,
          'keywords': ['Gravatar CDN', 'Avatar Proxy', 'WebP', 'AVIF', 'Cloudflare Workers', 'Image Optimization'],
          'applicationCategory': 'WebApplication',
          'operatingSystem': 'Any',
          'author': {
            '@type': 'Person',
            'name': meta.siteName,
            'url': config.branding.contactUrl ?? meta.canonicalUrl,
          },
          'publisher': {
            '@type': 'Person',
            'name': meta.siteName,
            'url': config.branding.contactUrl ?? meta.canonicalUrl,
          },
          'editor': meta.siteName,
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
