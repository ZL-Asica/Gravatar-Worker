import type { Locale } from '../i18n'
import type { LeaderboardPeriod, LeaderboardRange, LeaderboardSnapshot } from '../utils/leaderboard'
import { getMessages } from '../i18n'
import { LEADERBOARD_PAGE_SIZE } from '../utils/leaderboard'
import Footer from './footer'
import { SiteHeader } from './site-header'

interface LeaderboardProps {
  config: SiteConfig
  currentYear: number
  locale: Locale
  snapshot: LeaderboardSnapshot
}

const RANGES: LeaderboardRange[] = ['1d', '3d', '7d', '30d']
const formatBytes = (bytes: number) => bytes < 1024 ? `${bytes} B` : bytes < 1024 ** 2 ? `${(bytes / 1024).toFixed(1)} KB` : bytes < 1024 ** 3 ? `${(bytes / 1024 ** 2).toFixed(1)} MB` : `${(bytes / 1024 ** 3).toFixed(1)} GB`

const LeaderboardTable = ({ period, locale, messages, range, active }: { period: LeaderboardPeriod, locale: Locale, messages: ReturnType<typeof getMessages>, range: LeaderboardRange, active: boolean }) => {
  const formatDate = (value: string) => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(new Date(value))
  return (
    <section className="leaderboard-panel" data-leaderboard-panel={range} hidden={!active}>
      <p className="leaderboard-summary" data-leaderboard-period>
        <strong>{messages.reportingPeriod}</strong>
        {' '}
        {period.periodStart !== undefined && period.periodEnd !== undefined ? `${formatDate(period.periodStart)} – ${formatDate(period.periodEnd)} (UTC)` : messages.periodUnknown}
      </p>
      {period.entries.length === 0
        ? <div className="empty-state"><p>{messages.noData}</p></div>
        : (
            <div className="table-wrap" tabIndex={0} role="region" aria-label={messages.leaderboard}>
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
                  {period.entries.map((entry, index) => (
                    <tr key={`${range}-${entry.domain}`} data-leaderboard-row data-rank={index + 1}>
                      <th scope="row">
                        <span className="domain-rank">{index + 1}</span>
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
      {period.entries.length > 0 && (
        <nav className="pagination" data-leaderboard-pagination aria-label={messages.pagination} hidden>
          <button type="button" data-leaderboard-prev>{messages.previousPage}</button>
          <span data-leaderboard-page aria-live="polite" />
          <button type="button" data-leaderboard-next>{messages.nextPage}</button>
        </nav>
      )}
    </section>
  )
}

const Leaderboard = ({ config, currentYear, locale, snapshot }: LeaderboardProps) => {
  const messages = getMessages(locale)
  const available = snapshot.ranges ?? { '1d': { entries: snapshot.entries, periodStart: snapshot.periodStart, periodEnd: snapshot.periodEnd } }
  const firstRange = RANGES.find(range => available[range] !== undefined) ?? '1d'
  return (
    <div className="site-shell leaderboard-page">
      <SiteHeader config={config} locale={locale} path="/leaderboard" />
      <main id="main-content" tabIndex={-1}>
        <section className="leaderboard-hero"><h1>{messages.leaderboard}</h1></section>
        <div className="leaderboard-meta" data-leaderboard-root data-page-size={LEADERBOARD_PAGE_SIZE} data-initial-range={firstRange}>
          {snapshot.demo && <span className="demo-badge">{messages.demoData}</span>}
          {snapshot.ranges !== undefined && (
            <label className="range-picker">
              {messages.rangeLabel}
              <select data-leaderboard-range aria-label={messages.rangeLabel} disabled>
                {RANGES.map(range => <option key={range} value={range} disabled={available[range] === undefined} selected={range === firstRange}>{messages[range === '1d' ? 'range1d' : range === '3d' ? 'range3d' : range === '7d' ? 'range7d' : 'range30d']}</option>)}
              </select>
            </label>
          )}
        </div>
        <div className="leaderboard-panels">
          {RANGES.map(range => available[range] !== undefined && <LeaderboardTable key={range} period={available[range]} locale={locale} messages={messages} range={range} active={range === firstRange} />)}
        </div>
      </main>
      <Footer config={config} currentYear={currentYear} locale={locale} />
    </div>
  )
}

export default Leaderboard
