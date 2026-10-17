import { LANGS } from "../content/languages";
import type { LangCode } from "../content/types";
import { initialState, type AppState } from "./progress";

const KEY = "parola:state:v1";

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialState;
    const s = JSON.parse(raw) as Partial<AppState>;
    return {
      ...initialState,
      courseId: typeof s.courseId === "string" ? s.courseId : initialState.courseId,
      lang: s.lang && s.lang in LANGS ? (s.lang as LangCode) : initialState.lang,
      done: s.done && typeof s.done === "object" ? s.done : {},
      xp: Number.isFinite(s.xp) ? Number(s.xp) : 0,
      streak: s.streak && typeof s.streak.count === "number" ? s.streak : initialState.streak,
    };
  } catch {
    return initialState;
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable (private mode); progress then lasts for the session.
  }
}
