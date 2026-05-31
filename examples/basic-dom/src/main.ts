import { attachBrowserHost, attachRenderHost, createRunner, type LitStageSketch } from "@litsquare/litstage";
import "./styles.css";

const root = document.getElementById("stage");
if (!root) {
  throw new Error("Missing #stage root.");
}

const sketch: LitStageSketch = {
  renderFrame(ctx, element) {
    const progress = ctx.durationFrames <= 1 ? 0 : ctx.frame / (ctx.durationFrames - 1);
    element.innerHTML = `
      <section class="composition" data-node-id="basic.stage" data-node-type="stage">
        <div class="orb" style="transform: translateX(${Math.round(progress * 720)}px)"></div>
        <p>Frame ${ctx.frame}</p>
      </section>
    `;
  }
};

const runner = createRunner({
  root,
  sketch,
  initialContext: {
    fps: 30,
    width: 1280,
    height: 720,
    durationFrames: 180
  }
});

attachBrowserHost(runner, {
  fps: 30,
  width: 1280,
  height: 720,
  durationFrames: 180,
  autoplay: true,
  loop: true
});

attachRenderHost(runner);
