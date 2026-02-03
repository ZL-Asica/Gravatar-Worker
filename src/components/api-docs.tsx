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
}

const ApiDocs = ({ config }: ApiDocsProps) => {
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
            Fetch avatar via raw email (securely hashed on the server).
            {' '}
            {!config.api.allowRawEmail && 'Raw email lookups are disabled by default on this deployment.'}
          </p>
          <ul>
            <li>
              <strong>&lt;email&gt;</strong>
              : The plain email address to resolve a Gravatar (if the email is invalid, we will use `email@example.com` as fallback).
            </li>
          </ul>
        </article>
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
          header. JPEG is used as a fallback if neither is supported.
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
            Request with email and size 256:
            <pre aria-label="Example request with email">
              <code>
                GET /avatar?email=email@example.com&amp;size=256
              </code>
            </pre>
          </li>
          <li>
            Request with email and size 500 and fallback initial 'A':
            <pre aria-label="Example request with email">
              <code>
                GET /avatar?email=email@example.com&amp;size=500&d=initials&initials=A
              </code>
            </pre>
          </li>
        </ul>
      </Section>

      <Footer config={config} />
    </main>
  )
}

export default ApiDocs
