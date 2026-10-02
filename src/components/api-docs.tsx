import type { Locale } from '../i18n'
import { getMessages } from '../i18n'
import { AvatarGenerator } from './avatar-generator'
import { Documentation } from './documentation'
import Footer from './footer'
import { LanguageSwitcher } from './language-switcher'

interface ApiDocsProps { config: SiteConfig, currentYear: number, locale: Locale }

const ApiDocs = ({ config, currentYear, locale }: ApiDocsProps) => {
  const messages = getMessages(locale)
  return (
    <main className="api-docs" aria-label={`${config.branding.siteName} ${messages.apiReference}`}>
      <header>
        <LanguageSwitcher locale={locale} />
        <p className="eyebrow">{messages.apiReference}</p>
        <h1>{config.branding.siteName}</h1>
        <p className="subtitle">{locale === 'en' ? config.branding.siteTagline : messages.subtitle}</p>
      </header>
      <Documentation config={config} locale={locale} endpointsOnly />
      <section aria-labelledby="generator">
        <h2 id="generator">{messages.eyebrow}</h2>
        <AvatarGenerator config={config} locale={locale} />
      </section>
      <Documentation config={config} locale={locale} />
      <Footer config={config} currentYear={currentYear} locale={locale} />
    </main>
  )
}
export default ApiDocs
