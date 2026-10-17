import type { LangCode } from "../content/types";

/** Share of the target that must be recognised to count as correct. */
export const PASS_SCORE = 0.8;

const toHiragana = (s: string) =>
  s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));

export function normalize(text: string, lang: LangCode): string {
  let s = text.toLowerCase().replace(/[\p{P}\p{S}]/gu, " ");
  if (lang === "ja") {
    // Leave Japanese composed: NFD would split voiced kana (が → か + ゛).
    return toHiragana(s.normalize("NFKC")).replace(/\s+/g, "");
  }
  s = s.normalize("NFD").replace(/\p{M}/gu, "");
  return s.replace(/\s+/g, " ").trim();
}

/** Comparison units: characters for Japanese, words elsewhere. */
export function units(text: string, lang: LangCode): string[] {
  const n = normalize(text, lang);
  if (!n) return [];
  return lang === "ja" ? Array.from(n) : n.split(" ");
}

export function lcsLength<T>(a: T[], b: T[]): number {
  const row = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    let prev = 0;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = a[i - 1] === b[j - 1] ? prev + 1 : Math.max(row[j], row[j - 1]);
      prev = tmp;
    }
  }
  return row[b.length];
}

export interface Attempt {
  score: number;
  heard: string;
  passed: boolean;
}

/**
 * Scores speech-recognition transcripts against the accepted forms of a phrase
 * (e.g. kanji and kana for Japanese). Extra words in the transcript lower the
 * score so that saying everything at once doesn't pass.
 */
export function scoreAttempt(targets: string[], transcripts: string[], lang: LangCode): Attempt {
  let best: Attempt = { score: 0, heard: transcripts[0] ?? "", passed: false };
  for (const target of targets) {
    const t = units(target, lang);
    if (!t.length) continue;
    for (const heard of transcripts) {
      const h = units(heard, lang);
      const common = lcsLength(t, h);
      const score = (2 * common) / (t.length + h.length);
      if (score > best.score) best = { score, heard, passed: score >= PASS_SCORE };
    }
  }
  return best;
}
