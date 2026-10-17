# Parola

Installable web app (PWA) for learning languages by immersion, with an
Italian interface. Two courses:

- **Corso generale**: beginner vocabulary and sentences in English, Spanish,
  French, German and Japanese, taught through pictures with no translation
  during exercises.
- **Inglese medico**: clinical English for Italian clinicians (history-taking,
  neurological examination, stroke).

Each unit has four lessons: Scopri (see, hear, match), Ascolta (audio only),
Componi (recall words and build sentences) and Parla (pronunciation, checked
with the browser's speech recognition).

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (content, lesson builder, scoring, streaks)
npm run typecheck
npm run build      # production build with service worker in dist/
```

## Deployment

`.github/workflows/parola-pages.yml` tests, builds and publishes the app to
GitHub Pages on every push to `main` that touches `parola/`. Enable it once in
the repository settings: Settings → Pages → Build and deployment → Source:
GitHub Actions. The app is then served at
`https://<user>.github.io/<repo>/` and can be installed from the browser
("Add to Home Screen" on iOS, "Install app" on Chrome/Edge).

## How it works

- Content lives in `src/content/`. Each phrase stores its text per language;
  spaces in Japanese mark segment boundaries for sentence building and are
  removed on display. Japanese phrases also carry romaji and a hiragana
  reading, so a transcript in kana is accepted in place of kanji.
- `src/lib/match.ts` scores speech transcripts by longest common
  subsequence over words (characters for Japanese), ignoring case, accents and
  punctuation. 80% similarity passes; extra words lower the score.
- Progress, XP and the daily streak are stored in `localStorage` on the device.

## Limits

- Speech recognition availability depends on the browser: Chrome and Edge
  (which send audio to an online service), and Safari on iOS/macOS. Firefox has
  none, so Parla lessons fall back to self-assessment there.
- Voices for listening come from the device. Japanese and German need the
  matching system voice to be installed.
- The score checks that the right words were recognised, not accent quality.
