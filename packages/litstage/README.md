# @litsquare/litstage

Host-agnostic frame runner for litStage animation projects.

```ts
import { createRunner } from "@litsquare/litstage";

const runner = createRunner({
  root: document.getElementById("stage")!,
  sketch: {
    async renderFrame(ctx, root) {
      root.textContent = `Frame ${ctx.frame}`;
    }
  }
});

await runner.setFrameContext({ frame: 12, time: 0.4, fps: 30 });
```

