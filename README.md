# DevPath Mobile Learning

DevPath ist eine mobile-first PWA für angehende Entwickler. Die App ist vom schnellen Lernrhythmus bekannter Coding-Apps inspiriert, setzt aber stärker auf echte Entwicklerpraxis: kurze Theorie, korrekte Codebeispiele, direkte Quiz-Rückmeldung, Praxisaufgaben, XP, Streaks, Projekte und Fortschrittstracking.

Wichtig: Die Lerninhalte und Erklärungen sind auf Deutsch. Code, Dateinamen, TypeScript-Modelle, Variablen, Funktionen und Codebeispiele bleiben bewusst auf Englisch und syntaktisch korrekt.

## Stack

- React, TypeScript, Vite
- Tailwind CSS
- React Router
- Context API für lokalen State
- localStorage für Fortschritt
- Vitest für Verhaltenstests
- PWA Manifest und Service Worker

## Lokal starten

```bash
npm install
npm run dev
```

Danach die lokale Vite-URL öffnen, normalerweise `http://localhost:5173` oder `http://127.0.0.1:5173`.

Falls der Browser nach Änderungen eine leere alte Ansicht zeigt, einmal hart neu laden oder alte Website-Daten für localhost löschen. Im Dev-Modus meldet die App alte Service-Worker-Registrierungen automatisch ab.

## Nützliche Befehle

```bash
npm test
npm run lint
npm run build
npm run preview
```

## Produktkonzept

Version 1 läuft komplett lokal, fühlt sich auf dem Smartphone wie eine App an und skaliert responsiv bis zum Desktop:

- Dashboard mit Weiterlernen-Karte und Tageszielen
- responsive App-Shell: Bottom Navigation auf dem Handy, Sidebar auf Laptop und Desktop
- sieben Kurs-Tracks: Python, C#, Java, HTML, CSS, JavaScript und AI Automation
- Python als vertiefter Track mit 39 Lektionen über Grundlagen, Collections, Dateien, moderne Sprache, APIs, Daten, Testing und Automatisierung
- mindestens drei Module und drei Lektionen pro Kurs
- jede Lektion enthält Theorie, Codebeispiel, Lückentext-Aufgabe, zwei Quizfragen, eine Schreibaufgabe und eine Praxisaufgabe
- Lesson-Navigation mit Schrittleiste auf dem Handy und Step-Sidebar auf dem Desktop
- Code-Schreibmodus mit lokalem Feedback: Syntaxhinweise, Konzeptchecks und Fortschrittswert für fast richtige Lösungen
- Quizmodus mit Schwierigkeitsfiltern und Wiederholung falscher Fragen
- XP, Level, Streak und Kursfortschritt
- Tagesziele als Daily Quests mit einmaligem Bonus-XP pro Tag
- Badges für Lektionen, Streaks, Level, Quizleistung und Kursabschlüsse
- motivierender Erfolgsbildschirm nach jeder Lektion mit XP, Level-Fortschritt, neuen Badges und Sprung zur nächsten Lektion
- Praxisprojekte mit Anforderungen, Hinweisen und Lösungsnotizen
- Profil mit Badge-Übersicht, Fortschritt und Einstellungen
- Dark Mode als Standard mit optionalem Light Mode
- PWA-Grundstruktur

## Architektur

Kursinhalte liegen in `src/data/courses.ts` und nutzen die Domain-Modelle aus `src/models/learning.ts`. Quizfragen, Lückentexte und Coding-Challenges werden deterministisch aus kompakten Lesson-Seeds generiert; die korrekte Quizoption liegt dabei nicht immer an derselben Position. Die Fortschrittslogik inklusive Tageszielen und Bonus-XP liegt in `src/services/progressService.ts`; `src/services/badgeService.ts` leitet Badges direkt aus dem Fortschritt ab, ohne zusätzlichen Speicher. `src/store/ProgressContext.tsx` verbindet alles mit React und localStorage.

Die Code-Schreibaufgaben werden aus den Kursdaten erzeugt und in `src/services/codeFeedbackService.ts` lokal geprüft. Die Prüfung ersetzt keine echte Sandbox, gibt aber sofort Hilfe bei offenen Klammern, fehlenden Strings und wichtigen Konzepten wie `return`, `fetch`, semantischem HTML oder Automation-Feldern wie `trigger` und `steps`.

Die App-Shell in `src/components/AppShell.tsx` rendert auf dem Handy eine Bottom Navigation und ab Laptop-Breite eine feste Sidebar; die Lektionsseite ergänzt auf dem Desktop eine eigene Step-Sidebar. UI-Erklärungen und Lerninhalte bleiben auf Deutsch, Code und Bezeichner auf Englisch.

Die Struktur ist so vorbereitet, dass später ein Backend die lokalen Datenservices ersetzen kann. Seitenkomponenten bleiben für Darstellung und Interaktion zuständig; Persistenz, Scoring, Code-Feedback und Fortschrittsregeln liegen in Services.

## Backend-Roadmap

Version 2 kann ergänzen:

- FastAPI oder ASP.NET Core REST API
- PostgreSQL
- Login und Sessions
- serverseitige Fortschrittssynchronisierung
- Adminbereich für Lektionen und Quizfragen
- Content-Versionierung

Mögliche API-Struktur:

- `GET /courses`
- `GET /courses/:courseId`
- `GET /lessons/:lessonId`
- `POST /progress/lessons/:lessonId/complete`
- `POST /quiz/attempts`
- `GET /me/progress`
- `PATCH /me/settings`

Version 3 kann ergänzen:

- KI-Tutor
- tiefere Codeanalyse mit Parsern oder sicherer Sandbox
- personalisierte Lernpfade
- echte Coding Sandbox für Python, JavaScript und später weitere Sprachen
- Automation-Lab mit Make/Zapier/n8n-ähnlichen Workflow-Übungen
- Zertifikate
- bewerbungsorientierte Lernpfade

## Hinweis

Die erste Version verzichtet bewusst auf Backend-Abhängigkeiten. Dadurch bleibt die Portfolio-Demo leicht startbar, während die Codegrenzen für eine spätere API sauber bleiben.
