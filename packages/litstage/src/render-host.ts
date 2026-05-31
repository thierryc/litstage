import type { Runner } from "./runner.js";
import type { FrameContext } from "./types.js";

export const LITSTAGE_BRIDGE_VERSION = 1 as const;
export const LITSTAGE_HOST_TO_RUNTIME_EVENT = "litstage:host-to-runtime";
export const LITSTAGE_RUNTIME_TO_HOST_EVENT = "litstage:runtime-to-host";

export type RuntimeSupportedCommand =
  | "setFrameContext"
  | "prepareExport"
  | "renderFrame"
  | "reloadProject";

export interface BridgeEnvelope<Type extends string, Payload> {
  version: typeof LITSTAGE_BRIDGE_VERSION;
  type: Type;
  payload: Payload;
}

export interface RuntimeReadyPayload {
  supportedCommands?: RuntimeSupportedCommand[];
}

export interface LogMessagePayload {
  level: "debug" | "info" | "warning" | "error";
  message: string;
}

export interface FrameRenderedPayload {
  frame: number;
  time: number;
}

export interface RenderFramePayload {
  context: FrameContext;
}

export interface ReloadProjectPayload {
  projectName?: string;
}

export interface EmptyPayload {}

export type RuntimeEvent =
  | BridgeEnvelope<"runtimeReady", RuntimeReadyPayload>
  | BridgeEnvelope<"logMessage", LogMessagePayload>
  | BridgeEnvelope<"frameRendered", FrameRenderedPayload>;

export type HostCommand =
  | BridgeEnvelope<"setFrameContext", FrameContext>
  | BridgeEnvelope<"prepareExport", EmptyPayload>
  | BridgeEnvelope<"renderFrame", RenderFramePayload>
  | BridgeEnvelope<"reloadProject", ReloadProjectPayload>;

export interface RenderHostOptions {
  onReload?: () => void;
}

export interface RenderHostHandle {
  destroy(): void;
  emitLog(message: string, level?: LogMessagePayload["level"]): void;
}

const supportedCommands: RuntimeSupportedCommand[] = [
  "setFrameContext",
  "prepareExport",
  "renderFrame",
  "reloadProject"
];

export function attachRenderHost(runner: Runner, options: RenderHostOptions = {}): RenderHostHandle {
  const target = resolveWindow();
  let destroyed = false;

  const emit = (event: RuntimeEvent) => {
    if (destroyed) {
      return;
    }
    target.dispatchEvent(new CustomEvent(LITSTAGE_RUNTIME_TO_HOST_EVENT, { detail: event }));
  };

  const emitLog = (message: string, level: LogMessagePayload["level"] = "info") => {
    emit({
      version: LITSTAGE_BRIDGE_VERSION,
      type: "logMessage",
      payload: { level, message }
    });
  };

  const emitFrameRendered = (context: FrameContext) => {
    emit({
      version: LITSTAGE_BRIDGE_VERSION,
      type: "frameRendered",
      payload: { frame: context.frame, time: context.time }
    });
  };

  const renderContext = async (context: Partial<FrameContext>) => {
    const nextContext = await runner.setFrameContext(context);
    emitFrameRendered(nextContext);
  };

  const handleCommand = (command: unknown) => {
    if (!isHostCommand(command) || destroyed || command.version !== LITSTAGE_BRIDGE_VERSION) {
      return;
    }

    void (async () => {
      try {
        switch (command.type) {
          case "setFrameContext":
            await renderContext(command.payload);
            break;
          case "prepareExport":
            emitLog("Runtime prepared for export.", "debug");
            break;
          case "renderFrame":
            await renderContext(command.payload.context);
            break;
          case "reloadProject":
            await runner.destroy();
            if (options.onReload) {
              options.onReload();
            } else {
              target.location.reload();
            }
            break;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        emitLog(`Failed to handle host command: ${message}`, "error");
      }
    })();
  };

  const eventHandler = (event: Event) => {
    handleCommand((event as CustomEvent<HostCommand>).detail);
  };

  target.addEventListener(LITSTAGE_HOST_TO_RUNTIME_EVENT, eventHandler);

  emit({
    version: LITSTAGE_BRIDGE_VERSION,
    type: "runtimeReady",
    payload: { supportedCommands }
  });
  emitLog("litStage render host attached.", "debug");

  return {
    destroy() {
      if (destroyed) {
        return;
      }
      destroyed = true;
      target.removeEventListener(LITSTAGE_HOST_TO_RUNTIME_EVENT, eventHandler);
    },
    emitLog
  };
}

function resolveWindow(): Window {
  if (typeof window === "undefined") {
    throw new Error("attachRenderHost requires a browser Window.");
  }
  return window;
}

function isHostCommand(command: unknown): command is HostCommand {
  if (!command || typeof command !== "object") {
    return false;
  }
  const candidate = command as Partial<HostCommand>;
  return (
    typeof candidate.version === "number" &&
    typeof candidate.type === "string" &&
    "payload" in candidate
  );
}
