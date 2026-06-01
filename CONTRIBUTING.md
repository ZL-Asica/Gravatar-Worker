# Contributing

## Local setup

Use the Node.js version pinned in `.node-version` and the pnpm version pinned in `package.json`:

```bash
corepack enable
pnpm install --frozen-lockfile
```

The pre-commit hook runs `nano-staged` through pnpm. If you bypass hooks for an emergency fix, run the relevant checks manually before pushing.

## CI

Pull requests and pushes to `main` run the CI workflow. CI installs dependencies with pnpm, then runs:

```bash
pnpm run lint
pnpm run build
```

Run the same checks locally before opening a pull request.

## Releases

Releases use two workflows:

- **Prepare Release PR**: manually bumps `package.json`, refreshes `pnpm-lock.yaml`, runs lint/build, generates release notes, and opens a `release/vX.Y.Z` pull request.
- **Create GitHub Release**: runs after a release PR is merged into `main`, verifies the version, reruns lint/build, validates or creates the `vX.Y.Z` tag, and publishes the GitHub Release. It also supports existing `vX.Y.Z` tag pushes and manual backfills through `workflow_dispatch`.

If branch protection requires CI to run on the generated release PR itself, configure a `RELEASE_PR_TOKEN` repository secret with permission to create pull requests and trigger workflows. Without that secret, the prepare workflow still runs lint/build before opening the release PR, but GitHub may suppress PR-triggered workflows created with the default `GITHUB_TOKEN`.

The release workflow does not publish to npm. Deploy this Worker through Cloudflare using:

```bash
pnpm run deploy
```
