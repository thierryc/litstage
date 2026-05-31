# litStage

`litstage` is the open-source JavaScript and TypeScript runtime for code-first animation projects.

It provides:

- `@litsquare/litstage`: a host-agnostic frame runner and browser playback host
- `@litsquare/litstage-react`: React bindings for runner-driven animation views
- `@litsquare/litstage-protocol`: shared project config, render job, artifact, and MCP payload types

Renderer hosts live in private repositories:

- `thierryc/litstage-macos`
- `thierryc/litstage-chromium`

## Development

```bash
pnpm install
pnpm check
pnpm test
pnpm build
pnpm build:examples
```

## Project Config

litStage projects use `litstage.config.json`:

```json
{
  "name": "Basic DOM Stage",
  "sourceEntry": "src/main.ts",
  "buildDir": "build",
  "preview": {
    "fps": 30,
    "width": 1280,
    "height": 720,
    "durationFrames": 180,
    "loop": true
  },
  "render": {
    "width": 1280,
    "height": 720,
    "fps": 30,
    "videoOutput": "h264Mp4",
    "videoMode": "deterministic"
  }
}
```

## License

MIT

