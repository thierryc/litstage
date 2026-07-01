# Releasing

This repository publishes only:

- `@litsquare/stage-protocol`
- `@litsquare/stage`
- `@litsquare/stage-react`

The workspace root and examples stay private to npm. Publish the packages manually to npm.org; there is no npm publish GitHub Action in this repository.

## Repository Links

- Public runtime packages: https://github.com/thierryc/litstage
- Private macOS app: https://github.com/thierryc/litstage-macos
- Private Chromium renderer: https://github.com/thierryc/litstage-chromium
- Private Codex plugin: local/unpublished repository until a remote is created

## Local Release Gates

Run these from the repository root:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
pnpm build:examples
```

Then inspect package contents:

```bash
(cd packages/stage-protocol && npm pack --dry-run --json)
(cd packages/stage && npm pack --dry-run --json)
(cd packages/stage-react && npm pack --dry-run --json)
```

Confirm the tarballs contain only `dist`, `README.md`, `LICENSE`, and `package.json`, and confirm `@litsquare/stage-react` rewrites its packed dependency on `@litsquare/stage` to the release version.

## Manual npm.org Publish

The first `0.1.0` release is a manual npm.org publish.

1. Create or confirm access to the `@litsquare` npm scope.
2. Confirm npm login and 2FA readiness:

```bash
npm whoami
```

3. Run all local release gates.
4. Pack release tarballs:

```bash
mkdir -p /tmp/litstage-npm
(cd packages/stage-protocol && pnpm pack --pack-destination /tmp/litstage-npm)
(cd packages/stage && pnpm pack --pack-destination /tmp/litstage-npm)
(cd packages/stage-react && pnpm pack --pack-destination /tmp/litstage-npm)
```

5. Publish in dependency order with npm 2FA:

```bash
npm publish /tmp/litstage-npm/litsquare-stage-protocol-0.1.0.tgz --access public
npm publish /tmp/litstage-npm/litsquare-stage-0.1.0.tgz --access public
npm publish /tmp/litstage-npm/litsquare-stage-react-0.1.0.tgz --access public
```

6. Verify npm visibility:

```bash
npm view @litsquare/stage-protocol@0.1.0 version
npm view @litsquare/stage@0.1.0 version
npm view @litsquare/stage-react@0.1.0 version
```

7. Create a GitHub release for `v0.1.0` after all three npm packages are visible.

## Manual Push Workflow

For release-prep documentation or package metadata changes:

```bash
git status -sb
pnpm check
pnpm test
pnpm build
pnpm build:examples
git add -A
git commit -m "Prepare public npm release"
git push origin main
```

Do not push private app, renderer, signing, deployment, host-adapter, or credential material to this public repository.
