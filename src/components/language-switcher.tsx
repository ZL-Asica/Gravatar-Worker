import type { Locale } from '../i18n'
import { getMessages, localeLabel, LOCALES } from '../i18n'

export const LanguageSwitcher = ({ locale, path = '/' }: { locale: Locale, path?: string }) => (
  <label class="language-switcher">
    <span class="sr-only">{getMessages(locale).language}</span>
    <select data-language-select aria-label={getMessages(locale).language}>
      {LOCALES.map(option => (
        <option key={option} value={`${path}?lang=${option}`} selected={option === locale} lang={option}>
          {localeLabel(option)}
        </option>
      ))}
    </select>
  </label>
)
