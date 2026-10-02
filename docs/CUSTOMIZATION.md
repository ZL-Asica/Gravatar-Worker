# Customization Guide

This project is designed so a fork can be customized mostly by editing `wrangler.jsonc`.

Wrangler treats `wrangler.jsonc` as the source of truth on deploy, so **don't rely on Cloudflare Dashboard environment variables** unless you intentionally opt into that workflow.

## 5-minute after-fork setup

1. Update the `vars` section in `wrangler.jsonc`
   - Set `SITE_NAME`, `SITE_TAGLINE`, and `SITE_DESCRIPTION`.
   - Set `ME_EMAIL` or `ME_HASH` so `/avatar/me` works.
   - Leave `SITE_URL` empty unless you need a fixed canonical origin. When empty, the Worker uses the current request origin.
   - Keep `ALLOW_RAW_EMAIL=false` unless you intentionally need `/avatar?email=`. Raw email lookups place email addresses in URLs, logs, browser history, and intermediary proxies.

2. Replace assets
   - Replace `public/og.png` and `public/favicon.ico`.
   - If you prefer remote or renamed files, update `OG_IMAGE_URL` and `FAVICON_PATH`.

3. Adjust footer and source links
   - `FOOTER_TEXT` and `CONTACT_URL` control the primary footer credit.
   - `SOURCE_TEXT` and `REPOSITORY_URL` control the source link.
   - `CREDIT_TEXT` and `CREDIT_URL` add an optional extra credit link.
   - `LICENSE_URL` is used in structured metadata.

   You can customize these fields however you like. If you keep a small link back to the original project in a public fork, I would really appreciate it.

4. Deploy
   - `pnpm run deploy` (or `pnpm exec wrangler deploy`)
   - New forks deploy to the default `*.workers.dev` domain unless you add a custom route.

## Local development vars

For local dev overrides, create `.dev.vars`:

- Copy `.dev.vars.example` to `.dev.vars`.
- Put your dev-only values there, such as `ME_EMAIL`.

These values do not need to be committed.

## Custom domain routing

The default config does not include a `routes` section, which keeps first deploys simple and uses the default `*.workers.dev` domain.

If you own a Cloudflare zone and want a custom domain, add a route after your first deploy:

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

## Dashboard-managed variables

If you want Cloudflare Dashboard variables to be the source of truth, add `"keep_vars": true` to `wrangler.jsonc`.

Then Wrangler will preserve Dashboard-set vars instead of overwriting them on deploy.
