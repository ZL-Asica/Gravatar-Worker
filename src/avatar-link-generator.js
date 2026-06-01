const form = document.querySelector('[data-avatar-link-form]')

if (form instanceof HTMLFormElement) {
  const emailInput = form.querySelector('[data-avatar-email]')
  const sizeInput = form.querySelector('[data-avatar-size]')
  const defaultInput = form.querySelector('[data-avatar-default]')
  const preview = document.querySelector('[data-avatar-preview]')
  const urlOutput = document.querySelector('[data-avatar-url]')
  const markdownOutput = document.querySelector('[data-avatar-markdown]')
  const htmlOutput = document.querySelector('[data-avatar-html]')
  const status = document.querySelector('[data-avatar-status]')

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
    const min = Number.parseInt(input.min, 10) || 16
    const max = Number.parseInt(input.max, 10) || 2048
    const value = Number.parseInt(input.value, 10) || fallback
    return Math.min(Math.max(value, min), max)
  }

  const buildAvatarUrl = async () => {
    if (!(emailInput instanceof HTMLInputElement) || !(sizeInput instanceof HTMLInputElement) || !(defaultInput instanceof HTMLInputElement)) {
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
    const fallback = defaultInput.value.trim()
    const url = new URL(`/avatar/${hash}`, window.location.origin)
    url.searchParams.set('s', String(size))
    if (fallback.length > 0 && fallback !== '404') {
      url.searchParams.set('d', fallback)
    }

    return {
      alt: email,
      size,
      url: url.toString(),
    }
  }

  const clearOutputs = () => {
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
    const result = await buildAvatarUrl()
    if (result === null) {
      clearOutputs()
      setStatus('Enter a valid email to generate a hash-based avatar link.')
      return
    }

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

  form.addEventListener('input', () => {
    void update()
  })
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
  void update()
}
