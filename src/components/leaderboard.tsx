import type { Locale } from '../i18n'
import { getMessages } from '../i18n'
import Footer from './footer'
import { SiteHeader } from './site-header'

export interface LeaderboardEntry {
  domain: string
  requests: number
  bytes: number
  cacheHitRate: number
}

interface LeaderboardProps {
  config: SiteConfig
  currentYear: number
  locale: Locale
  entries: LeaderboardEntry[]
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

const Leaderboard = ({ config, currentYear, locale, entries }: LeaderboardProps) => {
  const messages = getMessages(locale)
  return (
    <div class="site-shell leaderboard-page">
      <SiteHeader config={config} locale={locale} path="/leaderboard" />
      <main>
        <section class="leaderboard-hero">
          <h1>{messages.leaderboard}</h1>
          <p class="subtitle">{messages.leaderboardIntro}</p>
        </section>
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
                      <th scope="col">{messages.requests}</th>
                      <th scope="col">{messages.bytes}</th>
                      <th scope="col">{messages.cacheHitRate}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map(entry => (
                      <tr key={entry.domain}>
                        <th scope="row">{entry.domain}</th>
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
      </main>
      <Footer config={config} currentYear={currentYear} locale={locale} />
    </div>
  )
}

export default Leaderboard
