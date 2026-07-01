import React, { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { createRoot } from "react-dom/client";
import { attachRenderHost } from "@litsquare/stage";
import { LitSquareStageProvider, useLitSquareStage, useLitSquareStageFrame } from "@litsquare/stage-react";
import type { LitSquareStageSketch } from "@litsquare/stage";
import "./styles.css";

function StageReadout() {
  const frame = useLitSquareStageFrame();
  return <p>{frame ? `Frame ${frame.frame}` : "Frame 0"}</p>;
}

function App() {
  const stageRef = useRef<HTMLElement | null>(null);
  const renderHostRef = useRef<{ destroy(): void } | null>(null);
  const sketch = useMemo<LitSquareStageSketch>(() => ({
    renderFrame(ctx, root) {
      root.style.setProperty("--progress", String(ctx.frame / Math.max(ctx.durationFrames - 1, 1)));
    }
  }), []);

  return (
    <LitSquareStageProvider
      rootRef={stageRef}
      sketch={sketch}
      initialContext={{ fps: 30, width: 1280, height: 720, durationFrames: 180 }}
    >
      <main ref={stageRef} className="stage" data-node-id="react.stage" data-node-type="stage">
        <RenderHostBinder renderHostRef={renderHostRef} />
        <div className="bar" />
        <StageReadout />
      </main>
    </LitSquareStageProvider>
  );
}

function RenderHostBinder({ renderHostRef }: { renderHostRef: MutableRefObject<{ destroy(): void } | null> }) {
  const { runner } = useLitSquareStage();

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
