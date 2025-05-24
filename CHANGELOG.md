# gravatar-worker

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
