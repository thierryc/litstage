# litStage Architecture

litStage is split into public runtime code and private renderer hosts.

The public runtime owns deterministic frame timing, runner lifecycle, browser playback, React bindings, and shared protocol types. It must stay usable in any browser project without a native app or hosted render server.

Private renderers consume the public packages and expose the same MCP tool/resource contract:

- `litstage-macos`: local macOS renderer using WKWebView and native export services
- `litstage-chromium`: remote-capable Chromium renderer using Playwright

The shared protocol is intentionally render-focused. Source editing, project scaffolding wizards, comments, inspectors, and UI-heavy WEFT features are not part of the first litStage renderer contract.

