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

  return (
    <main className="api-docs" aria-label={`${config.branding.siteName} API Documentation`}>
      <header>
        <h1>
          {config.branding.siteName}
          {' '}
          API
        </h1>
        <p className="subtitle">
          {config.branding.siteTagline ?? 'Serve avatars from Gravatar with modern WebP/AVIF support, intelligent caching, and graceful fallback handling.'}
        </p>
      </header>

      <Section title="📌 Endpoints">
        <article
          className="endpoint"
          aria-label="CDN maintainer's avatar endpoint"
        >
          <code>GET /avatar/me</code>
          <p>Fetch the maintainer's avatar with no param needed.</p>
        </article>

        <article
          className="endpoint"
          aria-label="Hash-based avatar endpoint"
        >
          <code>GET /avatar/:hash</code>
          <p>Fetch avatar via precomputed MD5 or SHA-256 hash of an email address.</p>
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
            Fetch avatar via raw email (securely hashed on the server). Enable this endpoint only when you accept that email addresses can appear in URLs, logs, browser history, and intermediary proxies.
            {!config.api.allowRawEmail && ' Raw email lookups are disabled on this deployment.'}
          </p>
          <ul>
            <li>
              <strong>&lt;email&gt;</strong>
              : The plain email address to resolve a Gravatar. It is trimmed and lowercased before hashing; invalid or missing values fall back to `email@example.com`.
            </li>
          </ul>
        </article>
      </Section>

      <Section title="🔗 Generate Avatar Links">
        <form className="link-generator" data-avatar-link-form>
          <div className="link-generator-fields">
            <label>
              Email
              <input data-avatar-email type="email" inputMode="email" autoComplete="email" placeholder="email@example.com" required />
            </label>
            <label>
              Size
              <input data-avatar-size type="number" min="16" max={config.api.maxSize} defaultValue={config.api.defaultSize} />
            </label>
            <label>
              Fallback
              <input data-avatar-default type="text" defaultValue="404" placeholder="404, mp, identicon, initials..." />
            </label>
          </div>

          <div className="link-generator-result" aria-live="polite">
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
          <p className="generator-status" data-avatar-status>Enter a valid email to generate a hash-based avatar link.</p>
        </form>
      </Section>

      <Section title="⚙️ Query Parameters">
        <ul>
          <li>
            <code>s=</code>
            {' '}
            or
            <code>size=</code>
            {' '}
            <b>
              (default:
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
            Default fallback image when the requested email do not have a image associated with. You can put URL, or any other options that gravatar support.
          </li>
          <li>
            <code>initials=</code>
            {' '}
            <b>(Only works when you set default to initials)</b>
            <br />
            Default fallback image with the given initials when the requested email do not have a image associated with. You need to put the initials you would like to have as a fallback.
          </li>
          <li>
            <code>name=</code>
            {' '}
            <b>(Only works when you set default to initials)</b>
            <br />
            Default fallback image with the initials based on the given name when the requested email do not have a image associated with. You can put the full name you would like to have as a fallback. Initials will be auto extracted.
          </li>
        </ul>
      </Section>

      <Section title="🎨 Format Negotiation">
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

      <Section title="📦 Caching">
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

      <Section title="🧪 Example Requests">
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
