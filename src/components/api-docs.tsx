import type { PropsWithChildren } from 'hono/jsx'
import Footer from './footer'

const Section = ({ title, children }: PropsWithChildren<{ title: string }>) => {
  const sectionId = title.toLowerCase().replace(/\W+/g, '-')
  return (
    <section aria-labelledby={sectionId}>
      <h2 id={sectionId}>{title}</h2>
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

interface ApiDocsProps {
  config: SiteConfig
  currentYear: number
}

const ApiDocs = ({ config, currentYear }: ApiDocsProps) => {
  const formatTtl = (seconds: number) => {
    if (seconds % 86400 === 0) {
      const days = seconds / 86400
      return `${days} day${days === 1 ? '' : 's'}`
    }
    if (seconds % 3600 === 0) {
      const hours = seconds / 3600
      return `${hours} hour${hours === 1 ? '' : 's'}`
    }
    if (seconds % 60 === 0) {
      const minutes = seconds / 60
      return `${minutes} minute${minutes === 1 ? '' : 's'}`
    }
    return `${seconds} seconds`
  }

  const sizeOptions = Array.from(
    new Set([
      ...COMMON_AVATAR_SIZES.filter(size => size <= config.api.maxSize),
      config.api.defaultSize,
    ]),
  ).sort((a, b) => a - b)

  return (
    <main className="api-docs" aria-label={`${config.branding.siteName} API Documentation`}>
      <header>
        <p className="eyebrow">API Reference</p>
        <h1>
          {config.branding.siteName}
        </h1>
        <p className="subtitle">
          {config.branding.siteTagline ?? 'Serve avatars from Gravatar with modern WebP/AVIF support, intelligent caching, and graceful fallback handling.'}
        </p>
      </header>

      <Section title="Endpoints">
        <article
          className="endpoint"
          aria-label="CDN maintainer's avatar endpoint"
        >
          <code>GET /avatar/me</code>
          <p>Returns the configured maintainer avatar.</p>
        </article>

        <article
          className="endpoint"
          aria-label="Hash-based avatar endpoint"
        >
          <code>GET /avatar/:hash</code>
          <p>Returns an avatar for a precomputed MD5 or SHA-256 email hash.</p>
          <ul>
            <li>
              <strong>hash</strong>
              : The MD5 or SHA-256-hashed value of the email (lowercased and trimmed).
            </li>
          </ul>
        </article>

        <article
          className="endpoint"
          aria-label="Email-based avatar endpoint"
        >
          <code>GET /avatar?email=&lt;email&gt;</code>
          <p>
            Resolves a raw email address after server-side normalization. Enable this endpoint only when you accept that email addresses can appear in URLs, logs, browser history, and intermediary proxies.
            {!config.api.allowRawEmail && ' Raw email lookups are disabled on this deployment.'}
          </p>
          <ul>
            <li>
              <strong>&lt;email&gt;</strong>
              : The plain email address to resolve. It is trimmed and lowercased before hashing; invalid or missing values fall back to
              {' '}
              <code>email@example.com</code>
              .
            </li>
          </ul>
        </article>
      </Section>

      <Section title="Generate Avatar Links">
        <form className="link-generator" data-avatar-link-form>
          <div className="link-generator-fields">
            <label>
              Email
              <input data-avatar-email type="email" inputMode="email" autoComplete="email" placeholder="email@example.com" required />
            </label>
            <label>
              Size
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
              Fallback
              <select data-avatar-default>
                {FALLBACK_OPTIONS.map(option => (
                  <option key={option.value} value={option.value} selected={option.value === '404'}>{option.label}</option>
                ))}
              </select>
            </label>
            <label data-avatar-initials-field hidden>
              Initials
              <input data-avatar-initials type="text" inputMode="text" maxLength={4} placeholder="ZA" />
            </label>
          </div>

          <div className="link-generator-result" data-avatar-result aria-live="polite" hidden>
            <img className="avatar-preview" data-avatar-preview alt="Avatar preview" width={config.api.defaultSize} height={config.api.defaultSize} hidden />
            <div className="generated-links">
              <label>
                Direct URL
                <span className="copy-row">
                  <input id="generated-avatar-url" data-avatar-url readOnly />
                  <button type="button" data-copy-target="#generated-avatar-url">Copy</button>
                </span>
              </label>
              <label>
                Markdown
                <span className="copy-row">
                  <textarea id="generated-avatar-markdown" data-avatar-markdown readOnly rows={2} />
                  <button type="button" data-copy-target="#generated-avatar-markdown">Copy</button>
                </span>
              </label>
              <label>
                HTML
                <span className="copy-row">
                  <textarea id="generated-avatar-html" data-avatar-html readOnly rows={2} />
                  <button type="button" data-copy-target="#generated-avatar-html">Copy</button>
                </span>
              </label>
            </div>
          </div>
          <p className="generator-status" data-avatar-status>Enter an email address to generate a hash-based avatar link.</p>
        </form>
      </Section>

      <Section title="Query Parameters">
        <ul>
          <li>
            <code>s=</code>
            {' '}
            or
            <code>size=</code>
            {' '}
            <b>
              (default:
              {' '}
              {config.api.defaultSize}
              )
            </b>
            <br />
            Avatar size in pixels (applies to both width and height).
          </li>
          <li>
            <code>d=</code>
            {' '}
            or
            <code>default=</code>
            {' '}
            <b>(default: 404)</b>
            <br />
            Fallback shown when the requested email has no Gravatar image. Use a URL or any fallback option supported by Gravatar.
          </li>
          <li>
            <code>initials=</code>
            {' '}
            <b>(requires default=initials)</b>
            <br />
            Fallback image using the initials you provide. Only applies when the default option is set to initials.
          </li>
          <li>
            <code>name=</code>
            {' '}
            <b>(requires default=initials)</b>
            <br />
            Fallback image using initials extracted from the provided name. Only applies when the default option is set to initials.
          </li>
        </ul>
      </Section>

      <Section title="Format Negotiation">
        <p>
          Avatars are automatically converted to
          {' '}
          <b>AVIF</b>
          {' '}
          or
          {' '}
          <b>WebP</b>
          {' '}
          based on the browser’s
          <code> Accept </code>
          {' '}
          header, including quality values such as
          {' '}
          <code>q=0.9</code>
          . The original image format is used as a fallback if neither is supported or the requested image is too large to safely transform at the edge.
        </p>
        <pre aria-label="Accept header example">
          <code>
            Accept: image/avif,image/webp, image/*, */*
          </code>
        </pre>
      </Section>

      <Section title="Caching">
        <ul>
          <li>
            <b>200 OK</b>
            : Cached at the edge for
            {' '}
            {formatTtl(config.cache.edgeTtlOk)}
            , browser cache for
            {' '}
            {formatTtl(config.cache.browserTtlOk)}
            , with
            {' '}
            {formatTtl(config.cache.staleRevalidateOk)}
            {' '}
            stale-while-revalidate for seamless background updates.
          </li>
          <li>
            <b>404 fallback</b>
            : Cached at the edge for
            {' '}
            {formatTtl(config.cache.edgeTtl404)}
            , browser cache for
            {' '}
            {formatTtl(config.cache.browserTtl404)}
            , with
            {' '}
            {formatTtl(config.cache.staleRevalidate404)}
            {' '}
            stale-while-revalidate to support retry on new accounts.
          </li>
          <li>
            <code>Vary: Accept</code>
            : Ensures proper caching per image format (AVIF/WebP/JPEG).
          </li>
          <li>
            <code>ETag</code>
            : Uses avatar hash for efficient cache validation and conditional requests.
          </li>
        </ul>
      </Section>

      <Section title="Example Requests">
        <ul>
          <li>
            Request with MD5 hash and size 128:
            <pre aria-label="Example request with hash">
              <code>
                GET /avatar/205e460b479e2e5b48aec07710c08d50?s=128
              </code>
            </pre>
          </li>
          <li>
            {config.api.allowRawEmail ? 'Request with email and size 256:' : 'Raw email request with size 256 (requires ALLOW_RAW_EMAIL=true):'}
            <pre aria-label="Example request with email">
              <code>
                GET /avatar?email=email@example.com&amp;size=256
              </code>
            </pre>
          </li>
          <li>
            {config.api.allowRawEmail ? 'Request with email and size 500 and fallback initial \'A\':' : 'Raw email request with size 500 and fallback initial \'A\' (requires ALLOW_RAW_EMAIL=true):'}
            <pre aria-label="Example request with email">
              <code>
                GET /avatar?email=email@example.com&amp;size=500&d=initials&initials=A
              </code>
            </pre>
          </li>
        </ul>
      </Section>

      <Footer config={config} currentYear={currentYear} />
    </main>
  )
}

export default ApiDocs
