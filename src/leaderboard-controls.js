const leaderboardRange = document.querySelector('[data-leaderboard-range]')
const leaderboardRoot = document.querySelector('[data-leaderboard-root]')
if (leaderboardRoot instanceof HTMLElement) {
  if (leaderboardRange instanceof HTMLSelectElement) {
    leaderboardRange.disabled = false
  }
  const pageSize = Number.parseInt(leaderboardRoot.dataset.pageSize ?? '10', 10) || 10
  const panels = [...document.querySelectorAll('[data-leaderboard-panel]')].filter(panel => panel instanceof HTMLElement)
  let activeRange = leaderboardRoot.dataset.initialRange ?? '1d'
  let page = 1
  const render = () => {
    panels.forEach((panel) => {
      const active = panel.getAttribute('data-leaderboard-panel') === activeRange
      panel.hidden = !active
      if (!active) {
        return
      }
      const rows = [...panel.querySelectorAll('[data-leaderboard-row]')]
      const pages = Math.max(1, Math.ceil(rows.length / pageSize))
      page = Math.min(Math.max(page, 1), pages)
      rows.forEach((row, index) => {
        row.hidden = index < (page - 1) * pageSize || index >= page * pageSize
      })
      const label = panel.querySelector('[data-leaderboard-page]')
      if (label instanceof HTMLElement) {
        label.textContent = `${page} / ${pages} · ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, rows.length)} / ${rows.length}`
      }
      const previous = panel.querySelector('[data-leaderboard-prev]')
      const next = panel.querySelector('[data-leaderboard-next]')
      const pagination = panel.querySelector('[data-leaderboard-pagination]')
      if (pagination instanceof HTMLElement) {
        pagination.hidden = false
      }
      if (previous instanceof HTMLButtonElement) {
        previous.disabled = page <= 1
      }
      if (next instanceof HTMLButtonElement) {
        next.disabled = page >= pages
      }
    })
  }
  const updateUrl = () => {
    render()
    const url = new URL(window.location.href)
    url.searchParams.set('range', activeRange)
    url.searchParams.set('page', String(page))
    window.history.replaceState(null, '', url)
  }
  const readUrl = () => {
    const url = new URL(window.location.href)
    const requestedRange = url.searchParams.get('range')
    activeRange = panels.some(panel => panel.dataset.leaderboardPanel === requestedRange) ? requestedRange : leaderboardRoot.dataset.initialRange
    const requestedPage = url.searchParams.get('page') ?? '1'
    page = /^\d{1,9}$/.test(requestedPage) ? Number(requestedPage) : 1
    if (leaderboardRange instanceof HTMLSelectElement) {
      leaderboardRange.value = activeRange
    }
    render()
  }
  leaderboardRange?.addEventListener('change', () => {
    if (leaderboardRange instanceof HTMLSelectElement) {
      activeRange = leaderboardRange.value
      page = 1
      updateUrl()
    }
  })
  panels.forEach((panel) => {
    panel.querySelector('[data-leaderboard-prev]')?.addEventListener('click', () => {
      page -= 1
      updateUrl()
    })
    panel.querySelector('[data-leaderboard-next]')?.addEventListener('click', () => {
      page += 1
      updateUrl()
    })
  })
  window.addEventListener('popstate', readUrl)
  readUrl()
}
