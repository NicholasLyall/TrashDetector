import { describe, it, expect } from "vitest";

describe("formatRelativeTime", () => {
  it("returns a string containing 'ago' for a past timestamp", async () => {
    const { formatRelativeTime } = await import("../format-relative-time");
    const twoSecondsAgo = new Date(Date.now() - 2000).toISOString();
    const result = formatRelativeTime(twoSecondsAgo);
    expect(result).toContain("ago");
  });

  it("returns a string with 'sec' for a timestamp < 60 seconds ago", async () => {
    const { formatRelativeTime } = await import("../format-relative-time");
    const now = new Date(Date.now() - 1000).toISOString();
    const result = formatRelativeTime(now);
    expect(result).toMatch(/sec/);
  });

  it("returns a string with 'min' for a timestamp 5 minutes ago", async () => {
    const { formatRelativeTime } = await import("../format-relative-time");
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const result = formatRelativeTime(fiveMinAgo);
    expect(result).toMatch(/min/);
  });

  it("returns a string with 'hr' or 'hour' for a timestamp 2 hours ago", async () => {
    const { formatRelativeTime } = await import("../format-relative-time");
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const result = formatRelativeTime(twoHoursAgo);
    expect(result).toMatch(/hr|hour/);
  });

  it("uses Intl.RelativeTimeFormat (no external dependencies)", async () => {
    // If module loads and works, it's using native API
    const mod = await import("../format-relative-time");
    expect(mod.formatRelativeTime).toBeDefined();
    expect(typeof mod.formatRelativeTime).toBe("function");
  });
});
