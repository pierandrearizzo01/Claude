// Browser speech synthesis (listening) and recognition (speaking practice).

interface RecognitionResultList {
  length: number;
  [i: number]: { length: number; [j: number]: { transcript: string } };
}
interface Recognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: { results: RecognitionResultList }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}
type RecognitionCtor = new () => Recognition;

const w = typeof window === "undefined" ? undefined : (window as unknown as Record<string, unknown>);
const RecognitionImpl = (w?.SpeechRecognition ?? w?.webkitSpeechRecognition) as RecognitionCtor | undefined;

export const canSpeak = !!w && "speechSynthesis" in w;
export const canRecognize = !!RecognitionImpl;

export function speak(text: string, voiceLang: string, rate = 0.9): void {
  if (!canSpeak) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voiceLang;
    u.rate = rate;
    const prefix = voiceLang.slice(0, 2);
    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.replace("_", "-") === voiceLang) ?? voices.find(v => v.lang.startsWith(prefix));
    if (voice) u.voice = voice;
    speechSynthesis.speak(u);
  } catch {
    // Speech is a convenience; the text stays visible.
  }
}

export type RecognitionError = "mic-denied" | "unsupported" | "network" | "failed";

export interface Listening {
  result: Promise<string[]>;
  stop(): void;
}

/** Records one utterance and resolves with the recogniser's alternatives. */
export function listen(voiceLang: string, timeoutMs = 8000): Listening {
  if (!RecognitionImpl) return { result: Promise.reject<string[]>("unsupported" as RecognitionError), stop() {} };
  const rec = new RecognitionImpl();
  rec.lang = voiceLang;
  rec.interimResults = false;
  rec.continuous = false;
  rec.maxAlternatives = 5;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const result = new Promise<string[]>((resolve, reject) => {
    const heard: string[] = [];
    rec.onresult = e => {
      for (let i = 0; i < e.results.length; i++)
        for (let j = 0; j < e.results[i].length; j++) heard.push(e.results[i][j].transcript);
    };
    rec.onerror = e => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      const err: RecognitionError =
        e.error === "not-allowed" || e.error === "service-not-allowed" ? "mic-denied" : e.error === "network" ? "network" : "failed";
      reject(err);
    };
    rec.onend = () => {
      clearTimeout(timer);
      resolve(heard);
    };
  });
  try {
    rec.start();
    timer = setTimeout(() => rec.stop(), timeoutMs);
  } catch {
    return { result: Promise.reject<string[]>("failed" as RecognitionError), stop() {} };
  }
  return { result, stop: () => rec.stop() };
}
