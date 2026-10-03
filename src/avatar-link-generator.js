/* eslint-disable style/max-statements-per-line */
import { createCopyFeedback } from './copy-feedback'

const form = document.querySelector('[data-avatar-link-form]')

if (form instanceof HTMLFormElement) {
  const feedback = createCopyFeedback(form)
  const placeholder = form.querySelector('[data-avatar-placeholder]')
  const emailInput = form.querySelector('[data-avatar-email]')
  const sizeInput = form.querySelector('[data-avatar-size]')
  const defaultInput = form.querySelector('[data-avatar-default]')
  const initialsField = form.querySelector('[data-avatar-initials-field]')
  const initialsInput = form.querySelector('[data-avatar-initials]')
  const resultPanel = form.querySelector('[data-avatar-result]')
  const preview = form.querySelector('[data-avatar-preview]')
  const outputs = { url: form.querySelector('[data-avatar-url-display]'), markdown: form.querySelector('[data-avatar-markdown-display]'), html: form.querySelector('[data-avatar-html-display]') }
  const status = form.querySelector('[data-avatar-status]')
  const messages = status instanceof HTMLElement ? status.dataset : {}
  let updateSequence = 0
  let debounceTimer
  const setStatus = (message) => { if (status instanceof HTMLElement) { status.textContent = message ?? '' } }
  const normalizeEmail = value => value.trim().toLowerCase()
  const toHex = buffer => Array.from(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, '0')).join('')
  const sha256 = async (value) => {
    if (window.crypto?.subtle === undefined) { setStatus(messages.avatarMessageCrypto ?? 'Web Crypto is unavailable in this browser context.'); return null }
    return toHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))
  }
  const readSize = input => Math.min(Math.max(Number.parseInt(input.value, 10) || 200, Number.parseInt(input.min ?? '', 10) || 16), Number.parseInt(input.max ?? '', 10) || 2048)
  const getFallbackValue = () => defaultInput instanceof HTMLSelectElement ? defaultInput.value.trim() : '404'
  const setResultVisibility = (visible) => { if (placeholder instanceof HTMLElement) { placeholder.hidden = visible } if (resultPanel instanceof HTMLElement) { resultPanel.hidden = !visible } }
  const syncInitialsField = () => { if (initialsField instanceof HTMLElement) { initialsField.hidden = getFallbackValue() !== 'initials' } }
  const clearOutputs = () => { feedback.reset(); setResultVisibility(false); if (preview instanceof HTMLImageElement) { preview.removeAttribute('src'); preview.hidden = true }; Object.values(outputs).forEach((output) => { if (output instanceof HTMLElement) { output.textContent = '' } }) }
  const buildAvatarUrl = async () => {
    if (!(emailInput instanceof HTMLInputElement) || !(sizeInput instanceof HTMLInputElement || sizeInput instanceof HTMLSelectElement)) { return null }
    const email = normalizeEmail(emailInput.value)
    if (email.length === 0 || !emailInput.checkValidity()) { return null }
    const hash = await sha256(email)
    if (hash === null) { return null }
    const size = readSize(sizeInput)
    const fallback = getFallbackValue()
    const url = new URL(`/avatar/${hash}`, window.location.origin)
    url.searchParams.set('s', String(size))
    if (fallback && fallback !== '404') { url.searchParams.set('d', fallback) }
    if (fallback === 'initials' && initialsInput instanceof HTMLInputElement && initialsInput.value.trim()) { url.searchParams.set('initials', initialsInput.value.trim()) }
    return { size, url: url.toString() }
  }
  const update = async () => {
    const sequence = ++updateSequence
    syncInitialsField()
    if (!(emailInput instanceof HTMLInputElement)) { return }
    const normalized = normalizeEmail(emailInput.value)
    if (!normalized) { clearOutputs(); emailInput.setAttribute('aria-invalid', 'true'); setStatus(messages.avatarMessageEmpty ?? 'Enter an email address.'); return }
    if (!emailInput.checkValidity()) { clearOutputs(); emailInput.setAttribute('aria-invalid', 'true'); setStatus(messages.avatarMessageInvalid); return }
    emailInput.removeAttribute('aria-invalid')
    setStatus(messages.avatarMessageWorking ?? 'Generating link…')
    let result
    try { result = await buildAvatarUrl() }
    catch { result = null }
    if (sequence !== updateSequence) { return }
    if (result === null) { clearOutputs(); setStatus(messages.avatarMessageCrypto ?? 'Web Crypto is unavailable.'); return }
    const markdown = `![Avatar](${result.url})`
    const html = `<img src="${result.url.replaceAll('&', '&amp;')}" alt="Avatar" width="${result.size}" height="${result.size}">`
    if (outputs.url instanceof HTMLElement) { outputs.url.textContent = result.url }
    if (outputs.markdown instanceof HTMLElement) { outputs.markdown.textContent = markdown }
    if (outputs.html instanceof HTMLElement) { outputs.html.textContent = html }
    setResultVisibility(true)
    if (preview instanceof HTMLImageElement) { preview.src = result.url; preview.hidden = false }
    setStatus(messages.avatarMessageReady ?? 'Generated locally. The email was not sent to this Worker.')
  }
  const scheduleUpdate = () => { window.clearTimeout(debounceTimer); debounceTimer = window.setTimeout(() => { void update() }, 240) }
  const copyValue = async (button) => {
    const key = button.getAttribute('data-copy-value')
    const output = key ? outputs[key] : null
    const value = output instanceof HTMLElement ? output.textContent ?? '' : ''
    if (!value) { setStatus(messages.avatarMessageEmpty ?? 'Enter an email address first.'); return }
    const sequence = updateSequence
    try {
      await navigator.clipboard.writeText(value)
      if (sequence === updateSequence) {
        feedback.success(button, messages.avatarMessageCopied ?? 'Copied to clipboard.')
      }
    }
    catch { if (sequence !== updateSequence) { return }; const selection = window.getSelection(); const range = document.createRange(); range.selectNodeContents(output); selection?.removeAllRanges(); selection?.addRange(range); setStatus(messages.avatarMessageClipboard ?? 'Select the field and copy manually.') }
  }
  if (preview instanceof HTMLImageElement) { preview.addEventListener('error', () => { preview.hidden = true; setStatus(messages.avatarMessagePreviewError ?? 'Preview unavailable. The link is still ready to copy.') }) }
  form.addEventListener('input', () => { updateSequence += 1; clearOutputs(); emailInput instanceof HTMLInputElement && emailInput.removeAttribute('aria-invalid'); setStatus(''); scheduleUpdate() })
  form.addEventListener('change', () => {
    updateSequence += 1
    clearOutputs()
    syncInitialsField()
    scheduleUpdate()
  })
  form.querySelectorAll('[data-copy-value]').forEach(button => button.addEventListener('click', () => { void copyValue(button) }))
  syncInitialsField()
  clearOutputs()
}

document.querySelectorAll('[data-language-select]').forEach((select) => {
  if (select instanceof HTMLSelectElement) { select.addEventListener('change', () => { if (select.value) { window.location.assign(select.value) } }) }
})
