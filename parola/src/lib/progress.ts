import type { LangCode, LessonKind } from "../content/types";

export interface Streak {
  count: number;
  /** Local date (YYYY-MM-DD) of the last completed lesson. */
  last: string | null;
}

export interface AppState {
  version: 1;
  courseId: string;
  lang: LangCode;
  /** Completed lessons per "<course>:<lang>", as "<unit>:<kind>" keys. */
  done: Record<string, string[]>;
  xp: number;
  streak: Streak;
}

export const initialState: AppState = {
  version: 1,
  courseId: "general",
  lang: "en",
  done: {},
  xp: 0,
  streak: { count: 0, last: null },
};

export const trackKey = (courseId: string, lang: LangCode) => `${courseId}:${lang}`;
export const lessonKey = (unitId: string, kind: LessonKind) => `${unitId}:${kind}`;

export function localDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function previousDay(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return localDate(new Date(y, m - 1, d - 1));
}

export function nextStreak(streak: Streak, today: string): Streak {
  if (streak.last === today) return streak;
  const continued = streak.last !== null && streak.last === previousDay(today);
  return { count: continued ? streak.count + 1 : 1, last: today };
}

/** Streak as it should be displayed today: a missed day resets it to zero. */
export function visibleStreak(streak: Streak, today: string): number {
  if (streak.last === today || (streak.last && streak.last === previousDay(today))) return streak.count;
  return 0;
}

export const xpFor = (correct: number) => 10 + 2 * correct;

export function completeLesson(
  state: AppState,
  track: string,
  lesson: string,
  correct: number,
  today: string,
): { state: AppState; gained: number } {
  const gained = xpFor(correct);
  const done = state.done[track] ?? [];
  return {
    gained,
    state: {
      ...state,
      xp: state.xp + gained,
      streak: nextStreak(state.streak, today),
      done: { ...state.done, [track]: done.includes(lesson) ? done : [...done, lesson] },
    },
  };
}
