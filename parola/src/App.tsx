import { useCallback, useEffect, useMemo, useState } from "react";
import { COURSES, courseById, LANGS } from "./content";
import type { Course, LangCode, LessonKind } from "./content/types";
import { LessonRunner, type LessonResult } from "./components/LessonRunner";
import { SpeakButton } from "./components/Speak";
import { buildLesson, LESSONS, type Exercise } from "./lib/lesson";
import { completeLesson, lessonKey, localDate, trackKey, visibleStreak, type AppState } from "./lib/progress";
import { canRecognize, canSpeak } from "./lib/speech";
import { loadState, saveState } from "./lib/storage";
import { display } from "./lib/text";

interface Active {
  unitIndex: number;
  kind: LessonKind;
  exercises: Exercise[];
  run: number;
}

const allLessons = (course: Course) => course.units.flatMap((u, ui) => LESSONS.map(l => ({ ui, unit: u, kind: l.kind })));

export function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [tab, setTab] = useState<"course" | "phrases">("course");
  const [active, setActive] = useState<Active | null>(null);
  useEffect(() => saveState(state), [state]);

  const course = courseById(state.courseId);
  const lang: LangCode = course.langs.includes(state.lang) ? state.lang : course.langs[0];
  const track = trackKey(course.id, lang);
  const done = state.done[track] ?? [];
  const lessons = useMemo(() => allLessons(course), [course]);
  const nextIndex = lessons.findIndex(l => !done.includes(lessonKey(l.unit.id, l.kind)));
  const today = localDate(new Date());

  const start = useCallback((ui: number, kind: LessonKind) => {
    const exercises = buildLesson(course.units[ui], kind, { lang, canSpeak });
    setActive(a => ({ unitIndex: ui, kind, exercises, run: (a?.run ?? 0) + 1 }));
  }, [course, lang]);

  function finish(r: LessonResult) {
    const unit = course.units[active!.unitIndex];
    const res = completeLesson(state, track, lessonKey(unit.id, active!.kind), r.correct, today);
    setState(res.state);
    return { gained: res.gained, streak: res.state.streak.count };
  }

  // The lesson after the one just finished, computed from the updated state.
  const afterActive = active && (() => {
    const idx = lessons.findIndex(l => l.ui === active.unitIndex && l.kind === active.kind);
    const nxt = lessons[idx + 1];
    return nxt ? () => start(nxt.ui, nxt.kind) : null;
  })();

  return (
    <>
      <header className="top">
        <div className="wrap">
          <div className="bar">
            <div className="brand">Parola <small>impara per immersione</small></div>
            <div className="stats">
              <span className="pill" title="Giorni consecutivi"><span className="dot accent" />{visibleStreak(state.streak, today)} giorni</span>
              <span className="pill" title="Punti esperienza"><span className="dot good" />{state.xp} XP</span>
            </div>
          </div>
          <div className="courses" role="group" aria-label="Corso">
            {COURSES.map(c => (
              <button key={c.id} type="button" className="course-btn" aria-pressed={c.id === course.id}
                onClick={() => setState(s => ({ ...s, courseId: c.id }))}>
                <b>{c.title}</b><span>{c.desc}</span>
              </button>
            ))}
          </div>
          {course.langs.length > 1 && (
            <div className="langs" role="group" aria-label="Lingua da imparare">
              {course.langs.map(l => (
                <button key={l} type="button" className="lang" aria-pressed={l === lang} onClick={() => setState(s => ({ ...s, lang: l }))}>
                  {LANGS[l].name}
                </button>
              ))}
            </div>
          )}
          <div className="tabs" role="tablist">
            <button type="button" role="tab" className="tab" aria-selected={tab === "course"} onClick={() => setTab("course")}>Corso</button>
            <button type="button" role="tab" className="tab" aria-selected={tab === "phrases"} onClick={() => setTab("phrases")}>Frasario</button>
          </div>
        </div>
      </header>

      <main className="wrap">
        {tab === "course" ? (
          <CourseView course={course} lang={lang} done={done} nextIndex={nextIndex} onStart={start} />
        ) : (
          <Phrasebook course={course} lang={lang} />
        )}
      </main>

      {active && (
        <LessonRunner
          key={active.run}
          course={course}
          unit={course.units[active.unitIndex]}
          lessonName={LESSONS.find(l => l.kind === active.kind)!.name}
          lang={lang}
          exercises={active.exercises}
          onFinish={finish}
          onExit={() => setActive(null)}
          onNext={afterActive}
        />
      )}
    </>
  );
}

