# Gravatar Worker

> A fast, modern, and cache-friendly Gravatar CDN proxy — built with **Cloudflare Workers** and **Hono**.

[![GitHub License][license-badge]][license-link] [![Latest Release][release-badge]][release-link]

[![Node.js][node-badge]][node-link] [![pnpm Version][pnpm-badge]][pnpm-link] | [![Hono][Hono-badge]][Hono-link] [![Vite][Vite-badge]][Vite-link] [![Cloudflare Worker][Cloudflare-badge]][Cloudflare-link]

Supports:

- MD5 / SHA-256 hash or raw email lookups
- Smart caching (Edge + Browser)
- Auto image format conversion to **AVIF** or **WebP** based on `Accept` header
<!-- - Fallback handling and future customization -->

## 🌐 Endpoints

### 🔹 `GET /avatar/:hash`

Fetches the Gravatar avatar via precomputed MD5 or SHA-256 hash.

**Example:**

```http
GET /avatar/205e460b479e2e5b48aec07710c08d50?s=128
```

### 🔹 `GET /avatar?email=<email>`

Fetches the avatar by raw email (safely hashed server-side).

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

| Response | Browser TTL | Edge TTL | Notes                            |
| -------- | ----------- | -------- | -------------------------------- |
| `200 OK` | 1 day       | 30 days  | `stale-while-revalidate` enabled |
| `404`    | 5 minutes   | 1 hour   | Allows retry for new users       |

Built-in Cloudflare CDN handles global delivery and bandwidth optimization.

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
