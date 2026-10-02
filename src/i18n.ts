export const LOCALES = ['en', 'ja', 'zh-CN', 'zh-TW'] as const
export type Locale = (typeof LOCALES)[number]

export interface Messages {
  languageName: string
  navHome: string
  navDocs: string
  navLeaderboard: string
  eyebrow: string
  title: string
  subtitle: string
  email: string
  emailPlaceholder: string
  size: string
  fallback: string
  initials: string
  generate: string
  directUrl: string
  markdown: string
  html: string
  copy: string
  copied: string
  generatorEmpty: string
  generatorInvalid: string
  generatorWorking: string
  generatorReady: string
  clipboardUnavailable: string
  endpoints: string
  queryParameters: string
  formatNegotiation: string
  caching: string
  leaderboard: string
  leaderboardIntro: string
  domain: string
  requests: string
  bytes: string
  cacheHitRate: string
  noData: string
  apiReference: string
  footerRights: string
}

const EN: Messages = {
  languageName: 'English',
  navHome: 'Generator',
  navDocs: 'API docs',
  navLeaderboard: 'Leaderboard',
  eyebrow: 'Avatar link generator',
  title: 'A faster link to every Gravatar.',
  subtitle: 'Hash an email in your browser, choose a fallback, and copy a production-ready avatar URL without sending the email to this Worker.',
  email: 'Email address',
  emailPlaceholder: 'you@example.com',
  size: 'Size',
  fallback: 'Fallback',
  initials: 'Initials',
  generate: 'Generate link',
  directUrl: 'Direct URL',
  markdown: 'Markdown',
  html: 'HTML',
  copy: 'Copy',
  copied: 'Copied to clipboard.',
  generatorEmpty: 'Enter an email address to generate a hash-based avatar link.',
  generatorInvalid: 'Enter a valid email address.',
  generatorWorking: 'Generating link…',
  generatorReady: 'Generated locally. The email was not sent to this Worker.',
  clipboardUnavailable: 'Clipboard access is unavailable. Select the field and copy manually.',
  endpoints: 'Endpoints',
  queryParameters: 'Query parameters',
  formatNegotiation: 'Format negotiation',
  caching: 'Caching',
  leaderboard: 'Leaderboard',
  leaderboardIntro: 'A privacy-aware snapshot of the busiest domains using this Worker.',
  domain: 'Domain',
  requests: 'Requests',
  bytes: 'Data served',
  cacheHitRate: 'Cache hit rate',
  noData: 'No leaderboard snapshot is configured yet.',
  apiReference: 'API reference',
  footerRights: 'All rights reserved.',
}

const JA: Messages = {
  ...EN,
  languageName: '日本語',
  navHome: '生成ツール',
  navDocs: 'API ドキュメント',
  navLeaderboard: 'ランキング',
  eyebrow: 'アバターリンク生成',
  title: 'すべての Gravatar へ、より速いリンクを。',
  subtitle: 'ブラウザでメールアドレスをハッシュ化し、フォールバックを選んで、本番で使えるアバター URL をコピーできます。メールアドレスは Worker に送信されません。',
  email: 'メールアドレス',
  emailPlaceholder: 'you@example.com',
  size: 'サイズ',
  fallback: 'フォールバック',
  initials: 'イニシャル',
  generate: 'リンクを生成',
  directUrl: '直接 URL',
  markdown: 'Markdown',
  html: 'HTML',
  copy: 'コピー',
  copied: 'クリップボードにコピーしました。',
  generatorEmpty: 'メールアドレスを入力するとアバターリンクを生成します。',
  generatorInvalid: '有効なメールアドレスを入力してください。',
  generatorWorking: 'リンクを生成中…',
  generatorReady: 'ローカルで生成しました。メールアドレスは Worker に送信されていません。',
  clipboardUnavailable: 'クリップボードを利用できません。フィールドを選択して手動でコピーしてください。',
  endpoints: 'エンドポイント',
  queryParameters: 'クエリパラメータ',
  formatNegotiation: '形式の自動選択',
  caching: 'キャッシュ',
  leaderboard: 'ランキング',
  leaderboardIntro: 'この Worker を利用するドメインのアクセス状況を、プライバシーに配慮して表示します。',
  domain: 'ドメイン',
  requests: 'リクエスト数',
  bytes: '配信データ量',
  cacheHitRate: 'キャッシュヒット率',
  noData: 'ランキングデータはまだ設定されていません。',
  apiReference: 'API リファレンス',
  footerRights: 'All rights reserved.',
}

