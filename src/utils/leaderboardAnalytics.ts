import type { Context } from 'hono'
import type { LeaderboardEntry, LeaderboardRange, LeaderboardSnapshot } from './leaderboard.ts'
import { normalizeDomain, parseLeaderboard } from './leaderboard.ts'

const EVENT_PREFIX = 'lb:event:'
const SNAPSHOT_KEY = 'lb:snapshot:v1'
const EVENT_TTL_SECONDS = 60 * 60 * 24 * 31
const SNAPSHOT_TTL_SECONDS = 60 * 60 * 2
const RANGES: Array<[LeaderboardRange, number]> = [['1d', 1], ['3d', 3], ['7d', 7], ['30d', 30]]

type LeaderboardEnv = CloudflareBindings & { LEADERBOARD_KV?: KVNamespace }
interface LeaderboardEvent {
  domain: string
  bytes: number
  cacheHit: boolean
  timestamp: number
}

const getDomain = (referer: string | undefined): string | undefined => {
  if (referer === undefined) {
    return undefined
  }
  try {
    return normalizeDomain(new URL(referer).hostname)
  }
  catch {
    return undefined
  }
}

const getEvent = (response: Response, c: Context): LeaderboardEvent | undefined => {
  const domain = getDomain(c.req.header('Referer'))
  if (domain === undefined) {
    return undefined
  }
  const bytes = Number.parseInt(response.headers.get('Content-Length') ?? '', 10)
  return {
    domain,
    bytes: Number.isSafeInteger(bytes) && bytes >= 0 ? bytes : 0,
    cacheHit: response.headers.get('X-Gravatar-Transform-Cache') === 'HIT' || response.headers.get('CF-Cache-Status') === 'HIT',
    timestamp: Date.now(),
  }
}

export const recordLeaderboardEvent = (c: Context, response: Response): void => {
  const env = c.env as LeaderboardEnv
  const event = getEvent(response, c)
  if (env.LEADERBOARD_KV === undefined || event === undefined) {
    return
  }
  const day = new Date(event.timestamp).toISOString().slice(0, 10)
  const key = `${EVENT_PREFIX}${day}:${crypto.randomUUID()}`
  c.executionCtx.waitUntil(env.LEADERBOARD_KV.put(key, JSON.stringify(event), { expirationTtl: EVENT_TTL_SECONDS }).catch(() => undefined))
}

const emptyEntry = (domain: string): LeaderboardEntry => ({ domain, requests: 0, bytes: 0, cacheHitRate: 0 })

const aggregate = (events: LeaderboardEvent[], start: number, end: number): LeaderboardEntry[] => {
  const byDomain = new Map<string, LeaderboardEntry & { hits: number }>()
  for (const event of events) {
    if (event.timestamp < start || event.timestamp >= end) {
      continue
    }
    const current = byDomain.get(event.domain) ?? { ...emptyEntry(event.domain), hits: 0 }
    current.requests += 1
    current.bytes += event.bytes
    if (event.cacheHit) {
      current.hits += 1
    }
    byDomain.set(event.domain, current)
  }
  return [...byDomain.values()]
    .map(({ hits, ...entry }) => ({ ...entry, cacheHitRate: entry.requests === 0 ? 0 : hits / entry.requests }))
    .sort((a, b) => b.requests - a.requests || a.domain.localeCompare(b.domain))
}

const readEvents = async (kv: KVNamespace): Promise<LeaderboardEvent[]> => {
  const keys: string[] = []
  let cursor: string | undefined
  do {
    const page = await kv.list({ prefix: EVENT_PREFIX, limit: 1000, cursor })
    keys.push(...page.keys.map(key => key.name))
    cursor = page.list_complete ? undefined : page.cursor
  } while (cursor !== undefined && keys.length < 10_000)

  const events: LeaderboardEvent[] = []
  for (let index = 0; index < keys.length; index += 100) {
    const batch = await kv.get(keys.slice(index, index + 100))
    for (const value of batch.values()) {
      if (value === null) {
        continue
      }
      try {
        const parsed = JSON.parse(value) as Partial<LeaderboardEvent>
        if (typeof parsed.domain === 'string' && typeof parsed.timestamp === 'number' && typeof parsed.bytes === 'number' && typeof parsed.cacheHit === 'boolean') {
          events.push(parsed as LeaderboardEvent)
        }
      }
      catch { /* Ignore expired or malformed event records. */ }
    }
  }
  return events
}

export const refreshLeaderboardSnapshot = async (env: LeaderboardEnv, now = Date.now()): Promise<void> => {
  if (env.LEADERBOARD_KV === undefined) {
    return
  }
  const events = await readEvents(env.LEADERBOARD_KV)
  const ranges = Object.fromEntries(RANGES.map(([range, days]) => {
    const end = now
    const start = end - days * 24 * 60 * 60 * 1000
    return [range, { entries: aggregate(events, start, end), periodStart: new Date(start).toISOString(), periodEnd: new Date(end).toISOString() }]
  })) as LeaderboardSnapshot['ranges']
  const snapshot: LeaderboardSnapshot = { entries: ranges?.['1d']?.entries ?? [], ranges, periodStart: ranges?.['1d']?.periodStart, periodEnd: ranges?.['1d']?.periodEnd, demo: false }
  await env.LEADERBOARD_KV.put(SNAPSHOT_KEY, JSON.stringify(snapshot), { expirationTtl: SNAPSHOT_TTL_SECONDS })
}

export const loadLeaderboardSnapshot = async (env: LeaderboardEnv, fallback?: string): Promise<LeaderboardSnapshot> => {
  if (env.LEADERBOARD_KV !== undefined) {
    try {
      const live = await env.LEADERBOARD_KV.get(SNAPSHOT_KEY, { type: 'text', cacheTtl: 300 })
      if (live !== null) {
        return parseLeaderboard(live)
      }
    }
    catch { /* Fall back to configured data when KV is unavailable. */ }
  }
  return parseLeaderboard(fallback)
}

export { SNAPSHOT_KEY }
