const Head = () => {
  return (
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* Not allow scralwer for now */}
      <meta name="robots" content="noindex, nofollow, noarchive" />
      <link rel="icon" href="favicon.ico" type="image/x-icon" />
      <title>ZLA Gravatar CDN</title>
      <meta name="author" content="ZL Asica" />
      <meta name="generator" content="Hono JSX" />
      <meta name="creator" content="ZL Asica" />
      <meta name="publisher" content="ZL Asica" />
      {/* SEO */}
      <meta name="keywords" content="Gravatar, CDN, ZL Asica, Cloudflare Workers" />
      <meta name="description" content="A fast and privacy-focused Gravatar CDN powered by Cloudflare Workers." />
      {/* Open Graph */}
      <meta property="og:title" content="ZLA Gravatar CDN" />
      <meta property="og:description" content="A fast and privacy-focused Gravatar CDN powered by Cloudflare Workers." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://gravatar.zla.app/" />
      <meta property="og:image" content="https://gravatar.zla.app/og-image.png" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="ZLA Gravatar CDN" />
      <meta name="twitter:description" content="A fast and privacy-focused Gravatar CDN powered by Cloudflare Workers." />
      <meta name="twitter:image" content="https://gravatar.zla.app/og-image.png" />
      <link rel="canonical" href="https://gravatar.zla.app/" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet" />
      <link
        href={import.meta.env.PROD ? `/assets/style.css` : `/src/style.css`}
        rel="stylesheet"
      />
    </head>
  )
}

export default Head
