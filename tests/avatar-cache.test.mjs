import assert from 'node:assert/strict'
import { it } from 'vitest'
import { getTransformCacheKey, readTransformCache, writeTransformCache } from '../src/utils/avatarCache.ts'

it('keys isolate image formats, sizes and effective initials', () => {
  const key = (size, fallback, initials, name, format) => getTransformCacheKey('https://test.example/avatar/a', 'a', size, fallback, initials, name, format).url
  assert.notEqual(key(64, '404', undefined, undefined, 'image/avif'), key(64, '404', undefined, undefined, 'image/webp'))
  assert.notEqual(key(64, '404'), key(200, '404'))
  assert.equal(key(64, '404', 'A', 'unused'), key(64, '404'))
  assert.equal(key(64, 'initials', 'A', 'unused'), key(64, 'initials', 'A'))
  assert.notEqual(key(64, 'initials', 'A'), key(64, 'initials', 'B'))
})

it('unavailable or failing cache never fails avatar requests', async () => {
  const key = new Request('https://test.example/cache')
  delete globalThis.caches
  assert.equal(await readTransformCache(key), undefined)
  await writeTransformCache(key, new Response('image'), 600)
  globalThis.caches = { default: {
    match: async () => { throw new Error('read failed') },
    put: async () => { throw new Error('write failed') },
  } }
  assert.equal(await readTransformCache(key), undefined)
  await assert.doesNotReject(writeTransformCache(key, new Response('image'), 600))
  delete globalThis.caches
})

it('cache writes use edge TTL and retain the original response headers', async () => {
  const key = new Request('https://test.example/cache')
  let stored
  globalThis.caches = { default: { put: async (_, response) => {
    stored = response
  } } }
  const response = new Response('image', { headers: { 'Vary': 'Accept', 'Cache-Control': 'max-age=60', 'Content-Type': 'image/webp' } })
  await writeTransformCache(key, response.clone(), 600)
  assert.equal(stored.headers.get('Cache-Control'), 'public, max-age=600')
  assert.equal(stored.headers.get('Vary'), null)
  assert.equal(await stored.text(), 'image')
  assert.equal(response.headers.get('Cache-Control'), 'max-age=60')
  assert.equal(await response.text(), 'image')
  delete globalThis.caches
})
