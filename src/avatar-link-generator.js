const form = document.querySelector('[data-avatar-link-form]')

if (form instanceof HTMLFormElement) {
  const submitButton = form.querySelector('[type=submit]')
  const placeholder = form.querySelector('[data-avatar-placeholder]')
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
  const messages = status instanceof HTMLElement ? status.dataset : {}
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
      setStatus(messages.avatarMessageCrypto ?? 'Web Crypto is unavailable in this browser context.')
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
    if (placeholder instanceof HTMLElement) {
      placeholder.hidden = isVisible
    }
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

    const size = readSize(sizeInput)
    const fallback = getFallbackValue()
    const url = new URL('/avatar/pending', window.location.origin)
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

    const hash = await sha256(email)
    if (hash === null) {
      return null
    }
    url.pathname = `/avatar/${hash}`
    return {
      size,
      url: url.toString(),
    }
  }

  const clearOutputs = () => {
    setResultVisibility(false)
    if (preview instanceof HTMLImageElement) {
      preview.removeAttribute('src')
      preview.alt = messages.avatarMessagePreview ?? 'Avatar preview'
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

    if (emailInput instanceof HTMLInputElement) {
      emailInput.value = normalizeEmail(emailInput.value)
      if (!emailInput.checkValidity()) {
        clearOutputs()
        emailInput.setAttribute('aria-invalid', 'true')
        setStatus(messages.avatarMessageInvalid)
        emailInput.focus()
        return
      }
      emailInput.removeAttribute('aria-invalid')
    }
    setStatus(messages.avatarMessageWorking ?? 'Generating link…')
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true
    }
    let result
    try {
      result = await buildAvatarUrl()
    }
    catch {
      setStatus(messages.avatarMessageCrypto)
    }
    finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false
      }
    }
    if (sequence !== updateSequence) {
      return
    }
    if (result === null || result === undefined) {
      clearOutputs()
      setStatus(messages.avatarMessageCrypto ?? 'Web Crypto is unavailable. Open this page over HTTPS.')
      return
    }

    setResultVisibility(true)
    if (preview instanceof HTMLImageElement) {
      preview.src = result.url
      preview.alt = messages.avatarMessagePreview ?? 'Avatar preview'
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
    setStatus(messages.avatarMessageReady ?? 'Generated locally. The email was not sent to this Worker.')
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
      setStatus(messages.avatarMessageEmpty ?? 'Generate a link before copying.')
      return
    }

    try {
      await navigator.clipboard.writeText(value)
      setStatus(messages.avatarMessageCopied ?? 'Copied to clipboard.')
    }
    catch {
      setStatus(messages.avatarMessageClipboard ?? 'Clipboard access is unavailable. Select the field and copy manually.')
    }
  }

  if (preview instanceof HTMLImageElement) {
    preview.addEventListener('error', () => {
      if (!preview.hasAttribute('src')) {
        return
      }
      preview.hidden = true
      setStatus(messages.avatarMessagePreviewError ?? 'Preview unavailable. The link is still ready to copy.')
    })
  }

  form.addEventListener('input', () => {
    updateSequence += 1
    syncInitialsField()
    clearOutputs()
    if (emailInput instanceof HTMLInputElement) {
      emailInput.removeAttribute('aria-invalid')
    }
    setStatus('')
  })
  form.addEventListener('change', syncInitialsField)
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

document.querySelectorAll('[data-language-select]').forEach((select) => {
  if (select instanceof HTMLSelectElement) {
    select.addEventListener('change', () => {
      if (select.value.length > 0) {
        window.location.assign(select.value)
      }
    })
  }
})
