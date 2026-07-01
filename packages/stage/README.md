# @litsquare/stage

Host-agnostic frame runner for LitSquare Stage animation projects.

## Install

```bash
pnpm add @litsquare/stage
```

`@litsquare/stage` is the public runtime package. It does not include a renderer, server, native app, or CLI. Use it inside a browser project, then connect the runtime to any compatible render host when you need stills, image sequences, or video.

## Minimal Runner

```ts
import { attachBrowserHost, attachRenderHost, createRunner } from "@litsquare/stage";

const runner = createRunner({
  root: document.getElementById("stage")!,
  sketch: {
    async setup(ctx, root) {
      root.innerHTML = `<div class="title"></div>`;
    },
    async renderFrame(ctx, root) {
      const title = root.querySelector<HTMLElement>(".title");
      if (title) {
        title.textContent = `Frame ${ctx.frame}`;
        title.style.transform = `translateX(${ctx.time * 80}px)`;
      }
    }
  }
});

attachBrowserHost(runner, {
  fps: 30,
  width: 1920,
  height: 1080,
  durationFrames: 180,
  loop: true
});

attachRenderHost(runner);
```

## Runner Lifecycle

Create a sketch with lifecycle hooks:

- `setup(ctx, root)`: create DOM nodes, canvases, renderers, audio, and reusable resources.
- `prepareExport(ctx, root)`: wait for fonts, images, models, data snapshots, and GPU readiness.
- `renderFrame(ctx, root)`: update the visible scene for one frame.
- `finishExport(ctx, root)`: finish export-specific work.
- `teardown(ctx, root)`: dispose renderers, textures, timers, audio graphs, and listeners.

`renderFrame` should be deterministic. Derive visible state from `FrameContext`, not wall-clock timers or live network calls.

## Browser Preview

`attachBrowserHost(runner, options)` drives the runner with `requestAnimationFrame` for local preview. It supports play, pause, seek, looping, dimensions, frame rate, duration, and optional audio hooks.

## Render Host Bridge

`attachRenderHost(runner)` exposes a browser event bridge for compatible render hosts. A host can prepare export, send exact frame contexts, wait for `frameRendered` events, capture pixels, and request offline audio chunks.

The runtime stays browser-native and host-agnostic. Renderers, queues, native capture, remote services, and authentication live outside this package.

## Public Surface

The package exports:

- Runner APIs: `createRunner`, `defaultFrameContext`, `Runner`, `LitSquareStageSketch`.
- Hosts: `attachBrowserHost`, `attachRenderHost`.
- Timing and audio helpers: `resolveFrameTiming`, `createAudioController`.
- Frame, lifecycle, bridge, audio, and selection types.
