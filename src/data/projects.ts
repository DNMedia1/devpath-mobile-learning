import type { PracticeProject } from '../models/learning';

export const projects: PracticeProject[] = [
  {
    id: 'python-todo-cli',
    courseId: 'python',
    title: 'To-do CLI',
    difficulty: 'basic',
    duration: '45-60 Min.',
    summary: 'Baue ein Kommandozeilen-Tool, das Tasks hinzufuegt, auflistet und abschliesst.',
    requirements: ['Speichere Tasks in einer JSON-Datei.', 'Unterstuetze add, list und complete.', 'Gib hilfreiche Fehlermeldungen für unbekannte Commands aus.'],
    hints: ['Nutze pathlib für Dateizugriff.', 'Trenne Parsing von Task-Logik.'],
    solutionNotes: ['Eine gute Lösung hat einen Task-Typ, load/save-Helfer und einen kleinen Command Dispatcher.']
  },
  {
    id: 'python-fastapi-mini-api',
    courseId: 'python',
    title: 'FastAPI Mini API',
    difficulty: 'intermediate',
    duration: '90 Min.',
    summary: 'Erstelle eine kleine REST API für Lektionen und Fortschritt.',
    requirements: ['Expose GET /lessons.', 'Expose POST /progress.', 'Validiere Request Bodies mit Pydantic.'],
    hints: ['Starte mit In-Memory-Daten.', 'Nutze typisierte Response Models.'],
    solutionNotes: ['Lege Datenzugriff hinter ein Repository, damit PostgreSQL später leicht folgen kann.']
  },
  {
    id: 'csharp-console-tracker',
    courseId: 'csharp',
    title: 'Console XP Tracker',
    difficulty: 'basic',
    duration: '45 Min.',
    summary: 'Tracke abgeschlossene Lektionen und XP in einer C# Konsolen-App.',
    requirements: ['Erstelle LessonProgress und UserProfile Klassen.', 'Vergib XP nur einmal pro Lektion.', 'Gib eine Level-Zusammenfassung aus.'],
    hints: ['Nutze List<T> und LINQ für Auswertungen.', 'Halte XP-Logik in einem Service.'],
    solutionNotes: ['Completion sollte idempotent sein, genau wie in dieser Web-App.']
  },
  {
    id: 'csharp-aspnet-api',
    courseId: 'csharp',
    title: 'ASP.NET Core Progress API',
    difficulty: 'intermediate',
    duration: '2 Std.',
    summary: 'Entwirf Endpunkte für Kursfortschritt mit EF-Core-faehigen Modellen.',
    requirements: ['Erstelle einen ProgressController.', 'Füge DTOs für Completion Requests hinzu.', 'Gib bei Erfolg 204 zurück.'],
    hints: ['Halte Controller schlank.', 'Nutze Services für Regeln.'],
    solutionNotes: ['Die Datenbank sollte doppelte Completion Rows verhindern.']
  },
  {
    id: 'java-oop-kata',
    courseId: 'java',
    title: 'OOP Badge Kata',
    difficulty: 'basic',
    duration: '60 Min.',
    summary: 'Vergib Badges basierend auf abgeschlossenen Lektionen.',
    requirements: ['Erstelle Badge, Learner und BadgeService.', 'Vergib Starter ab 3 Lektionen.', 'Verhindere doppelte Badges.'],
    hints: ['Nutze Set für Eindeutigkeit.', 'Schreibe einfache Service-Tests.'],
    solutionNotes: ['Komposition ist für diese Aufgabe robuster als Vererbung.']
  },
  {
    id: 'java-spring-rest',
    courseId: 'java',
    title: 'Spring Boot REST API',
    difficulty: 'intermediate',
    duration: '2 Std.',
    summary: 'Expose Lektionen und Quizversuche über Spring Boot Endpunkte.',
    requirements: ['Erstelle Controller für lessons und attempts.', 'Füge Service-Klassen hinzu.', 'Gib sinnvolle HTTP-Statuscodes zurück.'],
    hints: ['Trenne DTOs von Entities.', 'Starte ohne Datenbank.'],
    solutionNotes: ['Eine spätere Version kann Spring Data Repositories ergänzen.']
  },
  {
    id: 'html-landing-page',
    courseId: 'html',
    title: 'Semantische Landingpage',
    difficulty: 'basic',
    duration: '45 Min.',
    summary: 'Baue eine semantische Seite für einen fiktiven Kurs.',
    requirements: ['Nutze header, main, section, article und footer.', 'Füge eine zugängliche Navigation hinzu.', 'Nutze sinnvolle Heading-Level.'],
    hints: ['Schreibe zuerst die Struktur, dann Styling.', 'Prüfe die Heading-Outline.'],
    solutionNotes: ['Das HTML sollte auch ohne CSS verstaendlich bleiben.']
  },
  {
    id: 'css-responsive-cards',
    courseId: 'css',
    title: 'Responsive Card Layout',
    difficulty: 'basic',
    duration: '60 Min.',
    summary: 'Erstelle ein responsives Card Grid mit Flexbox und CSS Grid.',
    requirements: ['Mobile: einspaltiges Layout.', 'Breitere Screens: zwei Spalten.', 'Sichtbare Focus States.'],
    hints: ['Nutze gap und minmax.', 'Vermeide fixe Card-Breiten.'],
    solutionNotes: ['Stabile Abstände sind wichtiger als laute Dekoration.']
  },
  {
    id: 'javascript-quiz-app',
    courseId: 'javascript',
    title: 'Quiz App',
    difficulty: 'basic',
    duration: '90 Min.',
    summary: 'Baue ein Browser-Quiz mit direktem Feedback.',
    requirements: ['Rendere Fragen aus einem Array.', 'Tracke ausgewählte Antworten.', 'Zeige Score und Erklärungen.'],
    hints: ['Trenne Fragendaten von UI-Code.', 'Nutze kleine Komponenten oder Event Delegation.'],
    solutionNotes: ['Das ist ein guter Zwischenschritt zu React State Management.']
  },
  {
    id: 'javascript-fetch-app',
    courseId: 'javascript',
    title: 'Fetch API Explorer',
    difficulty: 'intermediate',
    duration: '90 Min.',
    summary: 'Lade API-Daten und rendere Loading-, Success- und Error-State.',
    requirements: ['Nutze async/await.', 'Prüfe response.ok.', 'Zeige Retry nach Fehlern.'],
    hints: ['Schreibe einen Fetch Helper.', 'Halte Loading State explizit.'],
    solutionNotes: ['Zuverlässige UI entsteht vor allem durch klares State Modeling.']
  },
  {
    id: 'typescript-domain-models',
    courseId: 'typescript',
    title: 'Typed Learning Domain',
    difficulty: 'intermediate',
    duration: '75 Min.',
    summary: 'Modelliere Kurse, Lektionen, Fortschritt und API-Ergebnisse mit sicheren TypeScript-Typen.',
    requirements: ['Definiere Union Types für Statuswerte.', 'Nutze Interfaces für Course, Lesson und Progress.', 'Modelliere API-Erfolg und Fehler als discriminated union.'],
    hints: ['Starte mit den echten Begriffen aus der App.', 'Vermeide any an API-Grenzen.'],
    solutionNotes: ['Eine starke Lösung macht ungültige Zustände schwer darstellbar und zwingt Fehlerfälle sichtbar in die UI.']
  },
  {
    id: 'react-lesson-dashboard',
    courseId: 'react',
    title: 'Lesson Dashboard',
    difficulty: 'intermediate',
    duration: '2 Std.',
    summary: 'Baue ein React-Dashboard mit Kurskarten, Fortschritt, Loading State und Antwortauswahl.',
    requirements: ['Rendere Kurskarten aus Props.', 'Verwalte ausgewählte Antworten mit State.', 'Zeige Loading, Error und Success State.'],
    hints: ['Halte Card, List und Page getrennt.', 'Berechne Fortschritt aus vorhandenen Daten.'],
    solutionNotes: ['Die beste Lösung trennt Datenfluss und UI-Komponenten, ohne unnötig viele Wrapper zu erzeugen.']
  },
  {
    id: 'git-release-workflow',
    courseId: 'git',
    title: 'Feature Release Workflow',
    difficulty: 'basic',
    duration: '45 Min.',
    summary: 'Simuliere einen sauberen Git-Workflow von Branch über Commit bis Pull Request.',
    requirements: ['Erstelle einen Feature-Branch.', 'Stage nur zusammengehörige Dateien.', 'Formuliere eine klare PR-Beschreibung mit Tests.'],
    hints: ['Nutze git status vor jedem großen Schritt.', 'Prüfe lokale Commits vor dem Push.'],
    solutionNotes: ['Ein guter Workflow macht nachvollziehbar, warum eine Änderung passiert ist und wie sie geprüft wurde.']
  },
  {
    id: 'sql-progress-schema',
    courseId: 'sql',
    title: 'Progress Database Schema',
    difficulty: 'intermediate',
    duration: '90 Min.',
    summary: 'Entwirf Tabellen und Queries für gespeicherten Lernfortschritt.',
    requirements: ['Erstelle Tabellen für Profile, Lessons und Progress.', 'Verhindere doppelte Completions per Primary Key.', 'Schreibe Queries für Dashboard und Streak-Auswertung.'],
    hints: ['Starte mit Zugriffsmustern der App.', 'Indexiere User- und Zeitfilter bewusst.'],
    solutionNotes: ['Das Schema sollte Fachregeln in Constraints ausdrücken, nicht nur im Anwendungscode.']
  },
  {
    id: 'backend-progress-api',
    courseId: 'backend',
    title: 'Progress API Slice',
    difficulty: 'advanced',
    duration: '2-3 Std.',
    summary: 'Implementiere einen API-Slice für Lesson Completion mit Validierung, Service und Repository-Grenze.',
    requirements: ['Expose POST /lessons/:lessonId/complete.', 'Validiere Request Body und Auth-Kontext.', 'Kapsle Speicherung hinter einem Repository Interface.'],
    hints: ['Teste die Service-Funktion ohne HTTP.', 'Plane klare Fehler für Not Found und Validation.'],
    solutionNotes: ['Eine robuste Lösung trennt Route, Validation, Service und Persistence so, dass Supabase später sauber angeschlossen werden kann.']
  },
  {
    id: 'automation-lead-router',
    courseId: 'automation',
    title: 'Lead Routing Automation',
    difficulty: 'basic',
    duration: '60 Min.',
    summary: 'Plane einen Make- oder Zapier-Flow, der neue Leads prüft, mapped und als CRM-Aufgabe anlegt.',
    requirements: ['Definiere Trigger, Actions und Zielsystem.', 'Mappe Name, E-Mail und Lead-Quelle sauber.', 'Lege eine Fehlerbenachrichtigung für fehlende Pflichtfelder an.'],
    hints: ['Starte mit einem kleinen JSON-Flow.', 'Trenne Datenmapping von der eigentlichen CRM-Action.'],
    solutionNotes: ['Ein guter Flow ist nachvollziehbar, idempotent und lässt sich mit einem Beispiel-Lead testen.']
  },
  {
    id: 'automation-ai-ticket-agent',
    courseId: 'automation',
    title: 'AI Ticket Agent',
    difficulty: 'intermediate',
    duration: '2 Std.',
    summary: 'Entwirf einen Agentic Workflow, der Supporttickets zusammenfasst und Aufgaben mit menschlicher Freigabe vorbereitet.',
    requirements: ['Formuliere System-Prompt und dynamischen Input.', 'Definiere einen Tool Call zum Erstellen einer Aufgabe.', 'Baue Human-in-the-loop vor dem Versand ein.'],
    hints: ['Begrenze Tool-Parameter auf klare Felder.', 'Logge Ergebnis und Fehler, aber keine sensiblen Daten.'],
    solutionNotes: ['Die beste Lösung lässt KI Entwürfe vorbereiten, aber riskante Aktionen erst nach Approval ausführen.']
  }
];
