import type { Locale } from '../i18n'
import type { LeaderboardSnapshot } from '../utils/leaderboard'
import { getMessages } from '../i18n'
import { getLeaderboardPage, LEADERBOARD_PAGE_SIZE } from '../utils/leaderboard'
import Footer from './footer'
import { SiteHeader } from './site-header'

interface LeaderboardProps {
  config: SiteConfig
  currentYear: number
  locale: Locale
  snapshot: LeaderboardSnapshot
  pageQuery?: string
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
}

const Leaderboard = ({ config, currentYear, locale, snapshot, pageQuery }: LeaderboardProps) => {
  const messages = getMessages(locale)
  const { entries, periodStart, periodEnd, demo } = snapshot
  const { page, pages, offset } = getLeaderboardPage(entries.length, pageQuery)
  const formatDate = (value: string) => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(new Date(value))
  const pageUrl = (value: number) => `/leaderboard?lang=${locale}&page=${value}`
  return (
    <div class="site-shell leaderboard-page">
      <SiteHeader config={config} locale={locale} path="/leaderboard" />
      <main>
        <section class="leaderboard-hero">
          <h1>{messages.leaderboard}</h1>
        </section>
        <div class="leaderboard-meta">
          {demo && <span class="demo-badge">{messages.demoData}</span>}
          <p class="leaderboard-summary">
            <strong>{messages.reportingPeriod}</strong>
            {' '}
            {periodStart !== undefined && periodEnd !== undefined ? `${formatDate(periodStart)} – ${formatDate(periodEnd)} (UTC)` : messages.periodUnknown}
          </p>
        </div>
        {entries.length === 0
          ? (
              <div class="empty-state">
                <p>{messages.noData}</p>
              </div>
            )
          : (
              <div class="table-wrap" tabIndex={0} role="region" aria-label={messages.leaderboard}>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">{messages.domain}</th>
                      <th scope="col" aria-sort="descending" title={`${messages.requestDefinition} · ${messages.sortedRequests}`}>
                        {messages.avatarRequests}
                        {' '}
                        <span aria-hidden="true">↓</span>
                      </th>
                      <th scope="col" title={messages.dataServedDefinition}>{messages.bytes}</th>
                      <th scope="col">{messages.cacheHitRate}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.slice(offset, offset + LEADERBOARD_PAGE_SIZE).map((entry, index) => (
                      <tr key={`${entry.domain}-${offset + index}`}>
                        <th scope="row">
                          <span class="domain-rank">{offset + index + 1}</span>
                          {entry.domain}
                        </th>
                        <td>{entry.requests.toLocaleString(locale)}</td>
                        <td>{formatBytes(entry.bytes)}</td>
                        <td>
                          {(entry.cacheHitRate * 100).toFixed(1)}
                          %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        {entries.length > 0 && (
          <nav class="pagination" aria-label={messages.pagination}>
            {page > 1 ? <a href={pageUrl(page - 1)}>{messages.previousPage}</a> : <span aria-disabled="true">{messages.previousPage}</span>}
            <span>{`${messages.pageLabel} ${page} / ${pages} · ${offset + 1}–${Math.min(offset + LEADERBOARD_PAGE_SIZE, entries.length)} / ${entries.length}`}</span>
            {page < pages ? <a href={pageUrl(page + 1)}>{messages.nextPage}</a> : <span aria-disabled="true">{messages.nextPage}</span>}
          </nav>
        )}
      </main>
      <Footer config={config} currentYear={currentYear} locale={locale} />
    </div>
  )
}

export default Leaderboard
