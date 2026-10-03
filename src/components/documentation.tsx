import type { Locale } from '../i18n'
import { getMessages } from '../i18n'
import { docsMessages } from '../i18n-docs'

const formatTtl = (seconds: number, locale: Locale, secondsLabel: string, minutesLabel: string) => {
  const value = seconds.toLocaleString(locale)
  const minutes = (seconds / 60).toLocaleString(locale, { maximumFractionDigits: 1 })
  return `${value} ${secondsLabel} (${minutes} ${minutesLabel})`
}

const RequestCode = ({ route, variable, query = [] }: { route: string, variable?: string, query?: [string, string][] }) => (
  <code className="syntax-code">
    <span className="http-method">GET</span>
    {' '}
    <span className="route">{route}</span>
    {variable !== undefined && <span className="route-variable">{variable}</span>}
    {query.map(([name, value], index) => (
      <span key={name}>
        <span className="syntax-punctuation">{index === 0 ? '?' : '&'}</span>
        <span className="parameter-name">{name}</span>
        <span className="syntax-punctuation">=</span>
        <span className="route-variable">{value}</span>
      </span>
    ))}
  </code>
)

const HeaderCode = ({ name, value }: { name: string, value: string }) => (
  <code className="syntax-code">
    <span className="header-name">
      {name}
      :
    </span>
    {' '}
    {value}
  </code>
)

export const Documentation = ({ config, locale, endpointsOnly = false }: { config: SiteConfig, locale: Locale, endpointsOnly?: boolean }) => {
  const messages = getMessages(locale)
  const text = docsMessages[locale]
  if (endpointsOnly) {
    return (
      <section className="doc-section doc-endpoints" aria-labelledby="endpoints">
        <h2 id="endpoints">{messages.endpoints}</h2>
        <article className="endpoint endpoint-primary">
          <RequestCode route="/avatar/me" />
          <p>{text.me}</p>
        </article>
        <article className="endpoint">
          <RequestCode route="/avatar/" variable=":hash" />
          <p>{text.hash}</p>
        </article>
        <article className="endpoint">
          <RequestCode route="/avatar" query={[['email', '<email>']]} />
          <p>{text.email}</p>
          {!config.api.allowRawEmail && <p>{text.disabled}</p>}
        </article>
      </section>
    )
  }
  return (
    <>
      <section className="doc-section doc-parameters" aria-labelledby="parameters">
        <h2 id="parameters">{messages.queryParameters}</h2>
        <ul>
          <li>
            <code className="parameter-code"><span className="parameter-name">s= / size=</span></code>
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
            <code className="parameter-code"><span className="parameter-name">d= / default=</span></code>
            <p>
              {text.fallback}
              {' '}
              {text.defaultValue}
              : 404
            </p>
          </li>
          <li>
            <code className="parameter-code"><span className="parameter-name">initials=</span></code>
            <p>{text.initials}</p>
          </li>
          <li>
            <code className="parameter-code"><span className="parameter-name">name=</span></code>
            <p>{text.name}</p>
          </li>
        </ul>
      </section>
      <section className="doc-section doc-formats" aria-labelledby="formats">
        <h2 id="formats">{messages.formatNegotiation}</h2>
        <p>{text.format}</p>
        <pre><HeaderCode name="Accept" value="image/avif,image/webp,image/*,*/*" /></pre>
      </section>
      <section className="doc-section doc-caching" aria-labelledby="caching">
        <h2 id="caching">{messages.caching}</h2>
        <dl className="cache-rules">
          <div>
            <dt><code>200 OK</code></dt>
            <dd>{`${text.edge}: ${formatTtl(config.cache.edgeTtlOk, locale, text.seconds, text.minutes)} · ${text.browser}: ${formatTtl(config.cache.browserTtlOk, locale, text.seconds, text.minutes)}`}</dd>
          </div>
          <div>
            <dt><code>404</code></dt>
            <dd>{`${text.edge}: ${formatTtl(config.cache.edgeTtl404, locale, text.seconds, text.minutes)} · ${text.browser}: ${formatTtl(config.cache.browserTtl404, locale, text.seconds, text.minutes)}`}</dd>
          </div>
          <div>
            <dt><HeaderCode name="Vary" value="Accept" /></dt>
            <dd>{text.vary}</dd>
          </div>
        </dl>
      </section>
      <section className="doc-section doc-examples" aria-labelledby="examples">
        <h2 id="examples">{text.examples}</h2>
        <pre><RequestCode route="/avatar/" variable="205e460b479e2e5b48aec07710c08d50" query={[['s', '128']]} /></pre>
        <pre><RequestCode route="/avatar" query={[['email', 'email@example.com'], ['size', '256']]} /></pre>
        <pre><RequestCode route="/avatar" query={[['email', 'email@example.com'], ['size', '500'], ['d', 'initials'], ['initials', 'A']]} /></pre>
        {!config.api.allowRawEmail && <p>{text.disabled}</p>}
      </section>
    </>
  )
}
