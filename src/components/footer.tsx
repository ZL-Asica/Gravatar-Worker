interface FooterProps {
  config: SiteConfig
  currentYear: number
}

const Footer = ({ config, currentYear }: FooterProps) => {
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
        | All rights reserved.
      </p>
      <p class="footer-text">
        Powered by
        {' '}
        <a href={config.branding.repositoryUrl} target="_blank" rel="noopener noreferrer" class="footer-link">
          {config.branding.sourceText}
        </a>
        {creditLabel !== undefined && (
          <>
            {' '}
            ·
            {' '}
            Crafted by
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
