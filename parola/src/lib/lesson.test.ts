import { describe, expect, it } from "vitest";
import { general } from "../content/general";
import { medical } from "../content/medical";
import { buildLesson, LESSONS } from "./lesson";
import { display, joinTokens } from "./text";

const seeded = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

describe("buildLesson", () => {
  const unit = general.units[0];
  it("introduces words before quizzing them", () => {
    const ex = buildLesson(unit, "discover", { lang: "en", canSpeak: true, rng: seeded(1) });
    const seen = new Set<string>();
    for (const e of ex) {
      if (e.type === "intro") seen.add(e.item.id);
      else expect(seen.has(e.item.id)).toBe(true);
    }
  });
  it("offers four distinct options that include the answer", () => {
    for (const e of buildLesson(unit, "listen", { lang: "en", canSpeak: true, rng: seeded(2) })) {
      if (e.type !== "pick") throw new Error("expected pick");
      expect(e.audioOnly).toBe(true);
      expect(new Set(e.options.map(o => o.id)).size).toBe(4);
      expect(e.options).toContain(e.item);
    }
  });
  it("shows text in listening lessons when speech synthesis is unavailable", () => {
    const ex = buildLesson(unit, "listen", { lang: "en", canSpeak: false, rng: seeded(3) });
    expect(ex.every(e => e.type === "pick" && !e.audioOnly)).toBe(true);
  });
  it("sentence tiles reassemble into the Japanese sentence without spaces", () => {
    const ex = buildLesson(unit, "build", { lang: "ja", canSpeak: true, rng: seeded(4) });
    for (const e of ex) {
      if (e.type !== "build") continue;
      const ordered = e.item.t.ja!.split(" ");
      expect([...e.bank].sort()).toEqual([...ordered].sort());
      expect(joinTokens(ordered, "ja")).toBe(display(e.item, "ja"));
      expect(display(e.item, "ja")).not.toContain(" ");
    }
  });
  it("builds every lesson of every course", () => {
    for (const course of [general, medical])
      for (const u of course.units)
        for (const l of LESSONS)
          for (const lang of course.langs) expect(buildLesson(u, l.kind, { lang, canSpeak: true }).length).toBeGreaterThan(3);
  });
});
