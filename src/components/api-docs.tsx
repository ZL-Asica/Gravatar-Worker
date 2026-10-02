import type { PropsWithChildren } from 'hono/jsx'
import type { Locale, Messages } from '../i18n'
import { getMessages, localeLabel, LOCALES } from '../i18n'
import Footer from './footer'

const Section = ({ title, children, id }: PropsWithChildren<{ title: string, id?: string }>) => {
  const sectionId = id ?? title.toLowerCase().replace(/\W+/g, '-')
  return (
    <section class="content-section" aria-labelledby={sectionId}>
      <div class="section-heading"><h2 id={sectionId}>{title}</h2></div>
      {children}
    </section>
  )
}

const FALLBACK_OPTIONS = [
  { value: '404', label: '404 response' },
  { value: 'mp', label: 'Mystery person' },
  { value: 'identicon', label: 'Identicon' },
  { value: 'monsterid', label: 'Monster ID' },
  { value: 'retro', label: 'Retro' },
  { value: 'robohash', label: 'RoboHash' },
  { value: 'blank', label: 'Blank image' },
  { value: 'initials', label: 'Initials' },
]
const COMMON_AVATAR_SIZES = [64, 96, 128, 200, 256, 512]

interface ApiDocsProps { config: SiteConfig, currentYear: number, locale: Locale }

const formatTtl = (seconds: number) => seconds % 86400 === 0 ? `${seconds / 86400}d` : seconds % 3600 === 0 ? `${seconds / 3600}h` : seconds % 60 === 0 ? `${seconds / 60}m` : `${seconds}s`

const LanguageSwitcher = ({ locale, messages }: { locale: Locale, messages: Messages }) => (
  <nav class="language-switcher" aria-label="Language">
    {LOCALES.map((option) => {
      const active = option === locale
      return <a key={option} href={`/?lang=${option}`} aria-current={active ? 'page' : undefined} class={active ? 'active' : undefined}>{localeLabel(option)}</a>
    })}
    <span class="sr-only">{messages.languageName}</span>
  </nav>
)

