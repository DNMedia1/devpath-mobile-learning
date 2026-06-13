# CodingDojo Mobile Learning

CodingDojo ist eine mobile-first PWA für angehende Entwickler. Die App ist vom schnellen Lernrhythmus bekannter Coding-Apps inspiriert, setzt aber stärker auf echte Entwicklerpraxis: kurze Theorie, korrekte Codebeispiele, direkte Quiz-Rückmeldung, Praxisaufgaben, XP, Streaks, Projekte und Fortschrittstracking.

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
- Heute-Lernen-Karte mit fälligen Wiederholungen, empfohlener nächster Lektion, Mini-Code-Challenge und Tagesziel-Fortschritt
- responsive App-Shell: Bottom Navigation auf dem Handy, Sidebar auf Laptop und Desktop
- zwölf Kurs-Tracks: Python, C#, Java, HTML, CSS, JavaScript, TypeScript, React, Git & GitHub, SQL, Backend APIs und AI Automation
- Python als vertiefter Track mit 39 Lektionen über Grundlagen, Collections, Dateien, moderne Sprache, APIs, Daten, Testing und Automatisierung
- zusätzliche Fullstack-Tracks vertiefen JavaScript/TypeScript, React, Git-Workflows, SQL-Datenmodellierung und Backend-API-Design
- mindestens drei Module und drei Lektionen pro Kurs
- jede Lektion enthält Theorie, vier Wissenspunkte, Codebeispiel, Lückentext-Aufgabe, vier Multiple-Choice-Fragen, eine Schreibaufgabe und eine Praxisaufgabe
- Lesson-Navigation mit Schrittleiste auf dem Handy und Step-Sidebar auf dem Desktop
- Code-Schreibmodus mit lokalem Feedback: Syntaxhinweise, Konzeptchecks und Fortschrittswert für fast richtige Lösungen
- Modul-Boss-Fights als Abschluss-Challenges mit kombinierten Skills und eigenem XP-Abschluss
- Quizmodus mit Schwierigkeitsfiltern und Wiederholung falscher Fragen
- XP, Level, Streak und Kursfortschritt
- Tagesziele als Daily Quests mit einmaligem Bonus-XP pro Tag
- Badges für Lektionen, Streaks, Level, Quizleistung und Kursabschlüsse
- motivierender Erfolgsbildschirm nach jeder Lektion mit XP, Level-Fortschritt, neuen Badges und Sprung zur nächsten Lektion
- Praxisprojekte mit Anforderungen, Hinweisen und Lösungsnotizen
- integrierte Projekt-IDE mit CodeMirror, lokal gespeicherten Projektdateien und sprachspezifischem Autocomplete
- Profil mit Badge-Übersicht, Fortschritt und Einstellungen
- Dark Mode als Standard mit optionalem Light Mode
- PWA-Grundstruktur

## Architektur

Kursinhalte liegen in `src/data/courses.ts` und nutzen die Domain-Modelle aus `src/models/learning.ts`. Wissenspunkte, Quizfragen, Lückentexte und Coding-Challenges werden deterministisch aus kompakten Lesson-Seeds generiert; die korrekte Quizoption liegt dabei nicht immer an derselben Position. Die Fortschrittslogik inklusive Tageszielen und Bonus-XP liegt in `src/services/progressService.ts`; `src/services/badgeService.ts` leitet Badges direkt aus dem Fortschritt ab, ohne zusätzlichen Speicher. `src/store/ProgressContext.tsx` verbindet alles mit React und localStorage.

Die Code-Schreibaufgaben werden aus den Kursdaten erzeugt und in `src/services/codeFeedbackService.ts` lokal geprüft. Die Prüfung ersetzt keine echte Sandbox, gibt aber sofort Hilfe bei offenen Klammern, fehlenden Strings und wichtigen Konzepten wie `return`, `fetch`, `useState`, `git status`, `select`, `z.object`, semantischem HTML oder Automation-Feldern wie `trigger` und `steps`.

Die App-Shell in `src/components/AppShell.tsx` rendert auf dem Handy eine Bottom Navigation und ab Laptop-Breite eine feste Sidebar; die Lektionsseite ergänzt auf dem Desktop eine eigene Step-Sidebar. UI-Erklärungen und Lerninhalte bleiben auf Deutsch, Code und Bezeichner auf Englisch.

Die Kurskarten und Kursdetailseiten zeigen KI-generierte Coverbilder aus `public/course-art/`. Die Dateien folgen dem Schema `<courseId>.jpg` (zum Beispiel `python.jpg`); ein neues Bild einfach unter diesem Namen ablegen, fertig. Fehlt ein Bild, rendert `src/components/CourseArt.tsx` automatisch einen Gradient-Fallback im Kursfarbschema.

Die Projekt-IDE liegt in `src/components/ProjectIde.tsx` und wird auf der Projektseite lazy geladen. `src/services/projectIdeService.ts` ordnet jedem Praxisprojekt eine passende Sprache, Starterdatei und begrenzte Autocomplete-Liste zu, damit etwa SQL-Projekte SQL-Vorschläge bekommen und React-Projekte React/TSX-Vorschläge.

Die Heute-Lernen-Empfehlung liegt in `src/services/recommendationService.ts`. Sie priorisiert fällige Wiederholungen aus dem lokalen Review-Plan, findet die nächste offene Lektion und wählt eine kleine Code-Challenge aus den Exercise-Daten. Dadurch bleibt die Dashboard-Logik testbar und kann später durch serverseitige Personalisierung ersetzt werden.

Boss-Fights werden pro Modul aus vorhandenen Exercise-Daten generiert und kombinieren Konzeptfrage, Debugging und Mini-Projekt-Schritt. Der Abschluss wird über `completedBossFights` getrennt vom normalen Lektionsfortschritt gespeichert, damit Kursprozente nicht verfälscht werden.

Die Struktur ist so vorbereitet, dass später ein Backend die lokalen Datenservices ersetzen kann. Seitenkomponenten bleiben für Darstellung und Interaktion zuständig; Persistenz, Scoring, Code-Feedback, Empfehlungen und Fortschrittsregeln liegen in Services.

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

## Lizenz

Dieses Projekt steht unter der PolyForm Noncommercial License 1.0.0. Private, persönliche und nicht-kommerzielle Nutzung ist erlaubt.

Gewerbliche Nutzung ist nicht durch diese Lizenz abgedeckt. Dazu zählen insbesondere Verkauf, SaaS-Betrieb, Einbindung in Kundenprojekte, interne Unternehmensnutzung mit kommerziellem Zweck, kommerzielle Schulungen oder die Nutzung als Bestandteil eines kostenpflichtigen Produkts. Für solche Zwecke ist vorab eine separate schriftliche kommerzielle Lizenz von DNMedia1 erforderlich.

Wichtig: Diese Lizenz ist bewusst keine klassische Open-Source-Lizenz, weil kommerzielle Nutzung eingeschränkt wird.

## Hinweis

Die erste Version verzichtet bewusst auf Backend-Abhängigkeiten. Dadurch bleibt die Portfolio-Demo leicht startbar, während die Codegrenzen für eine spätere API sauber bleiben.
