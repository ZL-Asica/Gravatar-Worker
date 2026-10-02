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
    <form className="link-generator" data-avatar-link-form>
      <div className="link-generator-fields">
        <label>
          {messages.email}
          <input data-avatar-email type="email" inputMode="email" autoComplete="email" placeholder="email@example.com" required />
        </label>
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
          <select data-avatar-default>
            {FALLBACK_OPTIONS.map(option => (
              <option key={option.value} value={option.value} selected={option.value === '404'}>{option.value === '404' ? messages.fallback404 : option.value === 'mp' ? messages.fallbackPerson : option.value === 'blank' ? messages.fallbackBlank : option.value === 'initials' ? messages.initials : option.label}</option>
            ))}
          </select>
        </label>
        <label data-avatar-initials-field hidden>
          {messages.initials}
          <input data-avatar-initials type="text" inputMode="text" maxLength={4} placeholder="ZA" />
        </label>
      </div>

      <div className="link-generator-result" data-avatar-result aria-live="polite" hidden>
        <img className="avatar-preview" data-avatar-preview alt={messages.preview} width={config.api.defaultSize} height={config.api.defaultSize} hidden />
        <div className="generated-links">
          <label>
            {messages.directUrl}
            <span className="copy-row">
              <input id="generated-avatar-url" data-avatar-url readOnly />
              <button type="button" data-copy-target="#generated-avatar-url">{messages.copy}</button>
            </span>
          </label>
          <label>
            Markdown
            <span className="copy-row">
              <textarea id="generated-avatar-markdown" data-avatar-markdown readOnly rows={2} />
              <button type="button" data-copy-target="#generated-avatar-markdown">{messages.copy}</button>
            </span>
          </label>
          <label>
            HTML
            <span className="copy-row">
              <textarea id="generated-avatar-html" data-avatar-html readOnly rows={2} />
              <button type="button" data-copy-target="#generated-avatar-html">{messages.copy}</button>
            </span>
          </label>
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
      >
        {messages.generatorEmpty}
      </p>
    </form>
  )
}
