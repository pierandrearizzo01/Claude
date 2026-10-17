import { describe, expect, it } from "vitest";
import { COURSES } from ".";

describe("course content", () => {
  for (const course of COURSES) {
    describe(course.title, () => {
      const all = course.units.flatMap(u => [...u.items, ...u.sentences]);
      it("translates every phrase into every course language", () => {
        for (const item of all) for (const lang of course.langs) expect(item.t[lang], `${item.id} ${lang}`).toBeTruthy();
      });
      it("has unique ids and an Italian meaning", () => {
        expect(new Set(all.map(i => i.id)).size).toBe(all.length);
        for (const item of all) expect(item.it.trim()).not.toBe("");
      });
      it("has at least four items per unit, so each question has three distractors", () => {
        for (const u of course.units) expect(u.items.length).toBeGreaterThanOrEqual(4);
      });
      if (course.langs.includes("ja")) {
        it("gives every Japanese phrase romaji and a hiragana reading", () => {
          for (const item of all) {
            expect(item.ja?.romaji, item.id).toBeTruthy();
            expect(item.ja?.kana, item.id).toMatch(/^[ぁ-ゖー]+$/);
          }
        });
      }
    });
  }
});