const ZH_CN: Messages = {
  ...EN,
  languageName: '简体中文',
  navHome: '生成器',
  navDocs: 'API 文档',
  navLeaderboard: '排行榜',
  eyebrow: '头像链接生成器',
  title: '更快地生成每个 Gravatar 链接。',
  subtitle: '在浏览器中计算邮箱哈希，选择回退头像并复制可直接用于生产环境的头像 URL。邮箱不会发送到 Worker。',
  email: '邮箱地址',
  emailPlaceholder: 'you@example.com',
  size: '尺寸',
  fallback: '回退头像',
  initials: '首字母',
  generate: '生成链接',
  directUrl: '直接 URL',
  markdown: 'Markdown',
  html: 'HTML',
  copy: '复制',
  copied: '已复制到剪贴板。',
  generatorEmpty: '输入邮箱地址以生成基于哈希的头像链接。',
  generatorInvalid: '请输入有效的邮箱地址。',
  generatorWorking: '正在生成链接…',
  generatorReady: '已在本地生成。邮箱没有发送到 Worker。',
  clipboardUnavailable: '无法访问剪贴板，请选择字段后手动复制。',
  endpoints: '接口',
  queryParameters: '查询参数',
  formatNegotiation: '格式协商',
  caching: '缓存',
  leaderboard: '排行榜',
  leaderboardIntro: '以保护隐私的方式展示使用此 Worker 最频繁的域名。',
  domain: '域名',
  requests: '请求数',
  bytes: '数据量',
  cacheHitRate: '缓存命中率',
  noData: '尚未配置排行榜快照。',
  apiReference: 'API 参考',
  footerRights: '保留所有权利。',
}

const ZH_TW: Messages = {
  ...ZH_CN,
  languageName: '繁體中文',
  navHome: '產生器',
  navDocs: 'API 文件',
  navLeaderboard: '排行榜',
  eyebrow: '頭像連結產生器',
  title: '更快產生每個 Gravatar 連結。',
  subtitle: '在瀏覽器中計算電子郵件雜湊，選擇備援頭像並複製可直接用於正式環境的頭像 URL。電子郵件不會傳送到 Worker。',
  email: '電子郵件地址',
  size: '尺寸',
  fallback: '備援頭像',
  initials: '縮寫',
  generate: '產生連結',
  directUrl: '直接 URL',
  copied: '已複製到剪貼簿。',
  generatorEmpty: '輸入電子郵件地址以產生雜湊頭像連結。',
  generatorInvalid: '請輸入有效的電子郵件地址。',
  generatorWorking: '正在產生連結…',
  generatorReady: '已在本機產生。電子郵件沒有傳送到 Worker。',
  clipboardUnavailable: '無法存取剪貼簿，請選取欄位後手動複製。',
  endpoints: '端點',
  queryParameters: '查詢參數',
  formatNegotiation: '格式協商',
  caching: '快取',
  leaderboard: '排行榜',
  leaderboardIntro: '以保護隱私的方式顯示最常使用此 Worker 的網域。',
  domain: '網域',
  requests: '請求數',
  bytes: '資料量',
  cacheHitRate: '快取命中率',
  noData: '尚未設定排行榜快照。',
  apiReference: 'API 參考',
  footerRights: '保留所有權利。',
}

const MESSAGES: Record<Locale, Messages> = { 'en': EN, 'ja': JA, 'zh-CN': ZH_CN, 'zh-TW': ZH_TW }

export const getMessages = (locale: Locale): Messages => MESSAGES[locale]

const normalizeLocale = (value: string | undefined): Locale | undefined => {
  if (value === undefined) {
    return undefined
  }
  const normalized = value.trim().toLowerCase()
  if (normalized === 'ja' || normalized.startsWith('ja-')) {
    return 'ja'
  }
  if (normalized === 'zh-tw' || normalized === 'zh-hant' || normalized === 'zh-hk' || normalized === 'zh-mo') {
    return 'zh-TW'
  }
  if (normalized === 'zh' || normalized.startsWith('zh-cn') || normalized.startsWith('zh-hans') || normalized === 'zh-sg') {
    return 'zh-CN'
  }
  if (normalized === 'en' || normalized.startsWith('en-')) {
    return 'en'
  }
  return undefined
}

export const resolveLocale = (preferred: string | undefined, acceptLanguage: string | undefined): Locale => {
  return normalizeLocale(preferred)
    ?? acceptLanguage?.split(',').map(part => normalizeLocale(part.split(';')[0])).find(Boolean)
    ?? 'en'
}

export const localeLabel = (locale: Locale): string => MESSAGES[locale].languageName
