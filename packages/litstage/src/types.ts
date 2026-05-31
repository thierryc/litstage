export type Awaitable<T> = T | Promise<T>;

export type PlaybackMode = "live" | "render";

export interface SelectionReference {
  nodeId?: string;
  file?: string;
  range?: string;
}

export interface FrameContext {
  frame: number;
  time: number;
  fps: number;
  durationFrames: number;
  width: number;
  height: number;
  dpr: number;
  mode: PlaybackMode;
  selection?: SelectionReference;
}

export interface AudioRenderContext extends FrameContext {
  requestID: string;
  startFrame: number;
  startTime: number;
  durationSeconds: number;
  sampleRate: number;
  channels: number;
}

export interface LitStageAudioModule {
  preload?: (ctx: FrameContext) => Awaitable<void>;
  play?: (ctx: FrameContext) => Awaitable<void>;
  pause?: (ctx: FrameContext) => Awaitable<void>;
  seek?: (ctx: FrameContext) => Awaitable<void>;
  setFrameContext?: (ctx: FrameContext) => Awaitable<void>;
  renderOfflineAudio?: (ctx: AudioRenderContext) => Awaitable<AudioBuffer | null>;
  destroy?: () => Awaitable<void>;
}

export interface LitStageSketch {
  setup?: (ctx: FrameContext, root: HTMLElement) => Awaitable<void>;
  renderFrame: (ctx: FrameContext, root: HTMLElement) => Awaitable<void>;
  teardown?: (ctx: FrameContext, root: HTMLElement) => Awaitable<void>;
}

