import assert from 'node:assert/strict'
import { it } from 'node:test'
import { getLeaderboardPage, normalizeDomain, parseLeaderboard } from '../src/utils/leaderboard.ts'

const entry = (domain, requests) => ({ domain, requests, bytes: 100, cacheHitRate: 0.9 })
it('normalizes public hostnames and fails closed on non-hostnames', () => {
  assert.equal(normalizeDomain('Private.Example.COM.'), 'private.example.com')
  assert.equal(normalizeDomain('x.io'), 'x.io')
  const invalidDomains = ['127.0.0.1', 'localhost', '<script>', 'https://private.example.com/path', 'email@example.com', `${'a'.repeat(64)}.com`, `${`${'a'.repeat(63)}.`.repeat(4)}com`]
  for (const value of invalidDomains) {
    assert.equal(normalizeDomain(value), undefined)
    assert.equal(parseLeaderboard(JSON.stringify([entry(value, 5)])).entries.length, 0)
  }
  const snapshot = parseLeaderboard(JSON.stringify([entry('private.example.com', 5)]))
  assert.equal(snapshot.entries[0].domain, 'private.example.com')
})
it('validates snapshots, retains legacy arrays, sorts before paging without a top-100 cutoff', () => {
  const entries = Array.from({ length: 123 }, (_, index) => entry(`site${index}.example.com`, index))
  const result = parseLeaderboard(JSON.stringify({ entries: [...entries, entry('bad.com', -1)], periodStart: '2026-10-01T00:00:00Z', periodEnd: '2026-10-02T00:00:00Z', demo: true }))
  assert.equal(result.entries.length, 123)
  assert.equal(result.entries[0].requests, 122)
  assert.equal(result.entries[122].requests, 0)
  assert.equal(result.demo, true)
  assert.equal(result.ranges, undefined)
  const ranged = parseLeaderboard(JSON.stringify({ ranges: { '1d': { entries: [entry('one.example.com', 3)], periodStart: '2026-10-01T00:00:00Z', periodEnd: '2026-10-02T00:00:00Z' } } }))
  assert.equal(ranged.ranges?.['1d']?.entries[0].domain, 'one.example.com')
  assert.equal(result.periodStart, '2026-10-01T00:00:00.000Z')
  assert.equal(parseLeaderboard(JSON.stringify({ entries: [entry('explicit.example.com', 1)], periodStart: '2026-10-01T00:00:00.000Z', periodEnd: '2026-10-02T00:00:00.000Z' })).periodStart, '2026-10-01T00:00:00.000Z')
  assert.equal(parseLeaderboard(JSON.stringify(entries)).periodStart, undefined)
  assert.deepEqual(parseLeaderboard('invalid'), { entries: [], demo: false })
  assert.equal(parseLeaderboard(JSON.stringify({ entries, periodStart: '2026-10-03T00:00:00Z', periodEnd: '2026-10-02T00:00:00Z' })).periodStart, undefined)
  assert.equal(parseLeaderboard(JSON.stringify({ entries, periodStart: '2026-02-30T00:00:00Z', periodEnd: '2026-03-02T00:00:00Z' })).periodStart, undefined)
  assert.equal(parseLeaderboard(JSON.stringify({ entries, periodStart: '2026-99-99T00:00:00Z', periodEnd: '2026-03-02T00:00:00Z' })).entries.length, 123)
  assert.equal(parseLeaderboard(JSON.stringify([{ ...entry('huge.example.com', 1), bytes: 1e100 }])).entries.length, 0)
})
it('clamps pagination and rejects malformed or enormous page numbers', () => {
  assert.deepEqual(getLeaderboardPage(123, '13'), { page: 13, pages: 13, offset: 120 })
  assert.equal(getLeaderboardPage(23, '999').page, 3)
  for (const query of ['0', '-1', 'NaN', '1e3', '2.5', '9'.repeat(400)]) {
    assert.equal(getLeaderboardPage(23, query).page, 1)
  }
  assert.deepEqual(getLeaderboardPage(0, '3'), { page: 1, pages: 1, offset: 0 })
})
