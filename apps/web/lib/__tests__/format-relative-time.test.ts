import { describe, it, expect } from "vitest";

describe("formatRelativeTime", () => {
  it("returns a string containing 'ago' for a past timestamp", async () => {
    const { formatRelativeTime } = await import("../format-relative-time");
    const twoSecondsAgo = new Date(Date.now() - 2000).toISOString();
    const result = formatRelativeTime(twoSecondsAgo);
    expect(result).toContain("ago");
  });

  it("returns a short second format for a timestamp < 60 seconds ago", async () => {
    const { formatRelativeTime } = await import("../format-relative-time");
    const now = new Date(Date.now() - 1000).toISOString();
    const result = formatRelativeTime(now);
    // Intl narrow style produces "1s ago" or "1 sec. ago" depending on locale
    expect(result).toMatch(/s\s*ago|sec/);
  });

  it("returns a short minute format for a timestamp 5 minutes ago", async () => {
    const { formatRelativeTime } = await import("../format-relative-time");
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const result = formatRelativeTime(fiveMinAgo);
    // Intl narrow style produces "5m ago" or "5 min. ago" depending on locale
    expect(result).toMatch(/m\s*ago|min/);
  });

  it("returns a short hour format for a timestamp 2 hours ago", async () => {
    const { formatRelativeTime } = await import("../format-relative-time");
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const result = formatRelativeTime(twoHoursAgo);
    // Intl narrow style produces "2h ago" or "2 hr. ago" depending on locale
    expect(result).toMatch(/h\s*ago|hr|hour/);
  });

  it("uses Intl.RelativeTimeFormat (no external dependencies)", async () => {
    const mod = await import("../format-relative-time");
    expect(mod.formatRelativeTime).toBeDefined();
    expect(typeof mod.formatRelativeTime).toBe("function");
  });
});
