# litStage Public Runtime Contract

- This repository is public and MIT licensed. Do not add private macOS, Chromium server, signing, deployment, or host-adapter code here.
- Public API stability matters. Any exported symbol from `@litsquare/litstage`, `@litsquare/litstage-react`, or `@litsquare/litstage-protocol` must be intentional, documented, and covered by type checks.
- Keep the runner host-agnostic. Browser helpers can use DOM APIs, but the core runner must not depend on MCP, Playwright, WKWebView, Node servers, or private renderers.
- Keep protocol types serializable and versioned. Prefer additive fields over breaking changes.
- TypeScript checks and package builds are required before publishing or pushing API changes.
- Examples should consume the packages through workspace dependencies, not private file paths.

