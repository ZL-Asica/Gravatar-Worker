# カスタマイズガイド

このプロジェクトの fork は、主に `wrangler.jsonc` を編集して設定できます。

Wrangler はデプロイ時に `wrangler.jsonc` を設定の基準として扱うため、意図して Cloudflare Dashboard で変数を管理する場合を除き、**Dashboard の環境変数に依存しないでください**。

## Fork 後の 5 分セットアップ

1. `wrangler.jsonc` の `vars` セクションを更新する
   - `SITE_NAME`、`SITE_TAGLINE`、`SITE_DESCRIPTION` を設定します。
   - `/avatar/me` を使うために `ME_EMAIL` または `ME_HASH` を設定します。
   - `SITE_URL` は空のままでも構いません。空の場合、Worker は現在のリクエスト origin を使用します。
   - `/avatar?email=` が必要な場合を除き、`ALLOW_RAW_EMAIL=false` のままにしてください。raw email 検索では、メールアドレスが URL、ログ、ブラウザ履歴、中間プロキシに残る可能性があります。

2. アセットを置き換える
   - `public/og.png` と `public/favicon.ico` を置き換えます。
   - リモートファイルや別名のファイルを使いたい場合だけ、`OG_IMAGE_URL` と `FAVICON_PATH` を更新します。

3. フッターとソースリンクを調整する
   - `FOOTER_TEXT` と `CONTACT_URL` はメインのフッター表記を制御します。
   - `SOURCE_TEXT` と `REPOSITORY_URL` はソースリンクを制御します。
   - `CREDIT_TEXT` と `CREDIT_URL` は追加のクレジットリンクを表示します。
   - `LICENSE_URL` は構造化メタデータで使われます。

   これらの項目は自由に調整できます。公開 fork で元プロジェクトへの小さなリンクを残してもらえると、とても嬉しいです。

4. デプロイする
   - `pnpm run deploy`、または `pnpm exec wrangler deploy` を実行します。
   - 新しい fork は、カスタム route を追加しない限り、デフォルトの `*.workers.dev` ドメインにデプロイされます。

## ローカル開発用の変数

ローカル開発用の上書きには `.dev.vars` を作成します。

- `.dev.vars.example` を `.dev.vars` にコピーします。
- `ME_EMAIL` など、ローカルだけで使う値を入れます。

これらの値をコミットする必要はありません。

## カスタムドメイン

デフォルト設定には `routes` セクションがありません。これにより、初回デプロイでは `*.workers.dev` をそのまま使えます。

Cloudflare zone を所有していてカスタムドメインを使いたい場合は、初回デプロイ後に次のような route を追加します。

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

## Cloudflare Dashboard で変数を管理する場合

Cloudflare Dashboard の変数を設定の基準にしたい場合は、`wrangler.jsonc` に `"keep_vars": true` を追加してください。

これにより、Wrangler は Dashboard 側で設定した変数をデプロイ時に上書きしません。
