interface FooterProps {
  config: SiteConfig
}

const CURRENT_YEAR = new Date().getFullYear()

const Footer = ({ config }: FooterProps) => {
  const footerLabel = config.branding.footerText ?? config.branding.siteName

  return (
    <footer class="footer">
      <p class="footer-text">
        ©
        {' '}
        {CURRENT_YEAR}
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
