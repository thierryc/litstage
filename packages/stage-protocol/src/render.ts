import type { LitSquareStageProjectConfig, PreviewFormatDescriptor, RenderSettings, RenderVideoMode, RenderVideoOutput } from "./config.js";

export type PlaybackMode = "live" | "render";

export interface FrameContext {
  frame: number;
  time: number;
  fps: number;
  durationFrames: number;
  width: number;
  height: number;
  dpr: number;
  mode: PlaybackMode;
}

export type RenderArtifactKind = "png" | "pngSequence" | "h264Mp4" | "h264Mov" | "hevcAlphaMov" | "json";

export interface RenderArtifact {
  kind: RenderArtifactKind;
  path: string;
  width?: number;
  height?: number;
  frame?: number;
  startFrame?: number;
  endFrame?: number;
  sizeBytes?: number;
  sha256?: string;
}

export interface RenderProjectManifest {
  projectRoot: string;
  config: LitSquareStageProjectConfig;
  loadedAt: string;
}

export interface RenderRequestBase {
  projectRoot?: string;
  outputPath: string;
  overwrite?: boolean;
  render?: Partial<RenderSettings>;
}

export interface CaptureFrameRequest extends RenderRequestBase {
  frame: number;
}

export interface RenderSequenceRequest extends RenderRequestBase {
  startFrame: number;
  endFrame: number;
}

export interface RenderVideoRequest extends RenderSequenceRequest {
  videoMode?: RenderVideoMode;
  videoOutput?: RenderVideoOutput;
}

export type RenderJobStatus = "idle" | "queued" | "running" | "completed" | "failed" | "cancelled";
export type RenderJobKind = "frame" | "sequence" | "video";

export interface RenderJobState {
  status: RenderJobStatus;
  jobID?: string;
  kind?: RenderJobKind;
  projectRoot: string;
  outputPath?: string;
  startFrame?: number;
  endFrame?: number;
  currentFrame?: number;
  completedFrames?: number;
  totalFrames?: number;
  format?: PreviewFormatDescriptor;
  fps?: number;
  videoMode?: RenderVideoMode;
  startedAt?: string;
  finishedAt?: string;
  elapsedSeconds?: number;
  estimatedRemainingSeconds?: number;
  estimatedTotalSeconds?: number;
  secondsPerFrame?: number;
  nextRecommendedStatusCheckSeconds?: number;
  timingLabel?: string;
  errorMessage?: string;
  updatedAt: string;
}

export interface RenderQueueState {
  queued: RenderJobState[];
  active?: RenderJobState;
  recent: RenderJobState[];
  updatedAt: string;
}

export interface RenderResult {
  job: RenderJobState;
  artifacts: RenderArtifact[];
}

export interface ServerState {
  name: string;
  version: string;
  endpoint: string;
  projectRoot?: string;
  runtimeReady: boolean;
  updatedAt: string;
}

export interface DiagnosticItem {
  level: "info" | "warning" | "error";
  code: string;
  message: string;
  source: string;
  file?: string;
  range?: string;
}
