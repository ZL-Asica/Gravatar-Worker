import type { Locale } from '../i18n'
import { getMessages } from '../i18n'
import { AvatarGenerator } from './avatar-generator'
import { Documentation } from './documentation'
import Footer from './footer'
import { SiteHeader } from './site-header'

interface ApiDocsProps { config: SiteConfig, currentYear: number, locale: Locale, docsOnly?: boolean }

const ApiDocs = ({ config, currentYear, locale, docsOnly = false }: ApiDocsProps) => {
  const messages = getMessages(locale)
  return (
    <div class="site-shell">
      <SiteHeader config={config} locale={locale} path={docsOnly ? '/docs' : '/'} />
      <main>
        <section class="hero" aria-labelledby="page-title">
          <p class="eyebrow">{config.branding.siteName}</p>
          <h1 id="page-title">{docsOnly ? messages.apiReference : messages.eyebrow}</h1>
          <p class="subtitle">{docsOnly ? messages.subtitle : messages.generatorIntro}</p>
        </section>
        {docsOnly
          ? (
              <div class="docs-grid">
                <Documentation config={config} locale={locale} endpointsOnly />
                <Documentation config={config} locale={locale} />
              </div>
            )
          : <AvatarGenerator config={config} locale={locale} />}
      </main>
      <Footer config={config} currentYear={currentYear} locale={locale} />
    </div>
  )
}
export default ApiDocs
