# Common Mistakes

These issues produce most broken previews and renders.

## Fetching Live Data In `renderFrame`

`renderFrame` must be repeatable. Fetch data before rendering, validate it, store it under `data/`, and render from that local snapshot.

## Using Unseeded Randomness

`Math.random()` creates different output between renders. Use a seeded generator for particles, layouts, texture noise, or randomized timing.

## Relying On Wall-Clock Animation

CSS animations, timers, and requestAnimationFrame loops are fine for prototypes, but final export needs state derived from `FrameContext`. Convert final motion to frame-based values in `renderFrame`.

## Loading Assets Too Late

Fonts, images, models, video, audio, textures, and data snapshots should be ready before export frames start. Use `prepareExport` for render-critical readiness.

## Hard-Coding One Format

Avoid fixed positions that only work at 1920x1080. Derive layout from `ctx.width`, `ctx.height`, safe margins, and aspect ratio when a project may render in multiple formats.

## Rendering Odd H.264 Dimensions

H.264 output requires even width and height. Keep final render dimensions even, especially for custom social or LED-wall sizes.

## Doing Heavy Setup Per Frame

Create DOM nodes, canvases, renderers, textures, geometry, and reusable objects in `setup`. `renderFrame` should update existing objects.

## Skipping Cleanup

Dispose GPU renderers, textures, timers, audio graphs, and event listeners in `teardown`. This matters for repeated preview sessions and render workers.

## Rendering Full Video Before Stills

Always render stills first. A single bad frame is cheaper to diagnose than a failed final export.
