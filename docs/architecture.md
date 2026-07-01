# LitSquare Stage Architecture

LitSquare Stage is split into public runtime packages and compatible render hosts.

The public runtime owns deterministic frame timing, runner lifecycle, browser playback, React bindings, render-host bridge events, and shared protocol types. It must stay usable in any browser project without a bundled renderer, server, native shell, or hosted capture service.

Compatible hosts consume the public packages and decide how to load projects, isolate execution, capture pixels, encode media, manage queues, expose progress, and authenticate access.

## Public Packages

- `@litsquare/stage`: runner, lifecycle, browser preview host, render-host bridge, timing, and audio helpers.
- `@litsquare/stage-react`: React provider and hooks around the runner.
- `@litsquare/stage-protocol`: serializable config, render request, job state, artifact, diagnostic, and MCP contract types.

## Boundary

The shared protocol is intentionally render-focused. Source editing, project scaffolding wizards, comments, inspectors, asset hosting, capture engines, and deployment infrastructure are outside the public runtime contract.
