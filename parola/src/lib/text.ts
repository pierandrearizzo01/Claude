import { LANGS } from "../content/languages";
import type { Item, LangCode } from "../content/types";

/** The phrase as the learner should see it (Japanese segment spaces removed). */
export function display(item: Item, lang: LangCode): string {
  const raw = item.t[lang] ?? "";
  return LANGS[lang].spaced ? raw : raw.replace(/ /g, "");
}

/** Word (or Japanese segment) tiles for sentence building. */
export function tokens(item: Item, lang: LangCode): string[] {
  return (item.t[lang] ?? "").split(" ").filter(Boolean);
}

export function joinTokens(parts: string[], lang: LangCode): string {
  return parts.join(LANGS[lang].spaced ? " " : "");
}
