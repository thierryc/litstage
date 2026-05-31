import { describe, expect, it } from "vitest";
import { parseLitStageConfig } from "../src/index.js";

describe("parseLitStageConfig", () => {
  it("accepts a minimal render project config", () => {
    expect(parseLitStageConfig({
      name: "Fixture",
      sourceEntry: "src/main.ts",
      buildDir: "build",
      preview: {
        fps: 30,
        width: 1280,
        height: 720,
        durationFrames: 90,
        loop: true
      },
      render: {
        width: 1280,
        height: 720,
        fps: 30,
        videoOutput: "h264Mp4",
        videoMode: "deterministic"
      }
    }).name).toBe("Fixture");
  });

  it("rejects invalid dimensions", () => {
    expect(() => parseLitStageConfig({
      name: "Fixture",
      sourceEntry: "src/main.ts",
      buildDir: "build",
      preview: {
        fps: 30,
        width: 0,
        height: 720,
        durationFrames: 90,
        loop: true
      }
    })).toThrow(/width/);
  });
});

