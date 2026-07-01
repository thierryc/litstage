import { afterEach, describe, expect, it } from "vitest";
import {
  attachRenderHost,
  createRunner,
  STAGE_BRIDGE_VERSION,
  STAGE_HOST_TO_RUNTIME_EVENT,
  STAGE_RUNTIME_TO_HOST_EVENT,
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
const originalBtoa = globalThis.btoa;

afterEach(() => {
  Object.defineProperty(globalThis, "window", {
    value: originalWindow,
    configurable: true
  });
  Object.defineProperty(globalThis, "CustomEvent", {
    value: OriginalCustomEvent,
    configurable: true
  });
  Object.defineProperty(globalThis, "btoa", {
    value: originalBtoa,
    configurable: true
  });
});

describe("attachRenderHost", () => {
  it("emits runtimeReady, prepares export, and responds to renderFrame", async () => {
    installCustomEventPolyfill();
    const testWindow = new TestWindow();
    Object.defineProperty(globalThis, "window", {
      value: testWindow,
      configurable: true
    });

    const events: RuntimeEvent[] = [];
    testWindow.addEventListener(STAGE_RUNTIME_TO_HOST_EVENT, (event) => {
      events.push((event as CustomEvent<RuntimeEvent>).detail);
    });

    let exportPrepared = false;
    const runner = createRunner({
      root: {} as HTMLElement,
      sketch: {
        prepareExport() {
          exportPrepared = true;
        },
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
    const prepareCommand: HostCommand = {
      version: STAGE_BRIDGE_VERSION,
      type: "prepareExport",
      payload: {}
    };
    const renderCommand: HostCommand = {
      version: STAGE_BRIDGE_VERSION,
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

    testWindow.dispatchEvent(new CustomEvent(STAGE_HOST_TO_RUNTIME_EVENT, { detail: prepareCommand }));
    await new Promise((resolve) => setTimeout(resolve, 0));
    testWindow.dispatchEvent(new CustomEvent(STAGE_HOST_TO_RUNTIME_EVENT, { detail: renderCommand }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(exportPrepared).toBe(true);
    expect(events.map((event) => event.type)).toEqual([
      "runtimeReady",
      "logMessage",
      "exportPrepared",
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

  it("streams offline audio chunks through the render host bridge", async () => {
    installCustomEventPolyfill();
    installBtoaPolyfill();
    const testWindow = new TestWindow();
    Object.defineProperty(globalThis, "window", {
      value: testWindow,
      configurable: true
    });

    const events: RuntimeEvent[] = [];
    testWindow.addEventListener(STAGE_RUNTIME_TO_HOST_EVENT, (event) => {
      events.push((event as CustomEvent<RuntimeEvent>).detail);
    });

    const audioBuffer = {
      sampleRate: 48_000,
      numberOfChannels: 2,
      length: 4,
      getChannelData(channel: number) {
        return channel === 0
          ? new Float32Array([0, 0.5, -0.5, 1])
          : new Float32Array([0, -0.25, 0.25, -1]);
      }
    } as unknown as AudioBuffer;

    const runner = createRunner({
      root: {} as HTMLElement,
      sketch: {
        renderFrame() {}
      },
      initialContext: {
        fps: 24,
        durationFrames: 24
      }
    });

    const handle = attachRenderHost(runner, {
      audio: {
        async renderOfflineAudio(ctx) {
          expect(ctx.requestID).toBe("audio-1");
          expect(ctx.durationSeconds).toBe(0.5);
          return audioBuffer;
        }
      }
    });

    const command: HostCommand = {
      version: STAGE_BRIDGE_VERSION,
      type: "renderAudio",
      payload: {
        requestID: "audio-1",
        frame: 0,
        time: 0,
        fps: 24,
        durationFrames: 24,
        width: 640,
        height: 360,
        dpr: 1,
        mode: "render",
        startFrame: 0,
        startTime: 0,
        durationSeconds: 0.5,
        sampleRate: 48_000,
        channels: 2
      }
    };

    testWindow.dispatchEvent(new CustomEvent(STAGE_HOST_TO_RUNTIME_EVENT, { detail: command }));
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(events.map((event) => event.type)).toEqual([
      "runtimeReady",
      "logMessage",
      "audioRenderStarted",
      "audioRenderChunk",
      "audioRenderCompleted"
    ]);
    expect(events.at(-2)).toMatchObject({
      type: "audioRenderChunk",
      payload: {
        requestID: "audio-1",
        byteCount: 16,
        done: true
      }
    });
    expect(events.at(-1)).toMatchObject({
      type: "audioRenderCompleted",
      payload: {
        requestID: "audio-1",
        hasAudio: true,
        totalBytes: 16,
        totalFrames: 4
      }
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

function installBtoaPolyfill() {
  if (typeof btoa !== "undefined") {
    return;
  }

  Object.defineProperty(globalThis, "btoa", {
    value: (input: string) => Buffer.from(input, "binary").toString("base64"),
    configurable: true
  });
}
