import { describe, expect, it } from "vitest";
import { detectPwaPlatform } from "./index";

describe("detectPwaPlatform", () => {
  it("detects android", () => {
    expect(detectPwaPlatform("Mozilla/5.0 Android Chrome", "Linux armv8")).toBe("android");
  });

  it("detects ios", () => {
    expect(detectPwaPlatform("Mozilla/5.0 iPhone Safari", "iPhone")).toBe("ios");
  });

  it("falls back to desktop", () => {
    expect(detectPwaPlatform("Mozilla/5.0 Windows Chrome", "Win32")).toBe("desktop");
  });
});
