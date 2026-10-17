export type LangCode = "en" | "es" | "fr" | "de" | "ja";

export interface JaReading {
  /** Hepburn romanisation shown under the Japanese text. */
  romaji: string;
  /** Hiragana reading, used to accept speech transcripts written in kana. */
  kana: string;
}

export interface Item {
  id: string;
  /** Picture shown in the exercise (emoji). */
  pic: string;
  /** Italian meaning, revealed only after answering. */
  it: string;
  /**
   * Phrase per language. Spaces mark word boundaries; for Japanese they are
   * segment boundaries used by sentence building and are removed on display.
   */
  t: Partial<Record<LangCode, string>>;
  ja?: JaReading;
}

export interface Unit {
  id: string;
  title: string;
  sub: string;
  items: Item[];
  sentences: Item[];
}

export interface Course {
  id: string;
  title: string;
  desc: string;
  langs: LangCode[];
  /**
   * "picture": answer by choosing pictures (pure immersion).
   * "meaning": answer by choosing the Italian meaning, for phrases that a
   * picture cannot represent unambiguously.
   */
  mode: "picture" | "meaning";
  units: Unit[];
}

export type LessonKind = "discover" | "listen" | "build" | "speak";
