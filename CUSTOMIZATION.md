# Customization Guide

This project is designed so your fork can be customized by editing `wrangler.jsonc`.
Wrangler treats `wrangler.jsonc` as the source of truth on deploy, so **don’t rely on Cloudflare Dashboard environment variables** unless you intentionally opt into that workflow (see note below).

## 5-minute after-fork setup

1. Update configuration in `wrangler.jsonc` (`vars` section)
   - Set `ME_EMAIL` (or `ME_HASH`) so `/avatar/me` works.
   - Set `SITE_NAME` and `SITE_DESCRIPTION`.
   - (Optional) leave `SITE_URL` empty — the Worker can infer it from the request origin.

2. Replace assets
   - Replace `public/og.png` and `public/favicon.ico` (or update `OG_IMAGE_URL` / `FAVICON_PATH`).

3. (Optional) tighten the API
   - Set `ALLOW_RAW_EMAIL=false` to disable `/avatar?email=`.

4. Deploy
   - `npm run deploy` (or `wrangler deploy`)

## Local development vars (recommended)

For local dev overrides, create `.dev.vars`:

- Copy `.dev.vars.example` → `.dev.vars`
- Put your dev-only values there (e.g., `ME_EMAIL=...`)

These do not need to be committed.

## Custom domain routing (optional)

The repo includes a `routes` / custom domain by default.
If you own a Cloudflare zone and want a custom domain, add a route after your first deploy.
If not, delete the `routes` section from `wrangler.jsonc` to use the default `*.workers.dev` domain.

## Note: “I want to configure in the Cloudflare Dashboard instead”

If you want Dashboard variables to be the source of truth, add `"keep_vars": true` to `wrangler.jsonc`.
Then Wrangler will preserve Dashboard-set vars instead of overwriting them on deploy.
