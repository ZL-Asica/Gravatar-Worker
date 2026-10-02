import type { Locale } from './i18n'

const en = {
  me: 'Returns the configured maintainer avatar.',
  hash: 'Returns an avatar for a precomputed MD5 or SHA-256 email hash. Trim whitespace and lowercase the email before hashing.',
  email: 'Raw email addresses can appear in URLs, logs, browser history and proxies. Missing or invalid emails fall back to email@example.com.',
  disabled: 'Raw email lookup is disabled on this deployment.',
  size: 'Width and height in pixels.',
  defaultValue: 'Default',
  fallback: 'Fallback for missing avatars: a supported Gravatar option or an image URL.',
  initials: 'Custom initials; requires d=initials.',
  name: 'Derives initials from a name; requires d=initials.',
  format: 'The Accept header selects AVIF or WebP, respecting quality values. Unsupported or oversized images keep their original format. A cache miss still requires CPU-intensive encoding; caching does not guarantee the Free plan CPU limit.',
  edge: 'Edge',
  browser: 'Browser',
  vary: 'Negotiated formats use separate cache entries.',
  examples: 'Example requests',
  seconds: 'seconds',
}

const ja = {
  me: '設定された管理者のアバターを返します。',
  hash: '前後の空白を除去し、小文字にしたメールアドレスの MD5 または SHA-256 ハッシュでアバターを取得します。',
  email: 'メールアドレスは URL、ログ、履歴、プロキシに残る場合があります。未入力または無効な場合は email@example.com を使用します。',
  disabled: 'この環境ではメールアドレスによる検索は無効です。',
  size: '幅と高さ（ピクセル）。',
  defaultValue: '既定値',
  fallback: 'アバターがない場合に使う Gravatar のオプションまたは画像 URL。',
  initials: '指定したイニシャル。d=initials が必要です。',
  name: '名前からイニシャルを作成。d=initials が必要です。',
  format: 'Accept ヘッダーの優先度で AVIF または WebP を選択します。未対応または大きすぎる画像は元の形式を維持します。キャッシュミス時は負荷の高い変換が必要なため、無料プランの CPU 制限を保証しません。',
  edge: 'エッジ',
  browser: 'ブラウザ',
  vary: '選択された形式ごとにキャッシュを分離します。',
  examples: 'リクエスト例',
  seconds: '秒',
}

const zhCN = {
  me: '返回配置的维护者头像。',
  hash: '使用预先计算的 MD5 或 SHA-256 邮箱哈希获取头像。哈希前需去除首尾空格并转为小写。',
  email: '原始邮箱可能出现在 URL、日志、浏览历史和代理中。缺失或无效邮箱会回退到 email@example.com。',
  disabled: '此部署已禁用原始邮箱查询。',
  size: '宽高，单位为像素。',
  defaultValue: '默认值',
  fallback: '头像不存在时使用 Gravatar 支持的选项或图片 URL。',
  initials: '自定义首字母，需设置 d=initials。',
  name: '从姓名提取首字母，需设置 d=initials。',
  format: '按 Accept 头中的优先级选择 AVIF 或 WebP。不支持或过大的图片保留原格式。缓存未命中仍需高 CPU 编码，缓存并不保证满足免费套餐 CPU 限制。',
  edge: '边缘',
  browser: '浏览器',
  vary: '协商格式使用独立缓存条目。',
  examples: '请求示例',
  seconds: '秒',
}

const zhTW = {
  me: '回傳設定的維護者頭像。',
  hash: '使用預先計算的 MD5 或 SHA-256 電子郵件雜湊取得頭像。雜湊前需移除前後空白並轉為小寫。',
  email: '原始電子郵件可能出現在 URL、日誌、瀏覽紀錄及代理中。缺少或無效的地址會改用 email@example.com。',
  disabled: '此部署已停用原始電子郵件查詢。',
  size: '寬高，單位為像素。',
  defaultValue: '預設值',
  fallback: '頭像不存在時使用 Gravatar 支援的選項或圖片 URL。',
  initials: '自訂縮寫，需設定 d=initials。',
  name: '從姓名擷取縮寫，需設定 d=initials。',
  format: '依 Accept 標頭中的優先順序選擇 AVIF 或 WebP。不支援或過大的圖片保留原格式。快取未命中仍需高 CPU 編碼，快取並不保證符合免費方案 CPU 限制。',
  edge: '邊緣',
  browser: '瀏覽器',
  vary: '協商格式使用獨立快取項目。',
  examples: '請求範例',
  seconds: '秒',
}

export const docsMessages = { 'en': en, 'ja': ja, 'zh-CN': zhCN, 'zh-TW': zhTW } satisfies Record<Locale, typeof en>
