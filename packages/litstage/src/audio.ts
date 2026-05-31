import type { AudioRenderContext, FrameContext, LitStageAudioModule } from "./types.js";

export interface AudioControllerOptions {
  audio?: LitStageAudioModule;
}

export interface AudioController {
  preload(ctx: FrameContext): Promise<void>;
  play(ctx: FrameContext): Promise<void>;
  pause(ctx: FrameContext): Promise<void>;
  seek(ctx: FrameContext): Promise<void>;
  setFrameContext(ctx: FrameContext): Promise<void>;
  renderOfflineAudio(ctx: AudioRenderContext): Promise<AudioBuffer | null>;
  destroy(): Promise<void>;
}

export function createAudioController({ audio }: AudioControllerOptions): AudioController | null {
  if (!audio) {
    return null;
  }

  let destroyed = false;

  const assertActive = () => {
    if (destroyed) {
      throw new Error("Audio controller has already been destroyed");
    }
  };

  return {
    async preload(ctx) {
      assertActive();
      await audio.preload?.(ctx);
    },
    async play(ctx) {
      assertActive();
      await audio.play?.(ctx);
    },
    async pause(ctx) {
      assertActive();
      await audio.pause?.(ctx);
    },
    async seek(ctx) {
      assertActive();
      await audio.seek?.(ctx);
    },
    async setFrameContext(ctx) {
      assertActive();
      await audio.setFrameContext?.(ctx);
    },
    async renderOfflineAudio(ctx) {
      assertActive();
      return (await audio.renderOfflineAudio?.(ctx)) ?? null;
    },
    async destroy() {
      if (destroyed) {
        return;
      }
      destroyed = true;
      await audio.destroy?.();
    }
  };
}

