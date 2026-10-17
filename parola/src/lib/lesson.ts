import type { Item, LangCode, LessonKind, Unit } from "../content/types";
import { tokens } from "./text";

export const LESSONS: { kind: LessonKind; name: string; desc: string }[] = [
  { kind: "discover", name: "Scopri", desc: "Vedi, ascolta, abbina" },
  { kind: "listen", name: "Ascolta", desc: "Solo l'audio, niente testo" },
  { kind: "build", name: "Componi", desc: "Riconosci e costruisci frasi" },
  { kind: "speak", name: "Parla", desc: "Pronuncia ad alta voce" },
];

export type Exercise =
  | { type: "intro"; item: Item }
  | { type: "pick"; item: Item; options: Item[]; audioOnly: boolean }
  | { type: "reverse"; item: Item; options: Item[] }
  | { type: "build"; item: Item; bank: string[] }
  | { type: "speak"; item: Item };

export type Rng = () => number;

export function shuffle<T>(list: T[], rng: Rng = Math.random): T[] {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface BuildOptions {
  lang: LangCode;
  canSpeak: boolean;
  rng?: Rng;
}

export function buildLesson(unit: Unit, kind: LessonKind, opts: BuildOptions): Exercise[] {
  const rng = opts.rng ?? Math.random;
  const items = shuffle(unit.items, rng);
  const choices = (item: Item) => shuffle([item, ...shuffle(unit.items.filter(x => x !== item), rng).slice(0, 3)], rng);
  const pick = (item: Item, audioOnly = false): Exercise => ({ type: "pick", item, options: choices(item), audioOnly });
  const ex: Exercise[] = [];

  switch (kind) {
    case "discover":
      items.slice(0, 6).forEach((item, i) => {
        ex.push({ type: "intro", item });
        if (i % 2 === 1) ex.push(pick(items[i - 1]), pick(item));
      });
      break;
    case "listen":
      // Without speech synthesis there is nothing to listen to, so show the text.
      items.forEach(item => ex.push(pick(item, opts.canSpeak)));
      break;
    case "build":
      items.slice(0, 4).forEach(item => ex.push({ type: "reverse", item, options: choices(item) }));
      unit.sentences.forEach(item => ex.push({ type: "build", item, bank: shuffle(tokens(item, opts.lang), rng) }));
      items.slice(4, 6).forEach(item => ex.push(pick(item)));
      break;
    case "speak":
      items.slice(0, 4).forEach(item => ex.push({ type: "speak", item }));
      unit.sentences.forEach(item => ex.push({ type: "speak", item }));
      break;
  }
  return ex;
}
