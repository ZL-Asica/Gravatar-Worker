# gravatar-worker

## [Unreleased](https://github.com/ZL-Asica/Gravatar-Worker/compare/v1.1.0-beta.1...HEAD)

## [1.1.0-beta.1](https://github.com/ZL-Asica/Gravatar-Worker/compare/v1.1.0-beta.0...v1.1.0-beta.1) - 2026-06-01

Automatic prerelease workflow verification.

### 🧰 Internal / 内部变更
- ci: reuse release PR notes on manual publish ([#53](https://github.com/ZL-Asica/Gravatar-Worker/pull/53)) by @ZL-Asica

## [1.1.0-beta.0](https://github.com/ZL-Asica/Gravatar-Worker/compare/v1.0.0...v1.1.0-beta.0) - 2026-06-01

Pre-release workflow smoke test.

### 🐛 Bug Fixes / 修复
- fix(avatar): normalize requests and guard transforms ([#44](https://github.com/ZL-Asica/Gravatar-Worker/pull/44)) by @ZL-Asica
- fix(config): disable raw email lookup by default ([#45](https://github.com/ZL-Asica/Gravatar-Worker/pull/45)) by @ZL-Asica

### 🛠️ Improvements / 改进
- refactor(config): use generated worker bindings ([#47](https://github.com/ZL-Asica/Gravatar-Worker/pull/47)) by @ZL-Asica

### 🧰 Internal / 内部变更
- ci: fix release workflows ([#43](https://github.com/ZL-Asica/Gravatar-Worker/pull/43)) by @ZL-Asica
- chore(github): fix issue template paths ([#46](https://github.com/ZL-Asica/Gravatar-Worker/pull/46)) by @ZL-Asica
- chore: remove commitlint ([#48](https://github.com/ZL-Asica/Gravatar-Worker/pull/48)) by @ZL-Asica
- ci: classify release notes by title ([#50](https://github.com/ZL-Asica/Gravatar-Worker/pull/50)) by @ZL-Asica

- Replace the legacy automatic release workflow with separate release preparation and GitHub Release publishing workflows.
- Add a pull request CI workflow that runs lint and build checks.
- Remove npm publishing from the release workflow; this project releases the Worker source and GitHub release artifacts only.
- Support existing tag releases while validating that release tags point to the expected commit.

## 1.0.0

- Customization improvements
  - Add `CUSTOMIZATION.md` with detailed instructions and a checklist for setting up the user's own instance after forking.
  - Added new environment variables for giving more control over site branding and behavior.
  - Improved documentation for endpoints and query parameters in `README.md`.

## 0.4.0

### Minor Changes

- Refactored with latest Hono and vite-ssr-components
  - Remove wasm files in public.
  - Direclty register wasm in both dev and prod (no need to switch between two modes).
  - Remove zod validation to mimic Gravatar's behavior.

## 0.3.0

### Minor Changes

- Allow invalid hash or email value
  - When the hash or email value is invalid, it used to return 400 error. Now it will try return if there is a custom default value fallback.
  - Update caching strategy.
  - Update README files accordingly.
  - Added `ZH_CN` and `JA` localization for README.
  - Bump up some dependencies.

## 0.2.0

### Minor Changes

- Add image convert and compress ability and `/avatar/me` endpoint
  - Changes
    - Change default browser cache TTL to 3 days if reponse 200.
    - Change email endpoint hash from `md5` to `sha256`.

  - New Features:
    - Use [jSquash](https://github.com/jamsinclair/jSquash) enabled worker side image convert and compress based on client `Accept` header.
    - Add new endpoint `/avatar/me` will return the maintainer's gravatar avatar if the `HASH` is set in the enviroment variable.

## 0.1.1

### Patch Changes

- Fix SHA-256 support

## 0.1.0

### Minor Changes

- Baisc function setup
  - Enable Gravatar image CDN.
  - Enable basic cashing.
  - Support `s`/`size` and `d`/`default` params.
