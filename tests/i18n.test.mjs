import assert from 'node:assert/strict'
import { it } from 'node:test'
import { getMessages, LOCALES, resolveLocale } from '../src/i18n.ts'

it('resolves explicit choice and browser quality values', () => {
  assert.equal(resolveLocale('zh-TW', 'ja'), 'zh-TW')
  assert.equal(resolveLocale(undefined, 'en;q=0.2,ja;q=0.9'), 'ja')
  assert.equal(resolveLocale(undefined, 'ja;q=0,zh-Hant-HK;q=0.8'), 'zh-TW')
  assert.equal(resolveLocale(undefined, 'fr,zh-SG;q=0.8'), 'zh-CN')
  assert.equal(resolveLocale(undefined, 'ja;q=invalid,en;q=0'), 'en')
})

it('has every message in all four locales, including traditional copy', () => {
  const keys = Object.keys(getMessages('en')).sort()
  for (const locale of LOCALES) {
    assert.deepEqual(Object.keys(getMessages(locale)).sort(), keys)
    assert.ok(Object.values(getMessages(locale)).every(value => typeof value === 'string' && value.length > 0))
  }
  assert.equal(getMessages('zh-TW').copy, '複製')
})
