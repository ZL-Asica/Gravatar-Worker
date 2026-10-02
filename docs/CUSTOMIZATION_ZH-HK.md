# 個人化設定指南

這個專案的 fork 版本主要透過編輯 `wrangler.jsonc` 完成設定。

Wrangler 部署時會以 `wrangler.jsonc` 作為設定來源，所以除非你明確想改用 Cloudflare Dashboard 管理變數，否則**不要依賴 Dashboard 入面的環境變數**。

## Fork 後 5 分鐘設定

1. 更新 `wrangler.jsonc` 的 `vars` 部分
   - 設定 `SITE_NAME`、`SITE_TAGLINE` 和 `SITE_DESCRIPTION`。
   - 設定 `ME_EMAIL` 或 `ME_HASH`，令 `/avatar/me` 可用。
   - `SITE_URL` 可以留空。留空時，Worker 會使用目前 request 的 origin。
   - 除非確實需要 `/avatar?email=`，否則保持 `ALLOW_RAW_EMAIL=false`。原始電郵查詢會令電郵地址出現在 URL、log、瀏覽器歷史和中間代理鏈路入面。

2. 替換資源
   - 替換 `public/og.png` 和 `public/favicon.ico`。
   - 如果你想使用遠端檔案或重新命名檔案，再更新 `OG_IMAGE_URL` 和 `FAVICON_PATH`。

3. 調整頁腳和源碼連結
   - `FOOTER_TEXT` 和 `CONTACT_URL` 控制主要頁腳署名。
   - `SOURCE_TEXT` 和 `REPOSITORY_URL` 控制源碼連結。
   - `CREDIT_TEXT` 和 `CREDIT_URL` 可以新增一個額外署名連結。
   - `LICENSE_URL` 用於 structured metadata。

   這些欄位你可以按自己的需要調整。如果你願意在公開 fork 入面保留一個指向原專案的小連結，我會很感謝。

4. 部署
   - `pnpm run deploy`，或 `pnpm exec wrangler deploy`。
   - 新 fork 預設部署到 `*.workers.dev` domain；只有在你新增自訂 route 後才會使用自訂 domain。

## 本機開發變數

本機開發時可以建立 `.dev.vars`：

- 將 `.dev.vars.example` 複製為 `.dev.vars`。
- 寫入只用於本機開發的值，例如 `ME_EMAIL`。

這些值不需要提交到 repository。

## 自訂 domain

預設設定不包含 `routes`，這樣首次部署可以直接使用 `*.workers.dev`。

如果你擁有 Cloudflare zone，並想使用自訂 domain，可以在首次部署後新增：

```jsonc
{
  "routes": [
    {
      "pattern": "gravatar.example.com",
      "custom_domain": true
    }
  ]
}
```

## 使用 Cloudflare Dashboard 管理變數

如果你希望 Cloudflare Dashboard 入面的變數成為設定來源，可以在 `wrangler.jsonc` 入面新增 `"keep_vars": true`。

這樣 Wrangler 部署時會保留 Dashboard 入面設定的變數，而不是覆蓋它們。
