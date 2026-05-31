import { describe, expect, it } from "vitest";
import { createRunner, resolveFrameTiming } from "../src/index.js";

describe("resolveFrameTiming", () => {
  it("normalizes timing values", () => {
    expect(resolveFrameTiming({ fps: 29.7, durationFrames: 90 })).toEqual({
      fps: 30,
      durationFrames: 90,
      durationSeconds: 3,
      maximumFrameIndex: 89
    });
  });
});

describe("createRunner", () => {
  it("serializes frame work and tears down after setup", async () => {
    const events: string[] = [];
    const runner = createRunner({
      root: {} as HTMLElement,
      sketch: {
        setup() {
          events.push("setup");
        },
        renderFrame(ctx) {
          events.push(`frame:${ctx.frame}`);
        },
        teardown(ctx) {
          events.push(`teardown:${ctx.frame}`);
        }
      }
    });

    await Promise.all([
      runner.setFrameContext({ frame: 1, time: 1 / 30 }),
      runner.setFrameContext({ frame: 2, time: 2 / 30 })
    ]);
    await runner.destroy();

    expect(events).toEqual(["setup", "frame:1", "frame:2", "teardown:2"]);
  });
});

