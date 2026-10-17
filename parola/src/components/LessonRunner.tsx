import { useEffect, useState } from "react";
import { LANGS } from "../content/languages";
import type { Course, LangCode, Unit } from "../content/types";
import type { Exercise } from "../lib/lesson";
import { speak } from "../lib/speech";
import { display } from "../lib/text";
import { Build, Intro, Pick, Reverse, Speak } from "./Exercises";

export interface LessonResult {
  correct: number;
  graded: number;
}

interface Props {
  course: Course;
  unit: Unit;
  lessonName: string;
  lang: LangCode;
  exercises: Exercise[];
  onFinish: (r: LessonResult) => { gained: number; streak: number };
  onExit: () => void;
  onNext: (() => void) | null;
}

export function LessonRunner({ course, unit, lessonName, lang, exercises, onFinish, onExit, onNext }: Props) {
  const [i, setI] = useState(0);
  const [action, setActionState] = useState<(() => void) | null>(null);
  const [verdict, setVerdict] = useState<boolean | null>(null);
  const [score, setScore] = useState<LessonResult>({ correct: 0, graded: 0 });
  const [summary, setSummary] = useState<{ gained: number; streak: number; pct: number } | null>(null);
  const ex = exercises[i];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onExit();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onExit]);

  const setAction = (a: (() => void) | null) => setActionState(() => a);

  function graded(correct: boolean) {
    if (ex.type === "intro") return advance();
    setVerdict(correct);
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), graded: s.graded + 1 }));
    if (ex.type !== "speak") speak(display(ex.item, lang), LANGS[lang].voice);
  }

  function advance() {
    setVerdict(null);
    setActionState(null);
    if (i + 1 < exercises.length) return setI(i + 1);
    const r = onFinish(score);
    setSummary({ ...r, pct: score.graded ? Math.round((score.correct / score.graded) * 100) : 100 });
  }

  const Body = () => {
    const props = { course, lang, setAction, onGraded: graded, graded: verdict !== null };
    switch (ex.type) {
      case "intro": return <Intro {...props} ex={ex} />;
      case "pick": return <Pick {...props} ex={ex} />;
      case "reverse": return <Reverse {...props} ex={ex} />;
      case "build": return <Build {...props} ex={ex} />;
      case "speak": return <Speak {...props} ex={ex} />;
    }
  };

  const pct = summary ? 100 : (i / exercises.length) * 100;
  const footClass = verdict === null ? "" : verdict ? "ok" : "ko";

  return (
    <div className="runner" role="dialog" aria-modal="true" aria-label={`Lezione ${lessonName}`}>
      <div className="wrap head">
        <button type="button" className="close" aria-label="Esci dalla lezione" onClick={onExit}>×</button>
        <div className="progress" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>
      </div>
      <div className="stage">
        <div className="wrap">
          {summary ? (
            <div className="summary">
              <div className="eyebrow good">Lezione completata</div>
              <h2>{unit.title}: {lessonName}</h2>
              <div className="score">
                <div><b>{summary.pct}%</b><span>precisione</span></div>
                <div><b>+{summary.gained}</b><span>XP</span></div>
                <div><b>{summary.streak}</b><span>giorni di fila</span></div>
              </div>
              <p className="note">I progressi sono salvati su questo dispositivo.</p>
            </div>
          ) : (
            <div key={i}>{Body()}</div>
          )}
        </div>
      </div>
      <div className={`foot ${footClass}`}>
        <div className="wrap foot-in">
          {summary ? (
            <>
              <div className="msg" />
              {onNext && <button type="button" className="btn ghost" onClick={onExit}>Torna al corso</button>}
              <button type="button" className="btn" autoFocus onClick={onNext ?? onExit}>{onNext ? "Prossima lezione" : "Torna al corso"}</button>
            </>
          ) : verdict !== null ? (
            <>
              <div className="msg" lang={lang}>
                <b>{verdict ? "Esatto" : "Non proprio"}</b>
                <span>{verdict ? "" : "Risposta: "}<strong>{display(ex.item, lang)}</strong> · {ex.item.it}</span>
              </div>
              <button type="button" className="btn" autoFocus onClick={advance}>Continua</button>
            </>
          ) : (
            <>
              <div className="msg">{ex.type === "intro" && <span>Guarda e ascolta.</span>}</div>
              {(ex.type !== "speak" || action) && (
                <button type="button" className="btn" disabled={!action} onClick={() => action?.()}>
                  {ex.type === "intro" ? "Avanti" : ex.type === "speak" ? "Vai avanti" : "Controlla"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
