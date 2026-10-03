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
  ranges?: Partial<Record<LeaderboardRange, LeaderboardPeriod>>
}

export type LeaderboardRange = '1d' | '3d' | '7d' | '30d'

export interface LeaderboardPeriod {
  entries: LeaderboardEntry[]
  periodStart?: string
  periodEnd?: string
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
    if (!Array.isArray(entries) && !(record?.ranges !== undefined)) {
      return empty
    }
    const baseEntries = Array.isArray(entries) ? entries : []
    const periodStart = parseDate(record?.periodStart)
    const periodEnd = parseDate(record?.periodEnd)
    const validPeriod = periodStart !== undefined && periodEnd !== undefined && periodStart < periodEnd
    const ranges: Partial<Record<LeaderboardRange, LeaderboardPeriod>> = {}
    if (typeof record?.ranges === 'object' && record.ranges !== null && !Array.isArray(record.ranges)) {
      for (const range of ['1d', '3d', '7d', '30d'] as LeaderboardRange[]) {
        const rangeRecord = (record.ranges as Record<string, unknown>)[range]
        if (typeof rangeRecord !== 'object' || rangeRecord === null) {
          continue
        }
        const rangeEntries = (rangeRecord as Record<string, unknown>).entries
        if (!Array.isArray(rangeEntries)) {
          continue
        }
        const rangeStart = parseDate((rangeRecord as Record<string, unknown>).periodStart)
        const rangeEnd = parseDate((rangeRecord as Record<string, unknown>).periodEnd)
        ranges[range] = {
          entries: rangeEntries.filter(isEntry).sort((a, b) => b.requests - a.requests || a.domain.localeCompare(b.domain)).map(entry => ({ ...entry, domain: normalizeDomain(entry.domain) ?? entry.domain })),
          periodStart: rangeStart !== undefined && rangeEnd !== undefined && rangeStart < rangeEnd ? rangeStart : undefined,
          periodEnd: rangeStart !== undefined && rangeEnd !== undefined && rangeStart < rangeEnd ? rangeEnd : undefined,
        }
      }
    }
    return {
      entries: baseEntries.filter(isEntry).sort((a, b) => b.requests - a.requests || a.domain.localeCompare(b.domain)).map(entry => ({ ...entry, domain: normalizeDomain(entry.domain) ?? entry.domain })),
      periodStart: validPeriod ? periodStart : undefined,
      periodEnd: validPeriod ? periodEnd : undefined,
      demo: record?.demo === true,
      ranges: Object.keys(ranges).length > 0 ? ranges : undefined,
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
