const toAbsoluteUrl = (base: string, pathOrUrl: string) => {
  try {
    return new URL(pathOrUrl, base).toString()
  }
  catch {
    return pathOrUrl
  }
}

export const buildHead = (config: SiteConfig, requestUrl: URL): HeadMeta => {
  const siteUrl = config.branding.siteUrl ?? requestUrl.origin
  const canonicalUrl = toAbsoluteUrl(siteUrl, requestUrl.pathname === '/' ? '/' : requestUrl.pathname)
  const ogImageUrl = toAbsoluteUrl(siteUrl, config.branding.ogImageUrl)
  const title = config.branding.siteTagline !== undefined
    ? `${config.branding.siteName} - ${config.branding.siteTagline}`
    : config.branding.siteName

  return {
    title,
    description: config.branding.siteDescription,
    canonicalUrl,
    ogImageUrl,
    robotsMeta: config.seo.robotsMeta,
    siteName: config.branding.siteName,
  }
}
