const form = document.querySelector('[data-avatar-link-form]')

if (form instanceof HTMLFormElement) {
  const DEBOUNCE_MS = 300
  const emailInput = form.querySelector('[data-avatar-email]')
  const sizeInput = form.querySelector('[data-avatar-size]')
  const defaultInput = form.querySelector('[data-avatar-default]')
  const initialsField = form.querySelector('[data-avatar-initials-field]')
  const initialsInput = form.querySelector('[data-avatar-initials]')
  const resultPanel = document.querySelector('[data-avatar-result]')
  const preview = document.querySelector('[data-avatar-preview]')
  const urlOutput = document.querySelector('[data-avatar-url]')
  const markdownOutput = document.querySelector('[data-avatar-markdown]')
  const htmlOutput = document.querySelector('[data-avatar-html]')
  const status = document.querySelector('[data-avatar-status]')
  let updateTimer = null
  let updateSequence = 0

  const setStatus = (message) => {
    if (status !== null) {
      status.textContent = message
    }
  }

  const normalizeEmail = value => value.trim().toLowerCase()

  const toHex = (buffer) => {
    return Array.from(
      new Uint8Array(buffer),
      byte => byte.toString(16).padStart(2, '0'),
    ).join('')
  }

  const sha256 = async (value) => {
    if (window.crypto?.subtle === undefined) {
      setStatus('Web Crypto is unavailable in this browser context.')
      return null
    }

    const encoded = new TextEncoder().encode(value)
    return toHex(await crypto.subtle.digest('SHA-256', encoded))
  }

  const readSize = (input) => {
    const fallback = 200
    const min = Number.parseInt(input.min ?? '', 10) || 16
    const max = Number.parseInt(input.max ?? '', 10) || 2048
    const value = Number.parseInt(input.value, 10) || fallback
    return Math.min(Math.max(value, min), max)
  }

  const getFallbackValue = () => {
    return defaultInput instanceof HTMLInputElement || defaultInput instanceof HTMLSelectElement
      ? defaultInput.value.trim()
      : '404'
  }

  const setResultVisibility = (isVisible) => {
    if (resultPanel instanceof HTMLElement) {
      resultPanel.hidden = !isVisible
    }
  }

  const syncInitialsField = () => {
    const usesInitials = getFallbackValue() === 'initials'
    if (initialsField instanceof HTMLElement) {
      initialsField.hidden = !usesInitials
    }
  }

  const buildAvatarUrl = async () => {
    if (!(emailInput instanceof HTMLInputElement) || !(sizeInput instanceof HTMLInputElement || sizeInput instanceof HTMLSelectElement)) {
      return null
    }

    const email = normalizeEmail(emailInput.value)
    if (email.length === 0 || !emailInput.checkValidity()) {
      return null
    }

    const hash = await sha256(email)
    if (hash === null) {
      return null
    }

    const size = readSize(sizeInput)
    const fallback = getFallbackValue()
    const url = new URL(`/avatar/${hash}`, window.location.origin)
    url.searchParams.set('s', String(size))
    if (fallback.length > 0 && fallback !== '404') {
      url.searchParams.set('d', fallback)
    }
    if (fallback === 'initials' && initialsInput instanceof HTMLInputElement) {
      const initials = initialsInput.value.trim()
      if (initials.length > 0) {
        url.searchParams.set('initials', initials)
      }
    }

    return {
      alt: email,
      size,
      url: url.toString(),
    }
  }

  const clearOutputs = () => {
    setResultVisibility(false)
    if (preview instanceof HTMLImageElement) {
      preview.removeAttribute('src')
      preview.alt = 'Avatar preview'
      preview.hidden = true
    }
    if (urlOutput instanceof HTMLInputElement) {
      urlOutput.value = ''
    }
    if (markdownOutput instanceof HTMLTextAreaElement) {
      markdownOutput.value = ''
    }
    if (htmlOutput instanceof HTMLTextAreaElement) {
      htmlOutput.value = ''
    }
  }

  const update = async () => {
    const sequence = ++updateSequence
    syncInitialsField()

    if (emailInput instanceof HTMLInputElement && emailInput.value.trim().length === 0) {
      clearOutputs()
      setStatus('Enter an email address to generate a hash-based avatar link.')
      return
    }

    setStatus('Generating link...')
    const result = await buildAvatarUrl()
    if (sequence !== updateSequence) {
      return
    }
    if (result === null) {
      clearOutputs()
      setStatus('Enter a valid email address.')
      return
    }

    setResultVisibility(true)
    if (preview instanceof HTMLImageElement) {
      preview.src = result.url
      preview.alt = `Avatar preview for ${result.alt}`
      preview.hidden = false
    }
    if (urlOutput instanceof HTMLInputElement) {
      urlOutput.value = result.url
    }
    if (markdownOutput instanceof HTMLTextAreaElement) {
      markdownOutput.value = `![Avatar](${result.url})`
    }
    if (htmlOutput instanceof HTMLTextAreaElement) {
      htmlOutput.value = `<img src="${result.url}" alt="Avatar" width="${result.size}" height="${result.size}">`
    }
    setStatus('Generated locally. The email was not sent to this Worker.')
  }

  const scheduleUpdate = () => {
    if (updateTimer !== null) {
      window.clearTimeout(updateTimer)
    }
    syncInitialsField()
    updateTimer = window.setTimeout(() => {
      updateTimer = null
      void update()
    }, DEBOUNCE_MS)
  }

  const copyValue = async (button) => {
    const target = button.getAttribute('data-copy-target')
    if (target === null) {
      return
    }

    const field = document.querySelector(target)
    const value = field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement
      ? field.value
      : ''
    if (value.length === 0) {
      setStatus('Generate a link before copying.')
      return
    }

    try {
      await navigator.clipboard.writeText(value)
      setStatus('Copied to clipboard.')
    }
    catch {
      setStatus('Clipboard access is unavailable. Select the field and copy manually.')
    }
  }

  form.addEventListener('input', scheduleUpdate)
  form.addEventListener('change', scheduleUpdate)
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    void update()
  })
  document.querySelectorAll('[data-copy-target]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button instanceof HTMLButtonElement) {
        void copyValue(button)
      }
    })
  })
  syncInitialsField()
  clearOutputs()
}
