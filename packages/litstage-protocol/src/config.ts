export type PreviewFormatKind = "preset" | "custom";
export type PreviewFormatGroup = "landscape" | "portrait" | "square" | "device";

export interface PreviewFormatDescriptor {
  id: string;
  label: string;
  kind: PreviewFormatKind;
  group: PreviewFormatGroup;
  width: number;
  height: number;
  aspectRatioLabel: string;
}

export interface PreviewSettings {
  fps: number;
  width: number;
  height: number;
  durationFrames: number;
  loop: boolean;
  format?: PreviewFormatDescriptor;
}

export type RenderVideoOutput = "h264Mp4" | "h264Mov" | "hevcAlphaMov";
export type RenderVideoMode = "deterministic" | "fastRealtime";

export interface RenderMotionBlurSettings {
  enabled: boolean;
  shutterAngle: number;
  sampleCount: number;
}

export interface RenderSettings {
  width: number;
  height: number;
  fps?: number;
  audioEnabled?: boolean;
  videoOutput?: RenderVideoOutput;
  videoMode?: RenderVideoMode;
  motionBlur?: RenderMotionBlurSettings;
  snapshotWaitMs?: number;
  maxWorkerCount?: number;
}

export interface LitStageProjectConfig {
  name: string;
  sourceEntry: string;
  buildDir: string;
  timeline?: string;
  preview: PreviewSettings;
  render?: RenderSettings;
}

export function parseLitStageConfig(input: unknown): LitStageProjectConfig {
  if (!isRecord(input)) {
    throw new Error("litstage.config.json must be a JSON object.");
  }

  const name = requireString(input, "name");
  const sourceEntry = requireString(input, "sourceEntry");
  const buildDir = requireString(input, "buildDir");
  const preview = parsePreviewSettings(input.preview);
  const render = input.render === undefined ? undefined : parseRenderSettings(input.render);
  const timeline = input.timeline === undefined ? undefined : requireString(input, "timeline");

  return {
    name,
    sourceEntry,
    buildDir,
    ...(timeline === undefined ? {} : { timeline }),
    preview,
    ...(render === undefined ? {} : { render })
  };
}

function parsePreviewSettings(input: unknown): PreviewSettings {
  if (!isRecord(input)) {
    throw new Error("preview must be a JSON object.");
  }

  return {
    fps: requirePositiveInteger(input, "fps"),
    width: requirePositiveInteger(input, "width"),
    height: requirePositiveInteger(input, "height"),
    durationFrames: requirePositiveInteger(input, "durationFrames"),
    loop: requireBoolean(input, "loop")
  };
}

function parseRenderSettings(input: unknown): RenderSettings {
  if (!isRecord(input)) {
    throw new Error("render must be a JSON object.");
  }

  return {
    width: requirePositiveInteger(input, "width"),
    height: requirePositiveInteger(input, "height"),
    ...(input.fps === undefined ? {} : { fps: requirePositiveInteger(input, "fps") }),
    ...(input.audioEnabled === undefined ? {} : { audioEnabled: requireBoolean(input, "audioEnabled") }),
    ...(input.videoOutput === undefined ? {} : { videoOutput: requireEnum(input, "videoOutput", ["h264Mp4", "h264Mov", "hevcAlphaMov"]) }),
    ...(input.videoMode === undefined ? {} : { videoMode: requireEnum(input, "videoMode", ["deterministic", "fastRealtime"]) }),
    ...(input.snapshotWaitMs === undefined ? {} : { snapshotWaitMs: requireNonNegativeInteger(input, "snapshotWaitMs") }),
    ...(input.maxWorkerCount === undefined ? {} : { maxWorkerCount: requirePositiveInteger(input, "maxWorkerCount") })
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${key} must be a non-empty string.`);
  }
  return value;
}

function requireBoolean(record: Record<string, unknown>, key: string): boolean {
  const value = record[key];
  if (typeof value !== "boolean") {
    throw new Error(`${key} must be a boolean.`);
  }
  return value;
}

function requirePositiveInteger(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new Error(`${key} must be a positive integer.`);
  }
  return value;
}

function requireNonNegativeInteger(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw new Error(`${key} must be a non-negative integer.`);
  }
  return value;
}

function requireEnum<const Values extends readonly string[]>(
  record: Record<string, unknown>,
  key: string,
  values: Values
): Values[number] {
  const value = record[key];
  if (typeof value !== "string" || !values.includes(value)) {
    throw new Error(`${key} must be one of ${values.join(", ")}.`);
  }
  return value;
}

