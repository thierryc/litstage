export const LITSTAGE_MCP_RESOURCES = [
  "litstage://project/manifest",
  "litstage://server/state",
  "litstage://render/job/current",
  "litstage://render/queue",
  "litstage://logs/runtime",
  "litstage://diagnostics/current"
] as const;

export type LitStageMCPResourceURI = (typeof LITSTAGE_MCP_RESOURCES)[number];

export const LITSTAGE_MCP_TOOLS = [
  "load_project",
  "build_project",
  "get_project_status",
  "set_render_config",
  "capture_frame",
  "render_sequence",
  "render_video",
  "list_render_jobs",
  "wait_for_render_job",
  "cancel_render_job"
] as const;

export type LitStageMCPToolName = (typeof LITSTAGE_MCP_TOOLS)[number];

export interface LoadProjectRequest {
  projectRoot: string;
}

export interface BuildProjectRequest {
  projectRoot?: string;
}

export interface SetRenderConfigRequest {
  projectRoot?: string;
  width?: number;
  height?: number;
  fps?: number;
  audioEnabled?: boolean;
  videoOutput?: "h264Mp4" | "h264Mov" | "hevcAlphaMov";
  videoMode?: "deterministic" | "fastRealtime";
  snapshotWaitMs?: number;
  maxWorkerCount?: number;
}

export interface WaitForRenderJobRequest {
  jobID?: string;
  timeoutMs?: number;
}

export interface CancelRenderJobRequest {
  jobID?: string;
}

export interface MCPCommandResponse<T = unknown> {
  ok: boolean;
  data: T;
}

