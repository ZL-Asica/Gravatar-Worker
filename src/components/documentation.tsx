import type { Locale } from '../i18n'
import { getMessages } from '../i18n'
import { docsMessages } from '../i18n-docs'

export const Documentation = ({ config, locale, endpointsOnly = false }: { config: SiteConfig, locale: Locale, endpointsOnly?: boolean }) => {
  const messages = getMessages(locale)
  const text = docsMessages[locale]
  if (endpointsOnly) {
    return (
      <section aria-labelledby="endpoints">
        <h2 id="endpoints">{messages.endpoints}</h2>
        <article className="endpoint">
          <code>GET /avatar/me</code>
          <p>{text.me}</p>
        </article>
        <article className="endpoint">
          <code>GET /avatar/:hash</code>
          <p>{text.hash}</p>
        </article>
        <article className="endpoint">
          <code>GET /avatar?email=&lt;email&gt;</code>
          <p>{text.email}</p>
          {!config.api.allowRawEmail && <p>{text.disabled}</p>}
        </article>
      </section>
    )
  }
  return (
    <>
      <section aria-labelledby="parameters">
        <h2 id="parameters">{messages.queryParameters}</h2>
        <ul>
          <li>
            <code>s= / size=</code>
            <p>
              {text.size}
              {' '}
              {text.defaultValue}
              :
              {' '}
              {config.api.defaultSize}
            </p>
          </li>
          <li>
            <code>d= / default=</code>
            <p>
              {text.fallback}
              {' '}
              {text.defaultValue}
              : 404
            </p>
          </li>
          <li>
            <code>initials=</code>
            <p>{text.initials}</p>
          </li>
          <li>
            <code>name=</code>
            <p>{text.name}</p>
          </li>
        </ul>
      </section>
      <section aria-labelledby="formats">
        <h2 id="formats">{messages.formatNegotiation}</h2>
        <p>{text.format}</p>
        <pre><code>Accept: image/avif,image/webp,image/*,*/*</code></pre>
      </section>
      <section aria-labelledby="caching">
        <h2 id="caching">{messages.caching}</h2>
        <ul>
          <li>
            200 OK —
            {text.edge}
            :
            {config.cache.edgeTtlOk}
            {' '}
            {text.seconds}
            ;
            {' '}
            {text.browser}
            :
            {' '}
            {config.cache.browserTtlOk}
            {' '}
            {text.seconds}
            .
          </li>
          <li>
            404 —
            {text.edge}
            :
            {config.cache.edgeTtl404}
            {' '}
            {text.seconds}
            ;
            {' '}
            {text.browser}
            :
            {' '}
            {config.cache.browserTtl404}
            {' '}
            {text.seconds}
            .
          </li>
          <li>
            <code>Vary: Accept</code>
            {' '}
            —
            {' '}
            {text.vary}
          </li>
        </ul>
      </section>
      <section aria-labelledby="examples">
        <h2 id="examples">{text.examples}</h2>
        <pre><code>GET /avatar/205e460b479e2e5b48aec07710c08d50?s=128</code></pre>
        <pre><code>GET /avatar?email=email@example.com&amp;size=256</code></pre>
        <pre><code>GET /avatar?email=email@example.com&amp;size=500&amp;d=initials&amp;initials=A</code></pre>
        {!config.api.allowRawEmail && <p>{text.disabled}</p>}
      </section>
    </>
  )
}
