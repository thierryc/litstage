# Project Anatomy

A LitSquare Stage project is a small web app with a render contract.

```text
my-stage/
  package.json
  stage.config.json
  index.html
  src/
    main.ts
    styles.css
  assets/
  data/
  dist/
  renders/
```

## `package.json`

Defines normal development commands. Every project should provide:

```json
{
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "vite build"
  }
}
```

## `stage.config.json`

Defines the stage name, source entry, build output, preview settings, and render settings. Keep preview fast enough for iteration and render settings honest to the final delivery format.

## `index.html`

Contains the full-frame stage root:

```html
<div id="stage"></div>
<script type="module" src="/src/main.ts"></script>
```

Avoid adding visible layout outside the stage root unless it is purely development UI.

## `src/main.ts`

Creates the runner, attaches browser playback, attaches render-host bridge support, and implements the sketch. This is where frame-derived motion belongs.

The standard shape is:

```ts
const runner = createRunner({ root, sketch, initialContext });
attachBrowserHost(runner, previewSettings);
attachRenderHost(runner);
```

## `src/styles.css`

Defines stable full-frame layout, fonts, colors, and element styling. Use CSS for appearance, but drive final timing from `renderFrame`.

## `assets/`

Use this for local render assets:

- Images and SVGs.
- Video and audio.
- Fonts.
- GLTF/GLB models.
- Lookup tables, textures, and masks.

Assets should be local and loaded before export.

## `data/`

Use this for render snapshots:

- Weather or sports payloads.
- Finance tables.
- Localized copy.
- Variant rows.
- Design token exports.

Do not fetch production data inside `renderFrame`; fetch and validate it before rendering, then store the snapshot.

## `dist/`

Build output from Vite. A compatible render host loads files from the configured `buildDir`.

## `renders/`

Recommended location for final MP4/MOV files, stills, short test ranges, and QA artifacts.
