# How It Works

LitSquare Stage projects are normal web projects with one extra rule: every final frame must be reproducible from the render context.

## The Project Config

`stage.config.json` defines the contract between the project and a compatible render host:

```json
{
  "name": "Example Stage",
  "sourceEntry": "index.html",
  "buildDir": "dist",
  "preview": {
    "fps": 30,
    "width": 1920,
    "height": 1080,
    "durationFrames": 180,
    "loop": true
  },
  "render": {
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "videoOutput": "h264Mp4",
    "videoMode": "deterministic"
  }
}
```

Preview settings describe interactive playback. Render settings describe final output.

## The Frame Context

`FrameContext` is the source of truth for renderable motion:

- `frame`: current frame index.
- `time`: current time in seconds.
- `fps`: frame rate.
- `durationFrames`: total frame count.
- `width` and `height`: active output dimensions.
- `dpr`: device pixel ratio.
- `mode`: preview or render mode.

Use this context to derive transforms, opacity, camera position, canvas state, shader uniforms, SVG interpolation, and layout.

## The Runner Lifecycle

A sketch can implement:

- `setup(ctx, root)`: create DOM, canvases, renderers, audio, and reusable resources.
- `prepareExport(ctx, root)`: wait for fonts, images, models, data snapshots, and GPU readiness.
- `renderFrame(ctx, root)`: update the scene for exactly one frame.
- `finishExport(ctx, root)`: finish export-specific work.
- `teardown(ctx, root)`: dispose renderers, textures, timers, audio graphs, and temporary resources.

`renderFrame` should be fast, deterministic, and free of live data fetching.

## Browser Preview

The browser host plays frames with `requestAnimationFrame` for quick iteration. It is useful for design and timing, but it is still expected to call the same `renderFrame` logic that final export uses.

## Render Host

The render host loads the built project, sends frame contexts into the page, waits for each frame to finish, captures pixels, and writes artifacts. That separation lets the same stage project preview in a browser and render through any host that implements the public bridge/protocol.

## Determinism Rules

- Derive visible state from `FrameContext`.
- Seed randomness before rendering.
- Load local assets before export.
- Use data snapshots instead of live API calls during `renderFrame`.
- Avoid CSS or JS wall-clock animation as the source of final motion.
