import React, { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { createRoot } from "react-dom/client";
import { attachRenderHost } from "@litsquare/litstage";
import { LitStageProvider, useLitStage, useLitStageFrame } from "@litsquare/litstage-react";
import type { LitStageSketch } from "@litsquare/litstage";
import "./styles.css";

function StageReadout() {
  const frame = useLitStageFrame();
  return <p>{frame ? `Frame ${frame.frame}` : "Frame 0"}</p>;
}

function App() {
  const stageRef = useRef<HTMLElement | null>(null);
  const renderHostRef = useRef<{ destroy(): void } | null>(null);
  const sketch = useMemo<LitStageSketch>(() => ({
    renderFrame(ctx, root) {
      root.style.setProperty("--progress", String(ctx.frame / Math.max(ctx.durationFrames - 1, 1)));
    }
  }), []);

  return (
    <LitStageProvider
      rootRef={stageRef}
      sketch={sketch}
      initialContext={{ fps: 30, width: 1280, height: 720, durationFrames: 180 }}
    >
      <main ref={stageRef} className="stage" data-node-id="react.stage" data-node-type="stage">
        <RenderHostBinder renderHostRef={renderHostRef} />
        <div className="bar" />
        <StageReadout />
      </main>
    </LitStageProvider>
  );
}

function RenderHostBinder({ renderHostRef }: { renderHostRef: MutableRefObject<{ destroy(): void } | null> }) {
  const { runner } = useLitStage();

  useEffect(() => {
    if (!runner || renderHostRef.current) {
      return;
    }

    renderHostRef.current = attachRenderHost(runner);
    return () => {
      renderHostRef.current?.destroy();
      renderHostRef.current = null;
    };
  }, [renderHostRef, runner]);

  return null;
}

createRoot(document.getElementById("root")!).render(<App />);
