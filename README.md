# Gravatar Worker

**English** | [简体中文](./README_ZH-CN.md) | [日本語](./README_JP.md)

> A fast, modern, and cache-friendly Gravatar CDN proxy — built with **Cloudflare Workers** and **Hono**.

[![GitHub License][license-badge]][license-link] [![Latest Release][release-badge]][release-link][<img src="https://devin.ai/assets/deepwiki-badge.png" alt="DeepWiki" height="20"/>](https://deepwiki.com/ZL-Asica/Gravatar-Worker)

[![Node.js][node-badge]][node-link] [![pnpm Version][pnpm-badge]][pnpm-link] | [![Hono][Hono-badge]][Hono-link] [![Vite][Vite-badge]][Vite-link] [![Cloudflare Worker][Cloudflare-badge]][Cloudflare-link]

Supports:

- MD5 / SHA-256 hash or raw email lookups
- Smart caching (Edge + Browser)
- Auto image format conversion to **AVIF** or **WebP** based on `Accept` header
- Customizable via environment variables
- Lightweight and fast (powered by Cloudflare Workers + Hono)

## 🧩 Customization

See [`CUSTOMIZATION.md`](./CUSTOMIZATION.md) for a 5-minute after-fork checklist and detailed guidance.

### Environment Variables

| Name                | Purpose                                          | Default                    |
| ------------------- | ------------------------------------------------ | -------------------------- |
| `SITE_NAME`         | Site/brand name shown in titles and UI           | `ZLA Gravatar CDN`         |
| `SITE_TAGLINE`      | Optional tagline appended to the title           | (see defaults)             |
| `SITE_DESCRIPTION`  | Meta description and OG description              | (see defaults)             |
| `SITE_URL`          | Canonical origin (used for OG/canonical/sitemap) | `https://gravatar.zla.app` |
| `OG_IMAGE_URL`      | OG image path or URL                             | `/og.png`                  |
| `FAVICON_PATH`      | Favicon path                                     | `/favicon.ico`             |
| `ROBOTS_ALLOW`      | `true/false/1/0` or custom meta value            | `true`                     |
| `FOOTER_TEXT`       | Footer label (linked if `CONTACT_URL` is set)    | `ZL Asica`                 |
| `CONTACT_URL`       | Footer contact link                              | `https://zla.pub/`         |
| `ME_EMAIL`          | Email for `/avatar/me` (hashed server-side)      | unset                      |
| `ME_HASH`           | Precomputed MD5/SHA-256 for `/avatar/me`         | unset                      |
| `ALLOW_RAW_EMAIL`   | Allow `/avatar?email=` endpoint                  | `true`                     |
| `DEFAULT_SIZE`      | Default avatar size                              | `200`                      |
| `MAX_SIZE`          | Maximum avatar size                              | `2048`                     |
| `CACHE_TTL_BROWSER` | Browser cache TTL for 200 responses (seconds)    | `259200`                   |
| `CACHE_TTL_EDGE`    | Edge cache TTL for 200 responses (seconds)       | `604800`                   |
| `HASH`              | Legacy hash env for `/avatar/me`                 | unset                      |

## 🌐 Endpoints

### 🔹 `GET /avatar/me`

Fetches the maintainer's Gravatar avatar with no params needed.

**Example:**

```http
GET /avatar/me
```

### 🔹 `GET /avatar/:hash`

Fetches the Gravatar avatar via precomputed MD5 or SHA-256 hash.

**Example:**

```http
GET /avatar/205e460b479e2e5b48aec07710c08d50?s=128
```

### 🔹 `GET /avatar?email=<email>`

Fetches the avatar by raw email (safely hashed server-side). If the email is invalid, it falls back to `email@example.com`.

**Example:**

```http
GET /avatar?email=email@example.com&size=256
```

## ⚙️ Query Parameters

| Param            | Description                                   | Default |
| ---------------- | --------------------------------------------- | ------- |
| `s` or `size`    | Image size in pixels (square, e.g. 128x128)   | `200`   |
| `d` or `default` | Default fall back option (e.g. a URL, or 404) | `404`   |

## 🎨 Format Negotiation

Automatically returns the most optimized format:

- `image/avif` (if supported)
- `image/webp` (fallback)
- Original JPEG (fallback fallback 🙃)

Based on the browser’s `Accept` header:

```http
Accept: image/avif,image/webp,image/*,*/*
```

## 📦 Caching Strategy

| Response | Browser TTL | Edge TTL | Stale-While-Revalidate | Notes                                     |
| -------- | ----------- | -------- | ---------------------- | ----------------------------------------- |
| `200 OK` | 3 days      | 7 days   | 7 days                 | Long-term caching with background refresh |
| `404`    | 5 minutes   | 1 hour   | 1 hour                 | Allows retry for new users                |

Built-in Cloudflare CDN handles global delivery and bandwidth optimization. The cache strategy uses:

- **`Cache-Control`** for browser caching
- **`CDN-Cache-Control`** for edge caching (longer TTL)
- **`Vary: Accept`** for proper content negotiation
- **`ETag`** for efficient cache validation

## 🧪 Tech Stack

- **[Cloudflare Workers][Cloudflare-link]** – fast and global by design
- **[Hono][Hono-link]** – lightweight routing framework (also Hono JSX for API doc)
- **[@jsquash][jSquash-link]** – AVIF/WebP encoding via WASM
- **TypeScript** – strong typing, strict mode
- **Pure CSS** – custom theme 💮

## 🧾 License

This project is licensed under the [MIT License][license-link].

[Cloudflare-badge]: https://img.shields.io/badge/Cloudflare-F38020?logo=Cloudflare&logoColor=white
[Cloudflare-link]: https://workers.cloudflare.com/
[Hono-badge]: https://img.shields.io/badge/Hono-E36002?logo=hono&logoColor=fff
[Hono-link]: https://hono.dev/
[jSquash-link]: https://github.com/jamsinclair/jSquash
[license-badge]: https://img.shields.io/github/license/ZL-Asica/Gravatar-Worker
[license-link]: ./LICENSE
[node-badge]: https://img.shields.io/badge/node%3E=18.18-339933?logo=node.js&logoColor=white
[node-link]: https://nodejs.org/
[pnpm-badge]: https://img.shields.io/github/package-json/packageManager/ZL-Asica/Gravatar-Worker?label=&logo=pnpm&logoColor=fff&color=F69220
[pnpm-link]: https://pnpm.io/
[release-badge]: https://img.shields.io/github/v/release/ZL-Asica/Gravatar-Worker?display_name=release&label=Version&color=fc8da3
[release-link]: https://github.com/ZL-Asica/Gravatar-Worker/releases/
[Vite-badge]: https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff
[Vite-link]: https://vite.dev/
