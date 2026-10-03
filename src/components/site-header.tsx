import type { Locale } from '../i18n'
import { getMessages } from '../i18n'
import { LanguageSwitcher } from './language-switcher'

export const SiteHeader = ({ config, locale, path }: { config: SiteConfig, locale: Locale, path: string }) => {
  const messages = getMessages(locale)
  const links = [['/', messages.navHome], ['/docs', messages.navDocs], ['/leaderboard', messages.navLeaderboard]]
  return (
    <header class="site-header">
      <a class="skip-link" href="#main-content">{messages.skipToContent}</a>
      <a class="brand" href={`/?lang=${locale}`}>
        <img src="/logo-mark.svg" alt="" width="36" height="36" />
        <span translate="no">{config.branding.siteName}</span>
      </a>
      <nav class="main-nav" aria-label={messages.navHome}>
        {links.map(([href, label]) => <a key={href} href={`${href}?lang=${locale}`} aria-current={path === href ? 'page' : undefined}>{label}</a>)}
      </nav>
      <LanguageSwitcher locale={locale} path={path} />
    </header>
  )
}
