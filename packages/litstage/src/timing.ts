import type { FrameContext } from "./types.js";

export interface ResolvedFrameTiming {
  fps: number;
  durationFrames: number;
  durationSeconds: number;
  maximumFrameIndex: number;
}

export interface ResolveFrameTimingOptions {
  fps?: number;
  durationFrames?: number;
}

export function resolveFrameTiming(
  context: Partial<FrameContext>,
  options: ResolveFrameTimingOptions = {}
): ResolvedFrameTiming {
  const fps = positiveInteger(options.fps ?? context.fps, 30);
  const durationFrames = positiveInteger(options.durationFrames ?? context.durationFrames, 1);

  return {
    fps,
    durationFrames,
    durationSeconds: durationFrames / fps,
    maximumFrameIndex: Math.max(0, durationFrames - 1)
  };
}

function positiveInteger(value: unknown, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(1, Math.round(value));
}

