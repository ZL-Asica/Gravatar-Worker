import type { Locale } from '../i18n'
import { getMessages, localeLabel, LOCALES } from '../i18n'

export const LanguageSwitcher = ({ locale, path = '/' }: { locale: Locale, path?: string }) => (
  <nav class="language-switcher" aria-label={getMessages(locale).language}>
    {LOCALES.map(option => <a key={option} href={`${path}?lang=${option}`} lang={option} aria-current={option === locale ? 'page' : undefined}>{localeLabel(option)}</a>)}
  </nav>
)
