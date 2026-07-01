# @litsquare/stage-react

React bindings for `@litsquare/stage`.

## Install

```bash
pnpm add @litsquare/stage @litsquare/stage-react react
```

React is a peer dependency. This package supports React `>=18 <20`.

## Usage

Wrap the part of your app that owns the stage root with `LitSquareStageProvider`, then use the hooks to read or drive the current frame context.

```tsx
import { useRef } from "react";
import type { LitSquareStageSketch } from "@litsquare/stage";
import {
  LitSquareStageProvider,
  useLitSquareStage,
  useLitSquareStageFrame
} from "@litsquare/stage-react";

const sketch: LitSquareStageSketch = {
  async renderFrame(ctx, root) {
    root.style.setProperty("--progress", String(ctx.frame / ctx.durationFrames));
  }
};

function Controls() {
  const { setFrameContext } = useLitSquareStage();
  const frame = useLitSquareStageFrame();

  return (
    <button onClick={() => setFrameContext({ frame: 30, time: 1 })}>
      Frame {frame?.frame ?? 0}
    </button>
  );
}

export function StageView() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  return (
    <LitSquareStageProvider
      rootRef={rootRef}
      sketch={sketch}
      initialContext={{ fps: 30, width: 1920, height: 1080, durationFrames: 180 }}
    >
      <div ref={rootRef} id="stage" />
      <Controls />
    </LitSquareStageProvider>
  );
}
```

## API

- `LitSquareStageProvider`: creates and owns a runner for a DOM root and sketch.
- `useLitSquareStage()`: returns `{ runner, frameContext, setFrameContext }`.
- `useLitSquareStageFrame()`: returns the current `FrameContext | null`.

The React package does not install a browser playback loop by itself. Use the lower-level `@litsquare/stage` host helpers when you need autoplay preview or render-host bridge behavior.
