import { useEffect, useRef, useState } from "react";
import { LANGS } from "../content/languages";
import type { Course, Item, LangCode } from "../content/types";
import type { Exercise } from "../lib/lesson";
import { scoreAttempt, type Attempt } from "../lib/match";
import { canRecognize, listen, speak, type RecognitionError } from "../lib/speech";
import { display, joinTokens } from "../lib/text";
import { SpeakButton } from "./Speak";

export interface ExerciseProps<E extends Exercise = Exercise> {
  ex: E;
  course: Course;
  lang: LangCode;
  /** Registers the action of the footer button, or null to disable it. */
  setAction: (action: (() => void) | null) => void;
  onGraded: (correct: boolean) => void;
  graded: boolean;
}

const Romaji = ({ item, lang }: { item: Item; lang: LangCode }) =>
  lang === "ja" && item.ja ? <span className="romaji">{item.ja.romaji}</span> : null;

function Prompt({ item, lang, hideText }: { item: Item; lang: LangCode; hideText?: boolean }) {
  const text = display(item, lang);
  return (
    <div className="prompt">
      <SpeakButton text={text} voice={LANGS[lang].voice} large label={hideText ? "Riascolta" : "Ascolta"} />
      {!hideText && (
        <div className="prompt-text" lang={lang}>
          <span className="word">{text}</span>
          <Romaji item={item} lang={lang} />
        </div>
      )}
    </div>
  );
}

export function Intro({ ex, course, lang, setAction, onGraded }: ExerciseProps<Extract<Exercise, { type: "intro" }>>) {
  useEffect(() => {
    speak(display(ex.item, lang), LANGS[lang].voice);
    setAction(() => onGraded(true));
  }, [ex]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <p className="kind">Nuova {ex.item.t[lang]?.includes(" ") && course.mode === "meaning" ? "frase" : "parola"}</p>
      <div className="intro-card">
        <div className="hero-pic" aria-hidden="true">{ex.item.pic}</div>
        <Prompt item={ex.item} lang={lang} />
        {course.mode === "meaning" && <p className="gloss">{ex.item.it}</p>}
      </div>
    </>
  );
}

function Choices({
  options, correct, render, textual, setAction, onGraded, graded,
}: {
  options: Item[]; correct: Item; render: (o: Item) => React.ReactNode; textual: boolean;
  setAction: ExerciseProps["setAction"]; onGraded: ExerciseProps["onGraded"]; graded: boolean;
}) {
  const [sel, setSel] = useState<number | null>(null);
  useEffect(() => {
    setAction(sel === null ? null : () => onGraded(options[sel] === correct));
  }, [sel]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="grid4">
      {options.map((o, k) => {
        const state = graded ? (o === correct ? "right" : k === sel ? "wrong" : "") : k === sel ? "selected" : "";
        return (
          <button key={o.id} type="button" className={`choice ${textual ? "textual" : ""} ${state}`} disabled={graded}
            aria-pressed={k === sel} aria-label={textual ? undefined : `Immagine ${k + 1}`} onClick={() => setSel(k)}>
            {render(o)}
          </button>
        );
      })}
    </div>
  );
}

export function Pick(props: ExerciseProps<Extract<Exercise, { type: "pick" }>>) {
  const { ex, course, lang } = props;
  const meaning = course.mode === "meaning";
  useEffect(() => speak(display(ex.item, lang), LANGS[lang].voice), [ex]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <p className="kind">
        {ex.audioOnly ? (meaning ? "Ascolta e scegli il significato" : "Ascolta e scegli l'immagine") : meaning ? "Che cosa significa?" : "Scegli l'immagine giusta"}
      </p>
      <Prompt item={ex.item} lang={lang} hideText={ex.audioOnly} />
      <Choices {...props} options={ex.options} correct={ex.item} textual={meaning}
        render={o => (meaning ? <><span className="mini-pic" aria-hidden="true">{o.pic}</span>{o.it}</> : o.pic)} />
    </>
  );
}

export function Reverse(props: ExerciseProps<Extract<Exercise, { type: "reverse" }>>) {
  const { ex, course, lang } = props;
  return (
    <>
      <p className="kind">Come si dice?</p>
      <div className="hero-pic" aria-hidden="true">{ex.item.pic}</div>
      {course.mode === "meaning" && <p className="gloss strong">{ex.item.it}</p>}
      <Choices {...props} options={ex.options} correct={ex.item} textual
        render={o => <span lang={lang}>{display(o, lang)}<Romaji item={o} lang={lang} /></span>} />
    </>
  );
}

