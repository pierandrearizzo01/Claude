import { describe, expect, it } from "vitest";
import { lcsLength, normalize, PASS_SCORE, scoreAttempt } from "./match";

describe("normalize", () => {
  it("drops case, accents and punctuation for spaced languages", () => {
    expect(normalize("¿Dónde está el hospital?", "es")).toBe("donde esta el hospital");
    expect(normalize("Où est l'hôpital ?", "fr")).toBe("ou est l hopital");
  });
  it("keeps voiced kana intact and folds katakana to hiragana", () => {
    expect(normalize("でんしゃが", "ja")).toBe("でんしゃが");
    expect(normalize("パン を", "ja")).toBe("ぱんを");
  });
});

describe("scoreAttempt", () => {
  it("passes an exact transcript", () => {
    const a = scoreAttempt(["The girl has a dog"], ["the girl has a dog"], "en");
    expect(a.score).toBe(1);
    expect(a.passed).toBe(true);
  });
  it("uses the best of several alternatives", () => {
    const a = scoreAttempt(["Squeeze my hands"], ["sneeze my hand", "squeeze my hands"], "en");
    expect(a.heard).toBe("squeeze my hands");
    expect(a.passed).toBe(true);
  });
  it("fails a partial attempt", () => {
    const a = scoreAttempt(["When did the symptoms start?"], ["when did"], "en");
    expect(a.score).toBeLessThan(PASS_SCORE);
    expect(a.passed).toBe(false);
  });
  it("penalises extra words", () => {
    const a = scoreAttempt(["the dog"], ["the dog the cat the apple the bread"], "en");
    expect(a.passed).toBe(false);
  });
  it("accepts Japanese written in kana instead of kanji", () => {
    const a = scoreAttempt(["電車", "でんしゃ"], ["でんしゃ"], "ja");
    expect(a.passed).toBe(true);
  });
  it("handles an empty transcript", () => {
    expect(scoreAttempt(["the dog"], [], "en")).toMatchObject({ score: 0, passed: false });
  });
});

it("lcsLength", () => {
  expect(lcsLength(["a", "b", "c", "d"], ["a", "c", "d"])).toBe(3);
  expect(lcsLength([], ["a"])).toBe(0);
});
