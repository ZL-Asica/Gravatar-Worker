# 个性化配置指南

这个项目的 fork 版本主要通过编辑 `wrangler.jsonc` 完成配置。

Wrangler 在部署时会把 `wrangler.jsonc` 视为配置来源，所以除非你明确想改用 Cloudflare Dashboard 管理变量，否则**不要依赖 Dashboard 里的环境变量**。

## Fork 后 5 分钟配置

1. 更新 `wrangler.jsonc` 的 `vars` 部分
   - 设置 `SITE_NAME`、`SITE_TAGLINE` 和 `SITE_DESCRIPTION`。
   - 设置 `ME_EMAIL` 或 `ME_HASH`，让 `/avatar/me` 可用。
   - `SITE_URL` 可以留空。留空时，Worker 会使用当前请求的 origin。
   - 除非确实需要 `/avatar?email=`，否则保持 `ALLOW_RAW_EMAIL=false`。原始邮箱查询会让邮箱出现在 URL、日志、浏览器历史和中间代理链路里。

2. 替换资源
   - 替换 `public/og.png` 和 `public/favicon.ico`。
   - 如果你想使用远程文件或重命名文件，再更新 `OG_IMAGE_URL` 和 `FAVICON_PATH`。

3. 调整页脚和源码链接
   - `FOOTER_TEXT` 和 `CONTACT_URL` 控制主要页脚署名。
   - `SOURCE_TEXT` 和 `REPOSITORY_URL` 控制源码链接。
   - `CREDIT_TEXT` 和 `CREDIT_URL` 可以添加一个额外署名链接。
   - `LICENSE_URL` 用于结构化元数据。

   这些字段你可以按自己的需要随意调整。如果你愿意在公开 fork 里保留一个指向原项目的小链接，我会很感谢。

4. 部署
   - `pnpm run deploy`，或 `pnpm exec wrangler deploy`。
   - 新 fork 默认部署到 `*.workers.dev` 域名；只有在你添加自定义 route 后才会使用自定义域名。

## 本地开发变量

本地开发时可以创建 `.dev.vars`：

- 将 `.dev.vars.example` 复制为 `.dev.vars`。
- 写入只用于本地开发的值，例如 `ME_EMAIL`。

这些值不需要提交到仓库。

## 自定义域名

默认配置不包含 `routes`，这样首次部署可以直接使用 `*.workers.dev`。

如果你拥有 Cloudflare zone，并想使用自定义域名，可以在首次部署后添加：

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

## 使用 Cloudflare Dashboard 管理变量

如果你希望 Cloudflare Dashboard 里的变量成为配置来源，可以在 `wrangler.jsonc` 里添加 `"keep_vars": true`。

这样 Wrangler 部署时会保留 Dashboard 中设置的变量，而不是覆盖它们。
