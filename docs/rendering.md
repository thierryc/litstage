# Rendering

Rendering turns a built LitSquare Stage project into stills, image sequences, or video artifacts. The public packages define the runtime bridge and protocol; actual capture, encoding, queues, storage, and deployment belong to a compatible render host.

## Preflight

Before rendering:

1. Build the project with `pnpm build`.
2. Confirm `stage.config.json` points at the build directory.
3. Confirm local assets and data snapshots are present.
4. Confirm the project calls `attachRenderHost(runner)`.
5. Capture one still before a full video.

## Runtime Bridge

`@litsquare/stage` exposes a browser event bridge through `attachRenderHost`. A compatible host can:

- Ask the runtime to prepare export.
- Send exact `FrameContext` payloads.
- Wait until `renderFrame` completes for each frame.
- Receive runtime logs and audio-render chunks.
- Capture pixels and write artifacts outside the web project.

Host command syntax is host-specific. The stable boundary is the exported bridge constants and TypeScript types.

## Output Settings

Configure output in `stage.config.json`:

- `render.width` and `render.height`: final pixel dimensions.
- `render.fps`: final frame rate.
- `render.videoOutput`: host-supported output format, such as `h264Mp4`.
- `render.videoMode`: deterministic final render mode.
- `render.motionBlur`: shutter and sample settings.
- `render.maxWorkerCount`: host worker parallelism limit.

H.264 outputs require even pixel dimensions.

## Motion Blur

Motion blur samples multiple nearby frame contexts and composites them into one output frame. Use it for premium camera moves, product motion, typography sweeps, and cinema-style renders.

Recommended defaults:

```json
{
  "motionBlur": {
    "enabled": true,
    "shutterAngle": 180,
    "sampleCount": 8
  }
}
```

Use fewer samples for draft renders. Use more samples only after stills and short ranges look correct.

## Progress And Artifacts

A render host should report current frame, completed frames, logs, diagnostics, and final artifact paths. A failed render should leave enough information to answer:

- Did the project build?
- Did the page load?
- Did export readiness complete?
- Which frame failed?
- Which asset or runtime error appeared in logs?

## Recommended Render Workflow

1. Preview in browser.
2. Build.
3. Capture frame 0.
4. Capture one midpoint frame.
5. Render a short range around the most complex motion.
6. Render final video.
7. Review the output and logs before delivery.
