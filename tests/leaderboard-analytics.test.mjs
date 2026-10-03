import assert from 'node:assert/strict'
import { it } from 'node:test'
import { loadLeaderboardSnapshot, refreshLeaderboardSnapshot, SNAPSHOT_KEY } from '../src/utils/leaderboardAnalytics.ts'

const makeKv = (initial = {}) => {
  const values = new Map(Object.entries(initial))
  return {
    values,
    async list() {
      return { keys: [...values.keys()].filter(key => key.startsWith('lb:event:')).map(name => ({ name })), list_complete: true }
    },
    async get(keys) {
      if (Array.isArray(keys)) {
        return new Map(keys.map(key => [key, values.get(key) ?? null]))
      }
      return values.get(keys) ?? null
    },
    async put(key, value) {
      values.set(key, value)
    },
  }
}

it('aggregates KV events into all configured leaderboard ranges', async () => {
  const now = Date.parse('2026-10-03T00:00:00.000Z')
  const kv = makeKv({
    'lb:event:2026-10-02:a': JSON.stringify({ domain: 'one.example.com', bytes: 100, cacheHit: true, timestamp: now - 60_000 }),
    'lb:event:2026-10-01:b': JSON.stringify({ domain: 'one.example.com', bytes: 200, cacheHit: false, timestamp: now - 2 * 24 * 60 * 60 * 1000 }),
    'lb:event:2026-09-01:c': JSON.stringify({ domain: 'two.example.com', bytes: 300, cacheHit: true, timestamp: now - 32 * 24 * 60 * 60 * 1000 }),
  })

  await refreshLeaderboardSnapshot({ LEADERBOARD_KV: kv }, now)
  const snapshot = JSON.parse(kv.values.get(SNAPSHOT_KEY))
  assert.equal(snapshot.ranges['1d'].entries[0].requests, 1)
  assert.equal(snapshot.ranges['3d'].entries[0].requests, 2)
  assert.equal(snapshot.ranges['3d'].entries[0].cacheHitRate, 0.5)
  assert.equal(snapshot.ranges['30d'].entries.length, 1)
})

it('falls back to configured data when the snapshot is unavailable', async () => {
  const fallback = JSON.stringify([{ domain: 'fallback.example.com', requests: 3, bytes: 4, cacheHitRate: 1 }])
  const snapshot = await loadLeaderboardSnapshot({ LEADERBOARD_KV: makeKv() }, fallback)
  assert.equal(snapshot.entries[0].domain, 'fallback.example.com')
})
