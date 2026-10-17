import type { LangCode } from "./types";

export interface LangInfo {
  name: string;
  /** BCP 47 tag for speech synthesis and recognition. */
  voice: string;
  /** False when the written language does not separate words with spaces. */
  spaced: boolean;
}

export const LANGS: Record<LangCode, LangInfo> = {
  en: { name: "Inglese", voice: "en-GB", spaced: true },
  es: { name: "Spagnolo", voice: "es-ES", spaced: true },
  fr: { name: "Francese", voice: "fr-FR", spaced: true },
  de: { name: "Tedesco", voice: "de-DE", spaced: true },
  ja: { name: "Giapponese", voice: "ja-JP", spaced: false },
};
