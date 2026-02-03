# gravatar-worker

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
