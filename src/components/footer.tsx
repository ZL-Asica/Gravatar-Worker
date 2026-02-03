interface FooterProps {
  config: SiteConfig
}

const Footer = ({ config }: FooterProps) => {
  const currentYear = new Date().getFullYear()
  const footerLabel = config.branding.footerText ?? config.branding.siteName

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
        <a href="https://github.com/ZL-Asica/Gravatar-Worker" target="_blank" rel="noopener noreferrer" class="footer-link">
          Gravatar Worker
        </a>
        {' '}
        ·
        Crafted by
        {' '}
        <a href="https://zla.pub" target="_blank" rel="noopener noreferrer" class="footer-link">
          ZL Asica
        </a>
      </p>
    </footer>
  )
}

export default Footer