function CourseView({ course, lang, done, nextIndex, onStart }: {
  course: Course; lang: LangCode; done: string[]; nextIndex: number; onStart: (ui: number, kind: LessonKind) => void;
}) {
  const total = course.units.length * LESSONS.length;
  const next = nextIndex >= 0 ? { ui: Math.floor(nextIndex / LESSONS.length), kind: LESSONS[nextIndex % LESSONS.length] } : null;
  const where = course.langs.length > 1 ? ` · ${LANGS[lang].name}` : "";
  return (
    <>
      {next ? (
        <div className="resume">
          <div>
            <div className="eyebrow">{done.length ? "Riprendi" : "Inizia"}{where}</div>
            <h2>Unità {next.ui + 1}: {course.units[next.ui].title} · {next.kind.name}</h2>
            <p>{done.length} di {total} lezioni completate</p>
          </div>
          <button type="button" className="btn" onClick={() => onStart(next.ui, next.kind.kind)}>
            {done.length ? "Continua" : "Inizia la prima lezione"}
          </button>
        </div>
      ) : (
        <div className="resume">
          <div>
            <div className="eyebrow">{course.title}{where}</div>
            <h2>Corso completato</h2>
            <p>Ripeti qualsiasi lezione per consolidare.</p>
          </div>
        </div>
      )}

      {course.units.map((u, ui) => {
        const count = LESSONS.filter(l => done.includes(lessonKey(u.id, l.kind))).length;
        return (
          <section className="unit" key={u.id}>
            <div className="unit-num">{String(ui + 1).padStart(2, "0")}</div>
            <div className="unit-body">
              <h3>{u.title}</h3>
              <p className="sub">{u.sub} · {u.items.length} {course.mode === "meaning" ? "voci" : "parole"}, {u.sentences.length} frasi</p>
              <div className="meter"><i style={{ width: `${(count / LESSONS.length) * 100}%` }} /></div>
              <div className="lessons">
                {LESSONS.map((l, li) => {
                  const idx = ui * LESSONS.length + li;
                  const isDone = done.includes(lessonKey(u.id, l.kind));
                  const isNext = idx === nextIndex;
                  const open = nextIndex < 0 || idx <= nextIndex;
                  const cls = isDone ? "done" : isNext ? "next" : open ? "" : "locked";
                  const status = isDone ? "Completata" : isNext ? "Prossima" : open ? "Disponibile" : "Bloccata";
                  return (
                    <button key={l.kind} type="button" className={`lesson ${cls}`} disabled={!open} onClick={() => onStart(ui, l.kind)}>
                      <b>{l.name}</b><span>{l.desc}</span><span className="state">{status}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      <p className="method">
        {course.mode === "picture"
          ? "Il metodo: niente traduzioni durante l'esercizio. Associ direttamente suono e immagine; il significato in italiano compare solo dopo la risposta."
          : "Le frasi sono quelle che si usano con i pazienti. Ascoltale, riconoscile e pronunciale finché vengono naturali."}
        {!canSpeak && " Questo browser non supporta la sintesi vocale: gli esercizi di ascolto mostrano il testo."}
        {canRecognize
          ? " Nelle lezioni Parla il riconoscimento vocale è gestito dal browser, che può inviare l'audio al proprio servizio online."
          : " In questo browser le lezioni Parla usano l'autovalutazione: per il riconoscimento vocale usa Chrome, Edge o Safari."}
      </p>
    </>
  );
}

function Phrasebook({ course, lang }: { course: Course; lang: LangCode }) {
  return (
    <>
      {course.units.map(u => (
        <section className="phrase-group" key={u.id}>
          <h3>{u.title}</h3>
          {[...u.items, ...u.sentences].map(it => (
            <div className="phrase" key={it.id}>
              <div className="pic" aria-hidden="true">{it.pic}</div>
              <div className="t">
                <b lang={lang}>{display(it, lang)}</b>
                {lang === "ja" && it.ja && <span className="romaji">{it.ja.romaji}</span>}
                <span>{it.it}</span>
              </div>
              <SpeakButton text={display(it, lang)} voice={LANGS[lang].voice} />
            </div>
          ))}
        </section>
      ))}
    </>
  );
}
