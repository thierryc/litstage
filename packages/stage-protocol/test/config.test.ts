import { describe, expect, it } from "vitest";
import { parseLitSquareStageConfig } from "../src/index.js";

describe("parseLitSquareStageConfig", () => {
  it("accepts a minimal render project config", () => {
    const parsed = parseLitSquareStageConfig({
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
        videoMode: "deterministic",
        motionBlur: {
          enabled: true,
          shutterAngle: 180,
          sampleCount: 8
        }
      }
    });

    expect(parsed.name).toBe("Fixture");
    expect(parsed.render?.motionBlur).toEqual({
      enabled: true,
      shutterAngle: 180,
      sampleCount: 8
    });
  });

  it("rejects invalid dimensions", () => {
    expect(() => parseLitSquareStageConfig({
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

  it("rejects invalid motion blur settings", () => {
    expect(() => parseLitSquareStageConfig({
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
        motionBlur: {
          enabled: true,
          shutterAngle: 540,
          sampleCount: 8
        }
      }
    })).toThrow(/shutterAngle/);
  });
});
