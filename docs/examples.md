# Examples

Use the closest starter instead of beginning from a blank project.

## Included Examples

| Example | Path | Best for | Technique |
| --- | --- | --- | --- |
| Basic DOM | `examples/basic-dom` | Launch posts, cards, simple story sequences | DOM layout and frame-derived content timing |
| React | `examples/react` | React-authored animation views | Provider/hooks integration with the runner |

## Basic DOM

```bash
pnpm --filter @litsquare/stage-example-basic-dom dev
pnpm --filter @litsquare/stage-example-basic-dom build
```

The entrypoint creates a runner, attaches browser playback, attaches the render-host bridge, and updates DOM from `FrameContext`.

## React

```bash
pnpm --filter @litsquare/stage-example-react dev
pnpm --filter @litsquare/stage-example-react build
```

The React example uses `LitSquareStageProvider`, `useLitSquareStage`, and `useLitSquareStageFrame` for component-driven stage updates.

## Starter Patterns

| Pattern | Best for | First thing to customize |
| --- | --- | --- |
| Slideshow | Launch posts, cards, sponsor loops, social drafts | Copy array and timed text |
| Product orbit | Product hero spins, cinema idents, spatial UI explainers | Model, camera path, lighting |
| Responsive format pack | Multi-format campaigns and cutdowns | Render dimensions and safe areas |
| Data batch | Weather, sports, finance, local ads | Local JSON snapshots and variant naming |
| Design-frame motion | Design handoff and branded UI motion | Layer data, tokens, transitions |
| Variable-font title | Kinetic type, title cards, brand posts | Font asset and axis mapping |
| SVG morph | Logo morphs, map shapes, icon transitions | Normalized source paths |
| Shader loop | Shader backgrounds and GPU experiments | Uniforms and fallback drawing |

Keep starter assets local and derive final motion from `FrameContext` so preview and render stay consistent.
