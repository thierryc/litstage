# Releasing

This repository publishes only:

- `@litsquare/stage-protocol`
- `@litsquare/stage`
- `@litsquare/stage-react`

The workspace root and examples stay private to npm.

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

## First Publish Bootstrap

The first `0.1.0` publish may need to be done manually because npm trusted publishing is configured from each package's npm settings after the package exists.

1. Create or confirm access to the `@litsquare` npm scope.
2. Run all local release gates.
3. Pack release tarballs:

```bash
mkdir -p /tmp/litstage-npm
(cd packages/stage-protocol && pnpm pack --pack-destination /tmp/litstage-npm)
(cd packages/stage && pnpm pack --pack-destination /tmp/litstage-npm)
(cd packages/stage-react && pnpm pack --pack-destination /tmp/litstage-npm)
```

4. Publish in dependency order with npm 2FA:

```bash
npm publish /tmp/litstage-npm/litsquare-stage-protocol-0.1.0.tgz --access public
npm publish /tmp/litstage-npm/litsquare-stage-0.1.0.tgz --access public
npm publish /tmp/litstage-npm/litsquare-stage-react-0.1.0.tgz --access public
```

5. Verify:

```bash
npm view @litsquare/stage-protocol@0.1.0 version
npm view @litsquare/stage@0.1.0 version
npm view @litsquare/stage-react@0.1.0 version
```

## Trusted Publishing

After the packages exist on npm, configure trusted publishing for each package:

- Publisher: GitHub Actions.
- Owner: `thierryc`.
- Repository: `litstage`.
- Workflow filename: `publish-npm.yml`.
- Allowed action: `npm publish`.

Then restrict traditional package publishing access to require 2FA and disallow long-lived publish tokens.

## Automated Release

Create a GitHub tag such as `v0.1.0` after local gates pass and npm trusted publishing is configured. The publish workflow:

- Installs dependencies with pnpm.
- Runs check, test, build, and example build gates.
- Packs all three packages.
- Publishes in dependency order.
- Skips a package if the exact version already exists.

Create the GitHub release only after npm visibility is verified.
