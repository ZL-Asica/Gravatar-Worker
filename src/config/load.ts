import { clamp } from '@zl-asica/react/utils'
import { DEFAULT_CONFIG } from './defaults'

const normalizeString = (value: string | undefined) => {
  if (value === undefined) {
    return undefined
  }
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const parseBoolean = (value: string | undefined): boolean | undefined => {
  if (value === undefined) {
    return undefined
  }
  const normalized = value.trim().toLowerCase()
  if (normalized === 'true' || normalized === '1') {
    return true
  }
  if (normalized === 'false' || normalized === '0') {
    return false
  }
  return undefined
}

const parseNumber = (value: string | undefined): number | undefined => {
  if (value === undefined) {
    return undefined
  }
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : undefined
}

const parseRobots = (value: string | undefined, fallback: SiteConfig['seo']) => {
  if (value === undefined) {
    return fallback
  }
  const parsed = parseBoolean(value)
  if (parsed !== undefined) {
    return {
      ...fallback,
      robotsAllow: parsed,
    }
  }
  return {
    robotsAllow: null,
    robotsMeta: value,
  }
}

export const loadConfig = (env: EnvRecord = {}): SiteConfig => {
  const defaults = DEFAULT_CONFIG

  const maxSize = clamp(
    parseNumber(env.MAX_SIZE) ?? defaults.api.maxSize,
    64,
    4096,
  )

  const defaultSize = clamp(
    parseNumber(env.DEFAULT_SIZE) ?? defaults.api.defaultSize,
    16,
    maxSize,
  )

  const browserTtlOk = clamp(
    parseNumber(env.CACHE_TTL_BROWSER) ?? defaults.cache.browserTtlOk,
    60,
    60 * 60 * 24 * 365,
  )

  const edgeTtlOk = clamp(
    parseNumber(env.CACHE_TTL_EDGE) ?? defaults.cache.edgeTtlOk,
    60,
    60 * 60 * 24 * 365,
  )

  return {
    branding: {
      siteName: normalizeString(env.SITE_NAME) ?? defaults.branding.siteName,
      siteTagline: normalizeString(env.SITE_TAGLINE) ?? defaults.branding.siteTagline,
      siteDescription: normalizeString(env.SITE_DESCRIPTION) ?? defaults.branding.siteDescription,
      siteUrl: normalizeString(env.SITE_URL) ?? defaults.branding.siteUrl,
      ogImageUrl: normalizeString(env.OG_IMAGE_URL) ?? defaults.branding.ogImageUrl,
      faviconPath: normalizeString(env.FAVICON_PATH) ?? defaults.branding.faviconPath,
      footerText: normalizeString(env.FOOTER_TEXT) ?? defaults.branding.footerText,
      contactUrl: normalizeString(env.CONTACT_URL) ?? defaults.branding.contactUrl,
    },
    seo: parseRobots(env.ROBOTS_ALLOW, defaults.seo),
    api: {
      meEmail: normalizeString(env.ME_EMAIL) ?? defaults.api.meEmail,
      meHash: normalizeString(env.ME_HASH) ?? normalizeString(env.HASH) ?? defaults.api.meHash,
      allowRawEmail: parseBoolean(env.ALLOW_RAW_EMAIL) ?? defaults.api.allowRawEmail,
      defaultSize,
      maxSize,
    },
    cache: {
      browserTtlOk,
      browserTtl404: Math.min(defaults.cache.browserTtl404, browserTtlOk),
      edgeTtlOk,
      edgeTtl404: Math.min(defaults.cache.edgeTtl404, edgeTtlOk),
      staleRevalidateOk: defaults.cache.staleRevalidateOk,
      staleRevalidate404: defaults.cache.staleRevalidate404,
      htmlTtl: clamp(defaults.cache.htmlTtl, 60, 60 * 60 * 24),
    },
  }
}