export function Build({ ex, course, lang, setAction, onGraded, graded }: ExerciseProps<Extract<Exercise, { type: "build" }>>) {
  const [picked, setPicked] = useState<number[]>([]);
  const target = display(ex.item, lang);
  useEffect(() => {
    setAction(picked.length === ex.bank.length ? () => onGraded(joinTokens(picked.map(i => ex.bank[i]), lang) === target) : null);
  }, [picked]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <p className="kind">{course.mode === "meaning" ? "Traduci componendo la frase" : "Componi la frase che descrive la scena"}</p>
      <div className="scene" aria-hidden="true">{ex.item.pic}</div>
      {course.mode === "meaning" && <p className="gloss strong">{ex.item.it}</p>}
      <div className="slot" aria-label="La tua frase" lang={lang}>
        {picked.map((i, p) => (
          <button key={i} type="button" className="chip" disabled={graded} onClick={() => setPicked(picked.filter((_, q) => q !== p))}>
            {ex.bank[i]}
          </button>
        ))}
      </div>
      <div className="bank" lang={lang}>
        {ex.bank.map((t, i) => (
          <button key={i} type="button" className="chip" disabled={graded || picked.includes(i)} onClick={() => setPicked([...picked, i])}>
            {t}
          </button>
        ))}
      </div>
    </>
  );
}

const ERRORS: Record<RecognitionError, string> = {
  "mic-denied": "Il microfono non è autorizzato. Consenti l'accesso nelle impostazioni del browser e riprova.",
  unsupported: "Questo browser non riconosce la voce.",
  network: "Il riconoscimento vocale richiede una connessione a internet.",
  failed: "Non è stato possibile avviare il riconoscimento. Riprova.",
};

export function Speak({ ex, course, lang, setAction, onGraded, graded }: ExerciseProps<Extract<Exercise, { type: "speak" }>>) {
  const text = display(ex.item, lang);
  const voice = LANGS[lang].voice;
  const [state, setState] = useState<"idle" | "listening" | "done">("idle");
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [tries, setTries] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const stopRef = useRef<() => void>(() => {});

  useEffect(() => {
    speak(text, voice);
    // Without recognition the learner judges their own attempt.
    setAction(null);
    return () => stopRef.current();
  }, [ex]); // eslint-disable-line react-hooks/exhaustive-deps

  async function record() {
    setError(null);
    setState("listening");
    const l = listen(voice);
    stopRef.current = l.stop;
    try {
      const heard = await l.result;
      const targets = lang === "ja" && ex.item.ja ? [text, ex.item.ja.kana] : [text];
      const a = scoreAttempt(targets, heard, lang);
      setAttempt(a);
      setTries(t => t + 1);
      setState("done");
      // Pass straight away; after two misses let the learner move on.
      if (a.passed) onGraded(true);
      else setAction(tries + 1 >= 2 ? () => onGraded(false) : null);
    } catch (e) {
      setError(ERRORS[(e as RecognitionError)] ?? ERRORS.failed);
      setState("idle");
    }
  }

  return (
    <>
      <p className="kind">Ascolta e ripeti ad alta voce</p>
      <div className="scene" aria-hidden="true">{ex.item.pic}</div>
      <Prompt item={ex.item} lang={lang} />
      {course.mode === "meaning" && <p className="gloss">{ex.item.it}</p>}
      {canRecognize ? (
        <div className="mic-row">
          <button type="button" className={"mic" + (state === "listening" ? " on" : "")} disabled={graded}
            onClick={() => (state === "listening" ? stopRef.current() : record())}
            aria-label={state === "listening" ? "Interrompi la registrazione" : "Parla"}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-2.1A7 7 0 0 0 19 12z" /></svg>
          </button>
          <div className="mic-status" aria-live="polite">
            {state === "listening" && <b>Ti ascolto…</b>}
            {state === "idle" && !attempt && <span>Tocca il microfono e pronuncia la frase.</span>}
            {attempt && state !== "listening" && (
              <>
                <b>{attempt.heard ? `Ho sentito: “${attempt.heard}”` : "Non ho sentito nulla"}</b>
                <span>Corrispondenza {Math.round(attempt.score * 100)}%{!attempt.passed && !graded ? " · riprova" : ""}</span>
              </>
            )}
            {error && <span className="error">{error}</span>}
          </div>
        </div>
      ) : (
        <div className="self-check">
          <p>Questo browser non riconosce la voce. Ripeti la frase e valuta tu stesso.</p>
          <div className="row">
            <button type="button" className="btn ghost" disabled={graded} onClick={() => onGraded(false)}>Da ripetere</button>
            <button type="button" className="btn" disabled={graded} onClick={() => onGraded(true)}>L'ho detta bene</button>
          </div>
        </div>
      )}
    </>
  );
}
