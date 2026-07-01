# @litsquare/stage-protocol

Shared serializable types for LitSquare Stage projects and render servers.

## Install

```bash
pnpm add @litsquare/stage-protocol
```

This package contains the public TypeScript contract shared by LitSquare Stage projects and compatible render hosts. It has no runtime dependency on a renderer, server, native app, browser automation library, or React.

## Project Config

Use `parseLitSquareStageConfig` to validate `stage.config.json` payloads before a host loads a built project.

```ts
import { parseLitSquareStageConfig } from "@litsquare/stage-protocol";

const config = parseLitSquareStageConfig({
  name: "Launch Card",
  sourceEntry: "index.html",
  buildDir: "dist",
  preview: {
    fps: 30,
    width: 1920,
    height: 1080,
    durationFrames: 180,
    loop: true
  },
  render: {
    width: 1920,
    height: 1080,
    fps: 30,
    videoOutput: "h264Mp4",
    videoMode: "deterministic"
  }
});
```

## Render Types

The render model is expressed as serializable request, state, queue, artifact, and diagnostic types:

- `CaptureFrameRequest`, `RenderSequenceRequest`, `RenderVideoRequest`.
- `RenderJobState`, `RenderQueueState`, `RenderResult`.
- `RenderArtifact`, `RenderProjectManifest`, `ServerState`, `DiagnosticItem`.

These types are intentionally transport-neutral so a compatible host can expose them over local IPC, HTTP, MCP, or another explicit boundary.

## MCP Contract Constants

`STAGE_MCP_RESOURCES` and `STAGE_MCP_TOOLS` list the stable resource URIs and tool names used by render-oriented MCP hosts. They are exported as readonly arrays with matching union types:

```ts
import {
  STAGE_MCP_RESOURCES,
  STAGE_MCP_TOOLS,
  type LitSquareStageMCPResourceURI,
  type LitSquareStageMCPToolName
} from "@litsquare/stage-protocol";
```

## Compatibility

Version `0.1.0` is the first public protocol release. Treat exported types and string constants as the compatibility boundary between projects and render hosts. Additive fields should be optional; breaking wire-shape changes should ship in a future version with release notes.
