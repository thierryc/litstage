import type { FrameContext, LitStageSketch } from "./types.js";

export interface CreateRunnerOptions {
  root: HTMLElement;
  sketch: LitStageSketch;
  initialContext?: Partial<FrameContext>;
}

export interface Runner {
  readonly root: HTMLElement;
  getCurrentContext(): FrameContext;
  setFrameContext(nextContext: Partial<FrameContext>): Promise<FrameContext>;
  destroy(): Promise<void>;
}

const devicePixelRatio = () => {
  if (typeof window === "undefined") {
    return 1;
  }
  return window.devicePixelRatio || 1;
};

export function defaultFrameContext(initialContext: Partial<FrameContext> = {}): FrameContext {
  return {
    frame: 0,
    time: 0,
    fps: 30,
    durationFrames: 1,
    width: 1280,
    height: 720,
    dpr: devicePixelRatio(),
    mode: "live",
    ...initialContext
  };
}

export function createRunner({ root, sketch, initialContext }: CreateRunnerOptions): Runner {
  let currentContext = defaultFrameContext(initialContext);
  let setupComplete = false;
  let setupPromise: Promise<void> | null = null;
  let workChain: Promise<void> = Promise.resolve();
  let destroyPromise: Promise<void> | null = null;
  let destroyRequested = false;
  let isDestroyed = false;

  const ensureReady = async () => {
    if (setupComplete) {
      return;
    }

    if (!setupPromise) {
      setupPromise = (async () => {
        await sketch.setup?.(currentContext, root);
        setupComplete = true;
      })();
    }

    await setupPromise;
  };

  const assertActive = () => {
    if (destroyRequested || isDestroyed) {
      throw new Error("Runner has already been destroyed");
    }
  };

  const enqueue = <T>(work: () => Promise<T>): Promise<T> => {
    const result = workChain.then(work);
    workChain = result.then(() => undefined, () => undefined);
    return result;
  };

  return {
    root,
    getCurrentContext() {
      return { ...currentContext };
    },
    setFrameContext(nextContext) {
      try {
        assertActive();
      } catch (error) {
        return Promise.reject(error);
      }

      return enqueue(async () => {
        currentContext = {
          ...currentContext,
          ...nextContext
        };
        await ensureReady();
        await sketch.renderFrame(currentContext, root);
        return { ...currentContext };
      });
    },
    destroy() {
      if (destroyPromise) {
        return destroyPromise;
      }

      destroyRequested = true;
      destroyPromise = enqueue(async () => {
        if (isDestroyed) {
          return;
        }

        if (setupComplete) {
          await sketch.teardown?.(currentContext, root);
        }

        isDestroyed = true;
      });
      return destroyPromise;
    }
  };
}

