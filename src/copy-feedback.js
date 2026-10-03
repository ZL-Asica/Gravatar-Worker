// Keep copy feedback local to the generator; never create a network request.
export const createCopyFeedback = (form) => {
  const tooltip = form.querySelector('[data-copy-tooltip]')
  const toasts = form.querySelector('[data-copy-toasts]')
  const template = form.querySelector('[data-copy-toast-template]')
  const duration = 3000
  const exitDuration = 200
  const maxToasts = 3
  const notifications = new Map()
  let highlighted
  let highlightTimer
  const hideTooltip = () => {
    if (tooltip instanceof HTMLElement) {
      tooltip.hidden = true
    }
  }
  const positionTooltip = (x, y) => {
    if (!(tooltip instanceof HTMLElement)) {
      return
    }
    tooltip.hidden = false
    const { width, height } = tooltip.getBoundingClientRect()
    tooltip.style.left = `${Math.max(12, Math.min(x + 14, window.innerWidth - width - 12))}px`
    tooltip.style.top = `${Math.max(12, y + height + 24 > window.innerHeight ? y - height - 12 : y + 18)}px`
  }
  form.querySelectorAll('[data-copy-value]').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'mouse') {
        positionTooltip(event.clientX, event.clientY)
      }
    })
    button.addEventListener('pointerleave', hideTooltip)
    button.addEventListener('focus', () => {
      if (button.matches(':focus-visible')) {
        const rect = button.getBoundingClientRect()
        positionTooltip(rect.left, rect.bottom)
      }
    })
    button.addEventListener('blur', hideTooltip)
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideTooltip()
    }
  })
  window.addEventListener('scroll', hideTooltip, { passive: true })
  const clearHighlight = () => {
    window.clearTimeout(highlightTimer)
    highlighted?.classList.remove('is-copied')
    highlighted = undefined
  }
  const positionToasts = () => {
    if (!(toasts instanceof HTMLElement)) {
      return
    }
    const active = [...toasts.children].filter(node => !node.classList.contains('is-leaving'))
    active.forEach((node, index) => {
      node.style.setProperty('--toast-index', String(index))
      node.classList.toggle('is-front', index === 0)
      node.setAttribute('aria-hidden', String(index !== 0))
    })
  }
  const removeToast = (toast) => {
    window.clearTimeout(notifications.get(toast))
    notifications.delete(toast)
    toast.remove()
    positionToasts()
  }
  const dismissToast = (toast) => {
    toast.classList.add('is-leaving')
    toast.setAttribute('aria-hidden', 'true')
    positionToasts()
    notifications.set(toast, window.setTimeout(removeToast, exitDuration, toast))
  }
  const showToast = (label, message) => {
    if (!(toasts instanceof HTMLElement) || !(template instanceof HTMLTemplateElement)) {
      return
    }
    const toast = template.content.firstElementChild.cloneNode(true)
    toast.querySelector('[data-toast-label]').textContent = label
    toast.querySelector('[data-toast-message]').textContent = message
    toasts.prepend(toast)
    notifications.set(toast, window.setTimeout(dismissToast, duration, toast))
    // Keep bursts bounded: newest notifications get their own entrance and lifetime.
    while (toasts.children.length > maxToasts) {
      removeToast(toasts.lastElementChild)
    }
    positionToasts()
  }
  const reset = () => {
    hideTooltip()
    clearHighlight()
    notifications.forEach(timer => window.clearTimeout(timer))
    notifications.clear()
    if (toasts instanceof HTMLElement) {
      toasts.replaceChildren()
    }
  }
  return {
    reset,
    success(button, message) {
      hideTooltip()
      clearHighlight()
      highlighted = button
      button.classList.add('is-copied')
      highlightTimer = window.setTimeout(clearHighlight, duration)
      showToast(button.dataset.copyLabel ?? '', message)
    },
  }
}
