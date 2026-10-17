import type { Course } from "./types";

// Clinical English for Italian-speaking clinicians. Phrases use the formal
// register ("Lei") in the Italian glosses, as used with patients.
export const medical: Course = {
  id: "medical",
  title: "Inglese medico",
  desc: "Anamnesi, esame neurologico e ictus",
  langs: ["en"],
  mode: "meaning",
  units: [
    {
      id: "history",
      title: "Anamnesi",
      sub: "Le domande al paziente",
      items: [
        { id: "onset", pic: "🕒", it: "Quando sono iniziati i sintomi?", t: { en: "When did the symptoms start?" } },
        { id: "headache", pic: "🤕", it: "Ha mal di testa?", t: { en: "Do you have a headache?" } },
        { id: "meds", pic: "💊", it: "Quali farmaci prende?", t: { en: "What medications do you take?" } },
        { id: "allergy", pic: "⚠️", it: "È allergico a qualcosa?", t: { en: "Are you allergic to anything?" } },
        { id: "thinners", pic: "🩸", it: "Prende farmaci che fluidificano il sangue?", t: { en: "Do you take blood thinners?" } },
        { id: "bp", pic: "🫀", it: "Soffre di pressione alta?", t: { en: "Do you have high blood pressure?" } },
        { id: "smoke", pic: "🚬", it: "Fuma?", t: { en: "Do you smoke?" } },
        { id: "companion", pic: "👪", it: "C'è qualcuno con Lei?", t: { en: "Is there anyone with you?" } },
      ],
      sentences: [
        { id: "lkw", pic: "🕒👀", it: "Quando è stato visto l'ultima volta in buone condizioni?", t: { en: "When were you last seen well?" } },
        { id: "point", pic: "👉🤕", it: "Mi indichi dove Le fa male", t: { en: "Point to where it hurts" } },
      ],
    },
    {
      id: "neuro-exam",
      title: "Esame neurologico",
      sub: "Le istruzioni durante la visita",
      items: [
        { id: "squeeze", pic: "✊", it: "Mi stringa le mani", t: { en: "Squeeze my hands" } },
        { id: "arms", pic: "🙌", it: "Alzi entrambe le braccia", t: { en: "Raise both arms" } },
        { id: "teeth", pic: "😁", it: "Mi mostri i denti", t: { en: "Show me your teeth" } },
        { id: "follow", pic: "👆", it: "Segua il mio dito", t: { en: "Follow my finger" } },
        { id: "look", pic: "👁️", it: "Guardi il mio naso", t: { en: "Look at my nose" } },
        { id: "leg", pic: "🦵", it: "Sollevi la gamba", t: { en: "Lift your leg" } },
        { id: "touch-nose", pic: "👃", it: "Si tocchi il naso", t: { en: "Touch your nose" } },
        { id: "repeat", pic: "🗣️", it: "Ripeta dopo di me", t: { en: "Repeat after me" } },
      ],
      sentences: [
        { id: "drift", pic: "🙈🙌", it: "Chiuda gli occhi e tenga le braccia tese", t: { en: "Close your eyes and hold your arms out" } },
        { id: "feel", pic: "🖐️❓", it: "Sente questo?", t: { en: "Can you feel this?" } },
      ],
    },
    {
      id: "stroke",
      title: "Ictus",
      sub: "Sintomi e percorso in urgenza",
      items: [
        { id: "stroke", pic: "🧠", it: "l'ictus", t: { en: "stroke" } },
        { id: "weakness", pic: "💪", it: "la debolezza, il deficit di forza", t: { en: "weakness" } },
        { id: "numbness", pic: "🖐️", it: "l'intorpidimento", t: { en: "numbness" } },
        { id: "slurred", pic: "🗣️", it: "la parola impastata (disartria)", t: { en: "slurred speech" } },
        { id: "droop", pic: "😐", it: "l'asimmetria del volto", t: { en: "facial droop" } },
        { id: "ct", pic: "🩻", it: "la TC", t: { en: "CT scan" } },
        { id: "lysis", pic: "💉", it: "la trombolisi", t: { en: "thrombolysis" } },
        { id: "thrombectomy", pic: "🩺", it: "la trombectomia", t: { en: "thrombectomy" } },
      ],
      sentences: [
        { id: "left-weak", pic: "🧍💪", it: "Il paziente ha un deficit di forza a sinistra", t: { en: "The patient has left-sided weakness" } },
        { id: "ct-now", pic: "🩻⏱️", it: "Ci serve subito una TC", t: { en: "We need a CT scan now" } },
      ],
    },
  ],
};
