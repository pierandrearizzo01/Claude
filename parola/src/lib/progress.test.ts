import { describe, expect, it } from "vitest";
import { completeLesson, initialState, localDate, nextStreak, visibleStreak } from "./progress";

describe("streak", () => {
  it("starts at one", () => {
    expect(nextStreak({ count: 0, last: null }, "2026-10-17")).toEqual({ count: 1, last: "2026-10-17" });
  });
  it("continues across consecutive days, including month ends", () => {
    expect(nextStreak({ count: 4, last: "2026-09-30" }, "2026-10-01")).toEqual({ count: 5, last: "2026-10-01" });
  });
  it("does not double count the same day", () => {
    const s = { count: 3, last: "2026-10-17" };
    expect(nextStreak(s, "2026-10-17")).toBe(s);
  });
  it("resets after a missed day", () => {
    expect(nextStreak({ count: 9, last: "2026-10-14" }, "2026-10-17")).toEqual({ count: 1, last: "2026-10-17" });
    expect(visibleStreak({ count: 9, last: "2026-10-14" }, "2026-10-17")).toBe(0);
    expect(visibleStreak({ count: 9, last: "2026-10-16" }, "2026-10-17")).toBe(9);
  });
});

it("completeLesson adds XP and records the lesson once", () => {
  const first = completeLesson(initialState, "general:en", "people:discover", 5, "2026-10-17");
  expect(first.gained).toBe(20);
  const again = completeLesson(first.state, "general:en", "people:discover", 0, "2026-10-17");
  expect(again.state.done["general:en"]).toEqual(["people:discover"]);
  expect(again.state.xp).toBe(30);
});

it("localDate pads month and day", () => {
  expect(localDate(new Date(2026, 0, 5))).toBe("2026-01-05");
});
