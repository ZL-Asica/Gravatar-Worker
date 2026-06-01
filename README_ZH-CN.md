# Gravatar Worker

[English](./README.md) | **简体中文** | [日本語](./README_JP.md)

> 一个**快速、现代、对缓存友好**的 Gravatar CDN 代理 —— 基于 **Cloudflare Workers** 与 **Hono** 构建。

[![GitHub License][license-badge]][license-link] [![Latest Release][release-badge]][release-link]

[![Node.js][node-badge]][node-link] [![pnpm Version][pnpm-badge]][pnpm-link] | [![Hono][Hono-badge]][Hono-link] [![Vite][Vite-badge]][Vite-link] [![Cloudflare Worker][Cloudflare-badge]][Cloudflare-link]

支持特性（Supports）：

- 通过 **MD5 / SHA-256** 哈希或 **原始邮箱（raw email）** 查询头像
- 智能缓存（Edge + Browser）
- 基于 `Accept` 头自动转换图片格式为 **AVIF** 或 **WebP**
<!-- 预留：回退策略与更灵活的自定义 -->

## 🌐 接口（Endpoints）

### 🔹 `GET /avatar/me`

获取维护者（maintainer）的 Gravatar 头像，无需任何参数。

**示例：**

```http
GET /avatar/me
```

### 🔹 `GET /avatar/:hash`

通过预先计算的 **MD5** 或 **SHA-256** 哈希值获取头像。

**示例：**

```http
GET /avatar/205e460b479e2e5b48aec07710c08d50?s=128
```

### 🔹 `GET /avatar?email=<email>`

通过**原始邮箱**获取头像（服务器端安全地规范化并进行哈希）。若邮箱缺失或无效，将回退到 `email@example.com`。

**示例：**

```http
GET /avatar?email=email@example.com&size=256
```

## ⚙️ 查询参数（Query Parameters）

| 参数（Param）   | 说明（Description）                         | 默认值（Default） |
| --------------- | ------------------------------------------- | ----------------- |
| `s` / `size`    | 图片边长（像素），正方形输出（例：128x128） | `200`             |
| `d` / `default` | 默认回退选项（可为 URL，或 `404` 等）       | `404`             |

## 🎨 格式协商（Format Negotiation）

自动返回更优的图片格式：

- `image/avif`（若浏览器支持）
- `image/webp`（次优回退）
- 原始 **JPEG**（兜底中的兜底 🙃）

根据浏览器的 `Accept` 请求头进行协商，支持 `q=0.9` 这样的质量权重：

```http
Accept: image/avif,image/webp,image/*,*/*
```

为保护 Worker 的内存和 CPU 限制，过大的图片或不支持的源格式可能会以原始格式流式返回。

## 📦 缓存策略（Caching Strategy）

| 响应（Response） | 浏览器 TTL（Browser） | 边缘 TTL（Edge） | 过期后再验证（SWR） | 备注（Notes）                            |
| ---------------- | --------------------- | ---------------- | ------------------- | ---------------------------------------- |
| `200 OK`         | 3 天                  | 7 天             | 7 天                | 长时缓存，后台刷新（background refresh） |
| `404`            | 5 分钟                | 1 小时           | 1 小时              | 允许对新用户更快地重试                   |

内置 **Cloudflare CDN** 负责全球分发与带宽优化。缓存策略使用：

- **`Cache-Control`**：浏览器缓存控制
- **`CDN-Cache-Control`**：边缘节点缓存控制（更长 TTL）
- **`Vary: Accept`**：确保按内容协商分别缓存
- **`ETag`**：高效的缓存校验（revalidation）

## 🧪 技术栈（Tech Stack）

- **[Cloudflare Workers][Cloudflare-link]** —— 天生快速与全球化
- **[Hono][Hono-link]** —— 轻量路由框架（含 Hono JSX 用于 API 文档）
- **[@jsquash][jSquash-link]** —— 通过 WASM 实现 AVIF/WebP 编码
- **TypeScript** —— 强类型，严格模式
- **Pure CSS** —— 自定义主题，纯 CSS 💮

## 🧾 许可证（License）

本项目基于 [MIT License][license-link] 开源。

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
