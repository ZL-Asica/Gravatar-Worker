import type { Locale } from '../i18n'
import { getMessages } from '../i18n'
import { LanguageSwitcher } from './language-switcher'

export const SiteHeader = ({ config, locale, path }: { config: SiteConfig, locale: Locale, path: string }) => {
  const messages = getMessages(locale)
  const links = [['/', messages.navHome], ['/docs', messages.navDocs], ['/leaderboard', messages.navLeaderboard]]
  return (
    <header class="site-header">
      <a class="brand" href={`/?lang=${locale}`}>{config.branding.siteName}</a>
      <nav class="main-nav" aria-label={messages.navHome}>
        {links.map(([href, label]) => <a key={href} href={`${href}?lang=${locale}`} aria-current={path === href ? 'page' : undefined}>{label}</a>)}
      </nav>
      <LanguageSwitcher locale={locale} path={path} />
    </header>
  )
}
