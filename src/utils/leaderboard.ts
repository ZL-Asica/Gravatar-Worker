export interface LeaderboardEntry {
  domain: string
  requests: number
  bytes: number
  cacheHitRate: number
}

export interface LeaderboardSnapshot {
  entries: LeaderboardEntry[]
  periodStart?: string
  periodEnd?: string
  demo: boolean
}

export const LEADERBOARD_PAGE_SIZE = 10

export const normalizeDomain = (domain: string): string | undefined => {
  const hostname = domain.trim().toLowerCase().replace(/\.$/, '')
  if (hostname.length > 253 || hostname.split('.').some(label => label.length > 63)) {
    return undefined
  }
  return /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}$/.test(hostname) ? hostname : undefined
}

const isEntry = (entry: unknown): entry is LeaderboardEntry => {
  if (typeof entry !== 'object' || entry === null) {
    return false
  }
  const value = entry as Record<string, unknown>
  return typeof value.domain === 'string' && normalizeDomain(value.domain) !== undefined
    && typeof value.requests === 'number' && Number.isSafeInteger(value.requests) && value.requests >= 0
    && typeof value.bytes === 'number' && Number.isSafeInteger(value.bytes) && value.bytes >= 0
    && typeof value.cacheHitRate === 'number' && Number.isFinite(value.cacheHitRate) && value.cacheHitRate >= 0 && value.cacheHitRate <= 1
}

const parseDate = (value: unknown): string | undefined => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) {
    return undefined
  }
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) {
    return undefined
  }
  const canonical = date.toISOString()
  const normalized = value.replace('.000Z', 'Z')
  if (canonical.replace('.000Z', 'Z') !== normalized) {
    return undefined
  }
  return date.toISOString()
}

export const parseLeaderboard = (raw?: string): LeaderboardSnapshot => {
  const empty: LeaderboardSnapshot = { entries: [], demo: false }
  try {
    const parsed: unknown = JSON.parse(raw ?? '[]')
    const record = typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? parsed as Record<string, unknown> : undefined
    const entries = Array.isArray(parsed) ? parsed : record?.entries
    if (!Array.isArray(entries)) {
      return empty
    }
    const periodStart = parseDate(record?.periodStart)
    const periodEnd = parseDate(record?.periodEnd)
    const validPeriod = periodStart !== undefined && periodEnd !== undefined && periodStart < periodEnd
    return {
      entries: entries.filter(isEntry).sort((a, b) => b.requests - a.requests || a.domain.localeCompare(b.domain)).map(entry => ({ ...entry, domain: normalizeDomain(entry.domain) ?? entry.domain })),
      periodStart: validPeriod ? periodStart : undefined,
      periodEnd: validPeriod ? periodEnd : undefined,
      demo: record?.demo === true,
    }
  }
  catch {
    return empty
  }
}

export const getLeaderboardPage = (count: number, value?: string) => {
  const pages = Math.max(1, Math.ceil(count / LEADERBOARD_PAGE_SIZE))
  const requested = value !== undefined && /^\d{1,9}$/.test(value) ? Number(value) : 1
  const page = Math.min(Math.max(requested, 1), pages)
  return { page, pages, offset: (page - 1) * LEADERBOARD_PAGE_SIZE }
}
