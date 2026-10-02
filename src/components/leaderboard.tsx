import type { Locale } from '../i18n'
import { getMessages } from '../i18n'
import Footer from './footer'

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
    <main class="site-shell leaderboard-page">
      <header class="site-header">
        <a class="brand" href={`/?lang=${locale}`}>
          <span class="brand-mark" aria-hidden="true">✦</span>
          <span>{config.branding.siteName}</span>
        </a>
        <nav class="main-nav" aria-label="Primary">
          <a href={`/?lang=${locale}`}>{messages.navHome}</a>
          <a href={`/leaderboard?lang=${locale}`} aria-current="page">{messages.navLeaderboard}</a>
        </nav>
      </header>
      <section class="leaderboard-hero">
        <p class="eyebrow">{messages.navLeaderboard}</p>
        <h1>{messages.leaderboard}</h1>
        <p class="subtitle">{messages.leaderboardIntro}</p>
      </section>
      {entries.length === 0
        ? (
            <div class="empty-state">
              <p>{messages.noData}</p>
              <code>{'LEADERBOARD_DATA=\'[{"domain":"example.com","requests":1200,"bytes":5242880,"cacheHitRate":0.94}]\''}</code>
            </div>
          )
        : (
            <div class="table-wrap">
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
      <Footer config={config} currentYear={currentYear} />
    </main>
  )
}

export default Leaderboard
