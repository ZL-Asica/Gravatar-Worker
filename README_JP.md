# Gravatar Worker

[English](./README.md) | [简体中文](./README_ZH-CN.md) | **日本語**

> **Cloudflare Workers** と **Hono** で構築された、**高速・モダン・キャッシュフレンドリー**な Gravatar CDN プロキシ。

[![GitHub License][license-badge]][license-link] [![Latest Release][release-badge]][release-link]

[![Node.js][node-badge]][node-link] [![pnpm Version][pnpm-badge]][pnpm-link] | [![Hono][Hono-badge]][Hono-link] [![Vite][Vite-badge]][Vite-link] [![Cloudflare Worker][Cloudflare-badge]][Cloudflare-link]

対応機能（Supports）：

- **MD5 / SHA-256** ハッシュ検索、および任意で有効化できる **raw email（生メールアドレス）** 検索
- スマートキャッシュ（Edge + Browser）
- `Accept` ヘッダーに基づく **AVIF / WebP** への自動フォーマット変換
<!-- 将来的な：フォールバック処理やカスタマイズ -->

## 🧩 カスタマイズ（Customization）

Fork 後は主に `wrangler.jsonc` でサイト名、説明、アバター設定、フッターリンク、ソースリンク、デプロイドメインを調整できます。詳しくは [`docs/CUSTOMIZATION_JP.md`](./docs/CUSTOMIZATION_JP.md) を参照してください。

## 🌐 エンドポイント（Endpoints）

### 🔹 `GET /avatar/me`

メンテナーの Gravatar アバターを取得（パラメータ不要）。

**例：**

```http
GET /avatar/me
```

### 🔹 `GET /avatar/:hash`

事前計算済み **MD5** または **SHA-256** ハッシュでアバターを取得。

**例：**

```http
GET /avatar/205e460b479e2e5b48aec07710c08d50?s=128
```

### 🔹 `GET /avatar?email=<email>`

**raw email** でアバターを取得（サーバー側で安全に正規化してハッシュ化）。このエンドポイントはデフォルトで無効です。メールアドレスが URL、ログ、ブラウザ履歴、中間プロキシに残る可能性を許容する場合のみ、`ALLOW_RAW_EMAIL=true` を設定してください。メールが未指定または無効な場合、`email@example.com` にフォールバック。

**例：**

```http
GET /avatar?email=email@example.com&size=256
```

## ⚙️ クエリパラメータ（Query Parameters）

| パラメータ（Param） | 説明（Description）                            | 既定値（Default） |
| ------------------- | ---------------------------------------------- | ----------------- |
| `s` / `size`        | 画像サイズ（ピクセル、正方形。例：128x128）    | `200`             |
| `d` / `default`     | デフォルトのフォールバック（URL または `404`） | `404`             |

## 🎨 フォーマットネゴシエーション（Format Negotiation）

最適な画像フォーマットを自動返却：

- `image/avif`（対応ブラウザなら最優先）
- `image/webp`（フォールバック）
- 元の **JPEG**（最終フォールバック 🙃）

ブラウザの `Accept` ヘッダーに基づいて判定し、`q=0.9` のような品質値にも対応：

```http
Accept: image/avif,image/webp,image/*,*/*
```

Worker のメモリと CPU 制限を守るため、大きすぎる画像や未対応の元形式は元の形式のままストリーミングされる場合があります。

## 📦 キャッシュ戦略（Caching Strategy）

| レスポンス（Response） | Browser TTL | Edge TTL | Stale-While-Revalidate | 備考（Notes）                        |
| ---------------------- | ----------- | -------- | ---------------------- | ------------------------------------ |
| `200 OK`               | 3 日        | 7 日     | 7 日                   | 長期キャッシュ＋バックグラウンド更新 |
| `404`                  | 5 分        | 1 時間   | 1 時間                 | 新規ユーザーでの再試行を許可         |

内蔵の **Cloudflare CDN** がグローバル配信と帯域最適化を担当。キャッシュ制御は以下を使用：

- **`Cache-Control`**：ブラウザキャッシュ
- **`CDN-Cache-Control`**：エッジキャッシュ（より長い TTL）
- **`Vary: Accept`**：コンテンツネゴシエーションに応じた適切な分割キャッシュ
- **`ETag`**：効率的な再検証（revalidation）

## 🧪 技術スタック（Tech Stack）

- **[Cloudflare Workers][Cloudflare-link]** — 設計上、高速かつグローバル
- **[Hono][Hono-link]** — 軽量なルーティングフレームワーク（API ドキュメントに Hono JSX も使用）
- **[@jsquash][jSquash-link]** — WASM による AVIF/WebP エンコード
- **TypeScript** — 強い型付け、strict モード
- **Pure CSS** — カスタムテーマ 💮

## 🧾 ライセンス（License）

本プロジェクトは [MIT License][license-link] の下で提供されます。

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
