# Quickstart

This guide gets one LitSquare Stage example running in preview and built for a compatible render host.

## Requirements

- Node.js and pnpm.
- A browser for local preview.

Rendering stills, image sequences, or video requires a host that implements the public LitSquare Stage bridge/protocol. Host installation and operation are intentionally outside this public runtime repository.

## 1. Install Dependencies

From the `litstage` workspace:

```bash
pnpm install
```

## 2. Preview An Example

Start the basic DOM example:

```bash
pnpm --filter @litsquare/stage-example-basic-dom dev
```

Open the Vite URL printed by the command. The browser preview uses the same `FrameContext` model as export, but it plays continuously for iteration.

## 3. Build For Render

```bash
pnpm --filter @litsquare/stage-example-basic-dom build
```

The example writes production files to the configured `buildDir`. A compatible render host should load that build output, not the development server.

## 4. Inspect The Runtime Wiring

The example entrypoint creates a runner, attaches browser preview, and attaches the render-host bridge:

```ts
const runner = createRunner({ root, sketch, initialContext });
attachBrowserHost(runner, previewSettings);
attachRenderHost(runner);
```

That wiring lets browser preview and final frame capture use the same `renderFrame(ctx)` logic.

## 5. Try The React Example

```bash
pnpm --filter @litsquare/stage-example-react dev
pnpm --filter @litsquare/stage-example-react build
```

Use the React example when the stage view is authored through React components and hooks.

## Next

- Read [How It Works](how-it-works.md) to understand the frame model.
- Read [Project Anatomy](project-anatomy.md) before creating a new project.
- Read [Rendering](rendering.md) before final export.
