import { afterEach, describe, expect, it } from "vitest";
import {
  attachRenderHost,
  createRunner,
  LITSTAGE_BRIDGE_VERSION,
  LITSTAGE_HOST_TO_RUNTIME_EVENT,
  LITSTAGE_RUNTIME_TO_HOST_EVENT,
  type HostCommand,
  type RuntimeEvent
} from "../src/index.js";

class TestWindow extends EventTarget {
  location = {
    reload() {}
  };
}

const originalWindow = globalThis.window;
const OriginalCustomEvent = globalThis.CustomEvent;

afterEach(() => {
  Object.defineProperty(globalThis, "window", {
    value: originalWindow,
    configurable: true
  });
  Object.defineProperty(globalThis, "CustomEvent", {
    value: OriginalCustomEvent,
    configurable: true
  });
});

describe("attachRenderHost", () => {
  it("emits runtimeReady and responds to renderFrame", async () => {
    installCustomEventPolyfill();
    const testWindow = new TestWindow();
    Object.defineProperty(globalThis, "window", {
      value: testWindow,
      configurable: true
    });

    const events: RuntimeEvent[] = [];
    testWindow.addEventListener(LITSTAGE_RUNTIME_TO_HOST_EVENT, (event) => {
      events.push((event as CustomEvent<RuntimeEvent>).detail);
    });

    const runner = createRunner({
      root: {} as HTMLElement,
      sketch: {
        renderFrame(ctx) {
          expect(ctx.width).toBe(640);
        }
      },
      initialContext: {
        fps: 30,
        durationFrames: 60
      }
    });

    const handle = attachRenderHost(runner);
    const command: HostCommand = {
      version: LITSTAGE_BRIDGE_VERSION,
      type: "renderFrame",
      payload: {
        context: {
          frame: 12,
          time: 0.4,
          fps: 30,
          durationFrames: 60,
          width: 640,
          height: 360,
          dpr: 1,
          mode: "render"
        }
      }
    };

    testWindow.dispatchEvent(new CustomEvent(LITSTAGE_HOST_TO_RUNTIME_EVENT, { detail: command }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(events.map((event) => event.type)).toEqual([
      "runtimeReady",
      "logMessage",
      "frameRendered"
    ]);
    expect(events.at(-1)).toMatchObject({
      type: "frameRendered",
      payload: { frame: 12, time: 0.4 }
    });

    handle.destroy();
    await runner.destroy();
  });
});

function installCustomEventPolyfill() {
  if (typeof CustomEvent !== "undefined") {
    return;
  }

  class TestCustomEvent<T> extends Event {
    readonly detail: T;

    constructor(type: string, init: CustomEventInit<T>) {
      super(type);
      this.detail = init.detail as T;
    }
  }

  Object.defineProperty(globalThis, "CustomEvent", {
    value: TestCustomEvent,
    configurable: true
  });
}

