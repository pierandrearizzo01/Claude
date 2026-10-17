import { canSpeak, speak } from "../lib/speech";

export function SpeakButton({ text, voice, large, label = "Ascolta" }: { text: string; voice: string; large?: boolean; label?: string }) {
  if (!canSpeak) return null;
  return (
    <button type="button" className={"speak" + (large ? " large" : "")} aria-label={label} onClick={() => speak(text, voice)}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z" />
      </svg>
    </button>
  );
}