const ApiDocs = ({ config, currentYear, locale }: ApiDocsProps) => {
  const messages = getMessages(locale)
  const sizeOptions = Array.from(new Set([...COMMON_AVATAR_SIZES.filter(size => size <= config.api.maxSize), config.api.defaultSize])).sort((a, b) => a - b)
  const localizedPath = (path: string) => `${path}?lang=${locale}`
  return (
    <main class="site-shell" aria-label={`${config.branding.siteName} ${messages.apiReference}`}>
      <header class="site-header">
        <a class="brand" href={localizedPath('/')}>
          <span class="brand-mark" aria-hidden="true">✦</span>
          <span>{config.branding.siteName}</span>
        </a>
        <nav class="main-nav" aria-label="Primary">
          <a href="#generator">{messages.navHome}</a>
          <a href="#api-docs">{messages.navDocs}</a>
          <a href={localizedPath('/leaderboard')}>{messages.navLeaderboard}</a>
        </nav>
        <LanguageSwitcher locale={locale} messages={messages} />
      </header>

      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow">{messages.eyebrow}</p>
          <h1 id="hero-title">{messages.title}</h1>
          <p class="subtitle">{messages.subtitle}</p>
          <div class="hero-pills" aria-label="Service features">
            <span>SHA-256 in browser</span>
            <span>Edge cached</span>
            <span>AVIF · WebP</span>
          </div>
        </div>
        <div class="hero-orbit" aria-hidden="true">
          <span>✦</span>
          <span>●</span>
          <span>◆</span>
        </div>
      </section>

      <Section title={messages.navHome} id="generator">
        <form class="link-generator generator-card" data-avatar-link-form>
          <div class="link-generator-fields">
            <label>
              {messages.email}
              <input data-avatar-email type="email" inputMode="email" autoComplete="email" placeholder={messages.emailPlaceholder} required />
            </label>
            <label>
              {messages.size}
              <select data-avatar-size>
                {sizeOptions.map(size => (
                  <option key={size} value={String(size)} selected={size === config.api.defaultSize}>
                    {size}
                    {' '}
                    px
                  </option>
                ))}
              </select>
            </label>
            <label>
              {messages.fallback}
              <select data-avatar-default>{FALLBACK_OPTIONS.map(option => <option key={option.value} value={option.value} selected={option.value === '404'}>{option.label}</option>)}</select>
            </label>
            <label data-avatar-initials-field hidden>
              {messages.initials}
              <input data-avatar-initials type="text" inputMode="text" maxLength={4} placeholder="ZA" />
            </label>
          </div>
          <button class="primary-action" type="submit">
            {messages.generate}
            <span aria-hidden="true">↗</span>
          </button>
          <div class="link-generator-result" data-avatar-result aria-live="polite" hidden>
            <img class="avatar-preview" data-avatar-preview alt="Avatar preview" width={config.api.defaultSize} height={config.api.defaultSize} hidden />
            <div class="generated-links">
              <label>
                {messages.directUrl}
                <span class="copy-row">
                  <input id="generated-avatar-url" data-avatar-url readOnly />
                  <button type="button" data-copy-target="#generated-avatar-url">{messages.copy}</button>
                </span>
              </label>
              <label>
                {messages.markdown}
                <span class="copy-row">
                  <textarea id="generated-avatar-markdown" data-avatar-markdown readOnly rows={2} />
                  <button type="button" data-copy-target="#generated-avatar-markdown">{messages.copy}</button>
                </span>
              </label>
              <label>
                {messages.html}
                <span class="copy-row">
                  <textarea id="generated-avatar-html" data-avatar-html readOnly rows={2} />
                  <button type="button" data-copy-target="#generated-avatar-html">{messages.copy}</button>
                </span>
              </label>
            </div>
          </div>
          <p class="generator-status" data-avatar-status data-avatar-message-empty={messages.generatorEmpty} data-avatar-message-invalid={messages.generatorInvalid} data-avatar-message-working={messages.generatorWorking} data-avatar-message-ready={messages.generatorReady} data-avatar-message-copied={messages.copied} data-avatar-message-clipboard={messages.clipboardUnavailable}>{messages.generatorEmpty}</p>
        </form>
      </Section>

      <div id="api-docs" class="docs-grid">
        <Section title={messages.endpoints}>
          <div class="endpoint-grid">
            <article class="endpoint">
              <code>GET /avatar/:hash</code>
              <p>Returns an avatar for a precomputed MD5 or SHA-256 email hash.</p>
            </article>
            <article class="endpoint">
              <code>GET /avatar/me</code>
              <p>Returns the configured maintainer avatar.</p>
            </article>
            <article class="endpoint">
              <code>GET /avatar?email=</code>
              <p>{config.api.allowRawEmail ? 'Resolves a normalized email address.' : 'Raw email lookups are disabled on this deployment.'}</p>
            </article>
          </div>
        </Section>
        <Section title={messages.queryParameters}>
          <ul class="compact-list">
            <li>
              <code>s=</code>
              {' '}
              /
              {' '}
              <code>size=</code>
              {' '}
              — avatar size in pixels (default
              {' '}
              {config.api.defaultSize}
              ).
            </li>
            <li>
              <code>d=</code>
              {' '}
              /
              {' '}
              <code>default=</code>
              {' '}
              — Gravatar fallback (default 404).
            </li>
            <li>
              <code>initials=</code>
              {' '}
              — initials when
              {' '}
              <code>default=initials</code>
              .
            </li>
          </ul>
        </Section>
        <Section title={messages.formatNegotiation}>
          <p>
            Responses negotiate AVIF and WebP from the
            <code>Accept</code>
            {' '}
            header, then fall back to the original image when conversion is not safe.
          </p>
          <pre><code>Accept: image/avif,image/webp,image/*</code></pre>
        </Section>
        <Section title={messages.caching}>
          <ul class="compact-list">
            <li>
              Successful avatars: edge
              {formatTtl(config.cache.edgeTtlOk)}
              , browser
              {formatTtl(config.cache.browserTtlOk)}
              .
            </li>
            <li>
              Missing avatars: edge
              {formatTtl(config.cache.edgeTtl404)}
              , browser
              {formatTtl(config.cache.browserTtl404)}
              .
            </li>
            <li>
              <code>Vary: Accept</code>
              {' '}
              keeps negotiated formats separate.
            </li>
          </ul>
        </Section>
      </div>

      <aside class="leaderboard-callout">
        <div>
          <p class="eyebrow">{messages.navLeaderboard}</p>
          <h2>{messages.leaderboard}</h2>
          <p>{messages.leaderboardIntro}</p>
        </div>
        <a class="secondary-action" href={localizedPath('/leaderboard')}>
          {messages.navLeaderboard}
          <span aria-hidden="true">↗</span>
        </a>
      </aside>
      <Footer config={config} currentYear={currentYear} />
    </main>
  )
}

export default ApiDocs
