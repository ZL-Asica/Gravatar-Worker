export const FALLBACK_EMAIL = 'email@example.com'

const MIME_PRIORITY = ['image/avif', 'image/webp', 'image/jpeg', 'image/png'] as const
const WILDCARD_PRIORITY = ['image/webp', 'image/jpeg', 'image/png'] as const

export type PreferredImageMime = (typeof MIME_PRIORITY)[number]

const isValidEmail = (email: string): boolean => {
  if ([...email].some(char => char.trim().length === 0)) {
    return false
  }

  const parts = email.split('@')
  if (parts.length !== 2 || parts.some(part => part.length === 0)) {
    return false
  }

  const [, domain] = parts
  return domain.split('.').every(part => part.length > 0) && domain.includes('.')
}

export const normalizeEmail = (email: string | undefined): string | undefined => {
  const normalized = email?.trim().toLowerCase()
  if (normalized === undefined || normalized.length === 0) {
    return undefined
  }
  return isValidEmail(normalized) ? normalized : undefined
}

export const resolveLookupEmail = (email: string | undefined): string => {
  return normalizeEmail(email) ?? FALLBACK_EMAIL
}

interface AcceptedMime {
  mime: PreferredImageMime
  q: number
  priority: number
}

const parseAcceptPart = (part: string): { mediaRange: string, q: number } | undefined => {
  const [rawMediaRange, ...params] = part.split(';').map(value => value.trim())
  const mediaRange = rawMediaRange?.toLowerCase()
  if (mediaRange === undefined || mediaRange.length === 0) {
    return undefined
  }

  const qParam = params.find(param => param.toLowerCase().startsWith('q='))
  const q = qParam === undefined ? 1 : Number.parseFloat(qParam.slice(2))
  if (!Number.isFinite(q) || q < 0) {
    return undefined
  }

  return { mediaRange, q: Math.min(q, 1) }
}

const addAcceptedMime = (
  accepted: Map<PreferredImageMime, AcceptedMime>,
  mime: PreferredImageMime,
  q: number,
) => {
  const priority = MIME_PRIORITY.indexOf(mime)
  const existing = accepted.get(mime)
  if (existing === undefined || q > existing.q) {
    accepted.set(mime, { mime, q, priority })
  }
}

export const parseAcceptHeader = (acceptHeader: string | undefined): PreferredImageMime[] => {
  if (acceptHeader === undefined || acceptHeader.trim().length === 0) {
    return ['image/webp']
  }

  const accepted = new Map<PreferredImageMime, AcceptedMime>()
  const rejected = new Set<PreferredImageMime>()
  for (const part of acceptHeader.split(',')) {
    const parsed = parseAcceptPart(part)
    if (parsed === undefined) {
      continue
    }

    const explicitMime = MIME_PRIORITY.find(mime => mime === parsed.mediaRange)
    if (explicitMime !== undefined) {
      if (parsed.q === 0) {
        accepted.delete(explicitMime)
        rejected.add(explicitMime)
        continue
      }
      addAcceptedMime(accepted, explicitMime, parsed.q)
      continue
    }

    if (parsed.mediaRange === 'image/*' || parsed.mediaRange === '*/*') {
      for (const mime of WILDCARD_PRIORITY) {
        if (!rejected.has(mime) && parsed.q > 0) {
          addAcceptedMime(accepted, mime, parsed.q)
        }
      }
    }
  }

  return [...accepted.values()]
    .sort((a, b) => b.q - a.q || a.priority - b.priority)
    .map(({ mime }) => mime)
}
