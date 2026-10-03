import type { Locale } from '../i18n'
import { getMessages } from '../i18n'

const FALLBACK_OPTIONS = [
  { value: '404', label: '404 response' },
  { value: 'mp', label: 'Mystery person' },
  { value: 'identicon', label: 'Identicon' },
  { value: 'monsterid', label: 'Monster ID' },
  { value: 'retro', label: 'Retro' },
  { value: 'robohash', label: 'RoboHash' },
  { value: 'blank', label: 'Blank image' },
  { value: 'initials', label: 'Initials' },
]

const COMMON_AVATAR_SIZES = [64, 96, 128, 200, 256, 512]

export const AvatarGenerator = ({ config, locale }: { config: SiteConfig, locale: Locale }) => {
  const messages = getMessages(locale)
  const sizeOptions = Array.from(new Set([...COMMON_AVATAR_SIZES.filter(size => size <= config.api.maxSize), config.api.defaultSize])).sort((a, b) => a - b)
  return (
    <form className="link-generator" data-avatar-link-form noValidate>
      <div className="link-generator-fields">
        <fieldset className="generator-field generator-email-field">
          <legend>{messages.stepEmail}</legend>
          <label>
            {messages.email}
            <input aria-describedby="email-hint" data-avatar-email type="email" inputMode="email" autoComplete="email" placeholder={messages.emailPlaceholder} required />
          </label>
          <p id="email-hint" className="field-hint">{messages.emailHint}</p>
        </fieldset>
        <fieldset className="generator-field generator-options-field">
          <legend>{messages.stepOptions}</legend>
          <div className="generator-options">
            <label>
              {messages.size}
              <select data-avatar-size>
                {sizeOptions.map(size => (
                  <option key={size} value={String(size)} selected={size === config.api.defaultSize}>
                    {size}
                    {' '}
                    px
                  </option>
                ))}
              </select>
            </label>
            <label>
              {messages.fallback}
              <select aria-describedby="fallback-hint" data-avatar-default>
                {FALLBACK_OPTIONS.map(option => (
                  <option key={option.value} value={option.value} selected={option.value === '404'}>{option.value === '404' ? messages.fallback404 : option.value === 'mp' ? messages.fallbackPerson : option.value === 'blank' ? messages.fallbackBlank : option.value === 'initials' ? messages.initials : option.label}</option>
                ))}
              </select>
            </label>
          </div>
          <p id="fallback-hint" className="field-hint">{messages.fallbackHint}</p>
          <label data-avatar-initials-field hidden>
            {messages.initials}
            <input data-avatar-initials type="text" inputMode="text" maxLength={4} placeholder="ZA" />
          </label>
        </fieldset>
      </div>

      <p className="result-placeholder" data-avatar-placeholder>{messages.resultPlaceholder}</p>
      <div className="link-generator-result" data-avatar-result hidden>
        <div className="preview-column">
          <span className="preview-label">{messages.preview}</span>
          <img className="avatar-preview" data-avatar-preview alt={messages.preview} width={config.api.defaultSize} height={config.api.defaultSize} hidden />
        </div>
        <div className="generated-links">
          <div className="output-group">
            <label>{messages.directUrl}</label>
            <button type="button" className="copy-field" data-copy-value="url" aria-label={`${messages.copy} ${messages.directUrl}`}>
              <code data-avatar-url-display />
            </button>
          </div>
          <div className="output-group">
            <label>{messages.markdown}</label>
            <button type="button" className="copy-field" data-copy-value="markdown" aria-label={`${messages.copy} ${messages.markdown}`}>
              <code data-avatar-markdown-display />
            </button>
          </div>
          <div className="output-group">
            <label>{messages.html}</label>
            <button type="button" className="copy-field" data-copy-value="html" aria-label={`${messages.copy} ${messages.html}`}>
              <code data-avatar-html-display />
            </button>
          </div>
        </div>
      </div>
      <p
        className="generator-status"
        role="status"
        data-avatar-status
        data-avatar-message-empty={messages.generatorEmpty}
        data-avatar-message-invalid={messages.generatorInvalid}
        data-avatar-message-working={messages.generatorWorking}
        data-avatar-message-ready={messages.generatorReady}
        data-avatar-message-copied={messages.copied}
        data-avatar-message-clipboard={messages.clipboardUnavailable}
        data-avatar-message-crypto={messages.cryptoUnavailable}
        data-avatar-message-preview={messages.preview}
        data-avatar-message-preview-error={messages.previewError}
      />
    </form>
  )
}
