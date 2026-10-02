import type { Locale } from '../i18n'
import { getMessages } from '../i18n'

interface FooterProps {
  config: SiteConfig
  locale?: Locale
  currentYear: number
}

const Footer = ({ config, currentYear, locale = 'en' }: FooterProps) => {
  const messages = getMessages(locale)
  const footerLabel = config.branding.footerText ?? config.branding.siteName
  const creditLabel = config.branding.creditText

  return (
    <footer class="footer">
      <p class="footer-text">
        ©
        {' '}
        {currentYear}
        {' '}
        {config.branding.contactUrl !== undefined
          ? (
              <a href={config.branding.contactUrl} target="_blank" rel="noopener noreferrer" class="footer-link">
                {footerLabel}
              </a>
            )
          : (
              <span>{footerLabel}</span>
            )}
        {' '}
        |
        {' '}
        {messages.footerRights}
      </p>
      <p class="footer-text">
        {messages.poweredBy}
        {' '}
        <a href={config.branding.repositoryUrl} target="_blank" rel="noopener noreferrer" class="footer-link">
          {config.branding.sourceText}
        </a>
        {creditLabel !== undefined && (
          <>
            {' '}
            ·
            {' '}
            {messages.craftedBy}
            {' '}
            {config.branding.creditUrl !== undefined
              ? (
                  <a href={config.branding.creditUrl} target="_blank" rel="noopener noreferrer" class="footer-link">
                    {creditLabel}
                  </a>
                )
              : (
                  <span>{creditLabel}</span>
                )}
          </>
        )}
      </p>
    </footer>
  )
}

export default Footer
