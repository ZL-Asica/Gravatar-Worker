// Keep copy feedback local to the generator; never create a network request.
export const createCopyFeedback = (form) => {
  const tooltip = form.querySelector('[data-copy-tooltip]')
  const toast = form.querySelector('[data-copy-toast]')
  let toastTimer
  const highlightTimers = new Map()
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
  const reset = () => {
    hideTooltip()
    window.clearTimeout(toastTimer)
    if (toast instanceof HTMLElement) {
      toast.textContent = ''
    }
    highlightTimers.forEach((timer, button) => {
      window.clearTimeout(timer)
      button.classList.remove('is-copied')
    })
    highlightTimers.clear()
  }
  return {
    reset,
    success(button, message) {
      hideTooltip()
      window.clearTimeout(toastTimer)
      if (toast instanceof HTMLElement) {
        toast.textContent = message
        toastTimer = window.setTimeout(() => {
          toast.textContent = ''
        }, 3000)
      }
      window.clearTimeout(highlightTimers.get(button))
      button.classList.add('is-copied')
      highlightTimers.set(button, window.setTimeout(() => {
        button.classList.remove('is-copied')
        highlightTimers.delete(button)
      }, 3000))
    },
  }
}
