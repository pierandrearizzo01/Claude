import { general } from "./general";
import { medical } from "./medical";
import type { Course } from "./types";

export const COURSES: Course[] = [general, medical];
export const courseById = (id: string): Course => COURSES.find(c => c.id === id) ?? general;
export { LANGS } from "./languages";
export type * from "./types";
