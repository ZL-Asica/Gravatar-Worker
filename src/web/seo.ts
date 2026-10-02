import { getMessages, resolveLocale } from '../i18n'

const toAbsoluteUrl = (base: string, pathOrUrl: string) => {
  try {
    return new URL(pathOrUrl, base).toString()
  }
  catch {
    return pathOrUrl
  }
}

export const buildHead = (config: SiteConfig, requestUrl: URL, acceptLanguage?: string): HeadMeta => {
  const locale = resolveLocale(requestUrl.searchParams.get('lang') ?? undefined, acceptLanguage)
  const messages = getMessages(locale)
  const siteUrl = config.branding.siteUrl ?? requestUrl.origin
  const canonicalUrl = toAbsoluteUrl(siteUrl, `${requestUrl.pathname}?lang=${locale}`)
  const ogImageUrl = toAbsoluteUrl(siteUrl, config.branding.ogImageUrl)
  const title = config.branding.siteTagline !== undefined
    ? `${config.branding.siteName} - ${config.branding.siteTagline}`
    : config.branding.siteName

  return {
    title: locale === 'en' ? title : `${config.branding.siteName} - ${messages.eyebrow}`,
    description: locale === 'en' ? config.branding.siteDescription : messages.subtitle,
    canonicalUrl,
    ogImageUrl,
    robotsMeta: config.seo.robotsMeta,
    siteName: config.branding.siteName,
  }
}
