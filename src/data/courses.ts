import type { CodingConceptCheck, Course, CourseModule, Difficulty, FillBlankTask, LanguageId, Lesson, QuizOption } from '../models/learning';

type LessonSeed = {
  title: string;
  theory: string;
  code: string;
  task: string;
  bestPractice: string;
  trap: string;
  difficulty?: Difficulty;
};

type ModuleSeed = {
  title: string;
  description: string;
  lessons: LessonSeed[];
};

type CourseSeed = {
  id: LanguageId;
  title: string;
  shortName: string;
  description: string;
  accent: string;
  gradient: string;
  icon: string;
  codeLanguage: string;
  modules: ModuleSeed[];
};

const courseSeeds: CourseSeed[] = [
  course('python', 'Python', 'Py', 'Lesbare Scripts, Automatisierung, APIs und Backend-Grundlagen.', '#ffd94d', 'from-[#ffd94d] to-[#3674b5]', 'PY', 'python', [
    module('Grundlagen', 'Variablen, Bedingungen und Schleifen für alltägliche Scripts.', [
      lesson('Variablen und Typen', 'In Python zeigen Namen auf Werte, während der Typ am Wert selbst hängt. Wichtig ist deshalb, Daten klar zu benennen und kleine Transformationen sichtbar zu machen, bevor du Abstraktionen baust.', 'name = "Mina"\nage = 24\nis_active = True\nprint(f"{name} ships code at {age}")', 'Lege drei Variablen für ein Benutzerprofil an und gib einen formatierten Satz aus.', 'Nutze sprechende Namen und f-Strings.', 'Alles in einen langen String packen.'),
      lesson('Kontrollfluss', 'Bedingungen bilden fachliche Regeln ab. Gute Junior-Entwickler schreiben Bedingungen so, dass ein Reviewer die Absicht erkennt, ohne jede Zeile im Kopf ausführen zu müssen.', 'score = 82\nif score >= 90:\n    level = "advanced"\nelif score >= 60:\n    level = "ready"\nelse:\n    level = "practice"', 'Schreibe eine XP-Einstufung für unter 100, 100 bis 299 und ab 300 XP.', 'Ordne Bedingungen vom konkreten Fall zum Fallback.', 'Dieselbe Bedingung in jedem Zweig wiederholen.'),
      lesson('Listen und Schleifen', 'Schleifen sind für wiederholbare Arbeit über Collections da. Eine Schleife sollte idealerweise filtern, transformieren oder zusammenfassen; wenn sie alles gleichzeitig macht, ist sie meist zu groß.', 'tasks = ["read", "code", "review"]\nfor index, task in enumerate(tasks, start=1):\n    print(index, task.upper())', 'Gib drei Bug-Titel als nummerierte Triage-Liste aus.', 'Nutze enumerate, wenn die Position wichtig ist.', 'Drei fast gleiche print-Anweisungen schreiben.')
    ]),
    module('OOP und Dateien', 'Funktionen, Klassen und einfache Persistenz sauber strukturieren.', [
      lesson('Funktionen', 'Eine Funktion ist ein kleiner Vertrag: Eingaben hinein, Ergebnis heraus, Nebenwirkungen bewusst. So entsteht Code, der testbar, wiederverwendbar und in Reviews leichter zu beurteilen ist.', 'def calculate_total(prices):\n    return sum(prices)\n\nprint(calculate_total([12, 8, 5]))', 'Schreibe eine Funktion, die den Durchschnitt einer Zahlenliste zurückgibt.', 'Gib Werte zurück, statt direkt in der Funktion zu drucken.', 'Globale Variablen aus jeder Funktion heraus ändern.'),
      lesson('Klassen', 'Klassen lohnen sich, wenn Daten und Verhalten eine gemeinsame Regel beschreiben. Nutze sie nicht nur, weil eine Datei lang wird, sondern wenn ein echtes Konzept entsteht.', 'class Todo:\n    def __init__(self, title):\n        self.title = title\n        self.done = False\n\n    def complete(self):\n        self.done = True', 'Erstelle eine Task-Klasse mit title, priority und complete-Methode.', 'Kapsle Verhalten nah an den zugehörigen Daten.', 'Mehrere parallele globale Listen pflegen.'),
      lesson('Dateien lesen', 'Dateizugriff taucht in Tools, Migrationen und Automatisierung ständig auf. Explizite Pfade, Encoding und kleine Fehlerbehandlung verhindern viele schwer nachvollziehbare Bugs.', 'from pathlib import Path\ncontent = Path("notes.txt").read_text(encoding="utf-8")\nlines = content.splitlines()\nprint(len(lines))', 'Lies eine Textdatei und zähle alle nicht-leeren Zeilen.', 'Nutze pathlib und setze das Encoding bewusst.', 'Annehmen, dass das Arbeitsverzeichnis immer stimmt.')
    ]),
    module('Backend-Praxis', 'APIs, Framework-Konventionen und datenbanknahe Modelle.', [
      lesson('FastAPI-Routen', 'Eine API-Route sollte Eingaben validieren, fachliche Logik anstossen und eine klare Antwort liefern. Vermeide es, interne Details oder unstrukturierte Strings an Clients auszugeben.', 'from fastapi import FastAPI\napp = FastAPI()\n\n@app.get("/health")\ndef health():\n    return {"status": "ok"}', 'Skizziere eine FastAPI-Route, die Tasks als JSON zurückgibt.', 'Gib JSON-fähige Dictionaries oder Models zurück.', 'Konsolenausgaben als API-Antwort verwenden.'),
      lesson('Django-Grundlagen', 'Django bringt Routing, Templates, ORM, Admin und Auth bereits mit. Produktiv wirst du, wenn du die Konventionen verstehst, statt gegen das Framework zu arbeiten.', 'from django.urls import path\nfrom . import views\n\nurlpatterns = [path("", views.index, name="index")]', 'Beschreibe, welche Dateien an einer einfachen Django-Seite beteiligt sind.', 'Trenne URL-Konfiguration von View-Logik.', 'Den gesamten Projektcode in settings.py schreiben.'),
      lesson('SQLModel-Modelle', 'ORM-Modelle verbinden App-Konzepte mit Tabellen. Gute Modelle machen Typen, Pflichtfelder und Beziehungen sichtbar, damit auch die Datenbank wichtige Regeln schützt.', 'from sqlmodel import SQLModel, Field\n\nclass Task(SQLModel, table=True):\n    id: int | None = Field(default=None, primary_key=True)\n    title: str\n    done: bool = False', 'Entwirf ein SQLModel für abgeschlossene Lektionen eines Users.', 'Modelliere IDs, Fremdbezug und Completion-State explizit.', 'Fortschritt nur als unstrukturierte JSON-Zeichenkette speichern.', 'intermediate')
    ]),
    module('Collections vertiefen', 'Listen, Tupel, Sets und Dictionaries in echten Datenflüssen einsetzen.', [
      lesson('String-Operationen', 'Strings sind in Python unveränderliche Werte. In Apps nutzt du sie ständig zum Normalisieren, Validieren und Formatieren von Nutzereingaben, Logs oder API-Daten.', 'raw_name = "  Mina Jobst  "\nnormalized = raw_name.strip().lower().replace(" ", "-")\nprint(normalized)', 'Normalisiere einen eingegebenen Namen zu einem URL-freundlichen Slug.', 'Kette kleine String-Methoden lesbar aneinander.', 'Regex für jede einfache Textbereinigung verwenden.'),
      lesson('Slicing', 'Slicing ist eine kompakte Art, Sequenzen zu schneiden. Es ist stark für Vorschauen, Pagination und kleine Transformationen, sollte aber nicht kryptisch werden.', 'title = "python-basics"\nprefix = title[:6]\nsuffix = title[-6:]\nprint(prefix, suffix)', 'Erstelle aus einem Titel eine kurze Vorschau und ein Suffix.', 'Nutze klare Slice-Grenzen und benenne Zwischenergebnisse.', 'Magische Indizes ohne Namen quer durch den Code streuen.'),
      lesson('Dictionaries', 'Dictionaries sind das Arbeitstier für strukturierte Daten. In API-Code, JSON-Verarbeitung und Konfigurationen helfen sie, Werte schnell und sprechend per Schlüssel zu finden.', 'profile = {"name": "Mina", "xp": 320, "active": True}\nprofile["level"] = "intermediate"\nprint(profile.get("name"))', 'Baue ein Dictionary für ein Lernprofil und ergänze einen Level.', 'Nutze sprechende Schlüssel und get für optionale Werte.', 'Positionslisten für benannte Daten missbrauchen.'),
      lesson('Sets', 'Sets modellieren Eindeutigkeit. Sie sind ideal für Tags, abgeschlossene IDs, Duplikatprüfung und schnelle Mitgliedschaftstests.', 'completed = {"python-variables", "python-functions"}\ncompleted.add("python-lists")\nprint("python-lists" in completed)', 'Speichere abgeschlossene Lektions-IDs eindeutig in einem Set.', 'Nutze Sets, wenn Duplikate fachlich ungültig sind.', 'Duplikate nachträglich mit verschachtelten Schleifen suchen.'),
      lesson('Comprehensions', 'Comprehensions machen einfache Filter- und Mapping-Schritte kompakt. Sie bleiben gut, wenn sie wie ein Satz lesbar sind; bei komplexer Logik ist eine normale Schleife besser.', 'scores = [42, 80, 95, 61]\npassed = [score for score in scores if score >= 60]\nprint(passed)', 'Filtere bestandene Scores mit einer List Comprehension.', 'Halte Comprehensions kurz und zielgerichtet.', 'Mehrere verschachtelte Bedingungen in eine Zeile pressen.', 'intermediate'),
      lesson('Sortieren', 'Sortieren taucht in Listen, Rankings und Dashboards ständig auf. Mit key-Funktionen steuerst du fachlich, wonach sortiert wird, ohne Daten vorher umzubauen.', 'users = [{"name": "Mina", "xp": 320}, {"name": "Noah", "xp": 180}]\nranked = sorted(users, key=lambda user: user["xp"], reverse=True)\nprint(ranked[0]["name"])', 'Sortiere User nach XP absteigend und gib den Top-Namen aus.', 'Nutze sorted mit key statt Daten manuell zu tauschen.', 'Sortierlogik über mehrere Hilfslisten verteilen.', 'intermediate')
    ]),
    module('Fehler und Dateien', 'Robuste Scripts mit Exceptions, Kontextmanagern und strukturierten Daten bauen.', [
      lesson('Try Except', 'Fehlerbehandlung ist kein Anhängsel, sondern Teil des Designs. Gute try-Blöcke sind klein und behandeln nur Fehler, die an dieser Stelle sinnvoll gelöst werden können.', 'try:\n    xp = int("120")\nexcept ValueError:\n    xp = 0\nprint(xp)', 'Wandle eine Texteingabe in XP um und setze bei Fehlern einen Fallback.', 'Fange konkrete Exceptions statt alles pauschal ab.', 'Jeden Fehler mit bare except verschlucken.'),
      lesson('Eigene Fehler werfen', 'Eigene Exceptions machen fachliche Regeln sichtbar. Sie helfen Callern zu unterscheiden, ob eine Eingabe ungültig, ein Netzwerk kaputt oder ein Zustand verboten ist.', 'def award_xp(amount):\n    if amount < 0:\n        raise ValueError("amount must be positive")\n    return amount', 'Schreibe eine Funktion, die negative XP mit ValueError ablehnt.', 'Wirf Fehler dort, wo die Regel verletzt wird.', 'Ungültige Zustände still korrigieren.'),
      lesson('Context Manager', 'Context Manager räumen Ressourcen zuverlässig auf. Bei Dateien, Locks oder Datenbankverbindungen verhindern with-Blöcke viele kleine Produktionsfehler.', 'from pathlib import Path\n\nwith Path("notes.txt").open("w", encoding="utf-8") as file:\n    file.write("Practice daily")', 'Schreibe eine Datei mit with und pathlib.', 'Nutze with für Ressourcen, die geschlossen werden müssen.', 'Dateien öffnen und close später vergessen.'),
      lesson('JSON lesen', 'JSON ist die Standardsprache zwischen APIs, Automationen und Konfigurationsdateien. Saubere JSON-Verarbeitung prüft Struktur, statt Werte blind zu erwarten.', `import json\n\nraw = '{"name": "Mina", "xp": 320}'\ndata = json.loads(raw)\nprint(data["xp"])`, 'Parse einen JSON-String und lies ein XP-Feld aus.', 'Parse JSON zuerst und greife danach gezielt auf Felder zu.', 'JSON mit split und replace selbst zerlegen.'),
      lesson('CSV verarbeiten', 'CSV-Dateien sind unscheinbar, aber in echten Firmen extrem häufig. Das csv-Modul schützt vor kaputten Kommas, Quotes und Zeilenumbrüchen.', 'import csv\nfrom io import StringIO\n\nrows = csv.DictReader(StringIO("name,xp\\nMina,320"))\nfor row in rows:\n    print(row["name"])', 'Lies CSV-Daten als Dictionaries und gib Namen aus.', 'Nutze csv.DictReader für benannte Spalten.', 'CSV per String-Split parsen.', 'intermediate'),
      lesson('Pathlib Workflows', 'pathlib macht Pfade plattformunabhängig und lesbar. Gute Tools bauen Pfade explizit zusammen und prüfen, ob Dateien existieren.', 'from pathlib import Path\n\nroot = Path("data")\nreport = root / "report.txt"\nprint(report.parent.name)', 'Baue einen Pfad zu einer Report-Datei mit pathlib zusammen.', 'Nutze Path-Objekte statt String-Verkettung.', 'Pfadtrenner hart als Slash in Strings verteilen.', 'intermediate')
    ]),
    module('Moderne Python-Praxis', 'Typen, Dataclasses, Generatoren und saubere Funktionssignaturen nutzen.', [
      lesson('Type Hints', 'Type Hints machen Absichten für Editor, Reviewer und Tests sichtbar. Sie ändern Python nicht in Java, aber sie reduzieren Missverständnisse an Funktionsgrenzen.', 'def format_badge(name: str, xp: int) -> str:\n    return f"{name}: {xp} XP"', 'Typisiere eine Funktion, die einen Badge-Text formatiert.', 'Annotiere Parameter und Rückgabewert an wichtigen Grenzen.', 'Überall any oder gar keine Domänentypen verwenden.'),
      lesson('Dataclasses', 'Dataclasses sind perfekt für kleine Datenobjekte mit wenig Boilerplate. Sie passen zu DTOs, Konfigurationen und fachlichen Werten, die klar benannte Felder brauchen.', 'from dataclasses import dataclass\n\n@dataclass\nclass Badge:\n    name: str\n    xp_required: int', 'Erstelle eine Dataclass für ein Achievement.', 'Nutze Dataclasses für einfache strukturierte Daten.', 'Dictionaries tief verschachteln, obwohl Felder bekannt sind.'),
      lesson('Default Arguments', 'Default Arguments sind bequem, können aber gefährlich sein, wenn sie mutable sind. Verwende None als Signal und erzeuge Listen oder Dicts im Funktionskörper.', 'def add_tag(tag: str, tags: list[str] | None = None) -> list[str]:\n    values = tags or []\n    return values + [tag]', 'Schreibe eine Funktion mit sicherem optionalem Listenargument.', 'Nutze None statt mutable Default-Werten.', 'Eine leere Liste als Default-Argument mutieren.'),
      lesson('Unpacking', 'Unpacking macht Code präziser, wenn Struktur und Anzahl klar sind. Es hilft bei Tupeln, Dictionaries und Funktionsaufrufen, sollte aber nicht rätselhaft werden.', 'name, xp = ("Mina", 320)\nprofile = {"name": name, "xp": xp}\nprint(**profile)', 'Packe Name und XP aus einem Tupel in ein Dictionary.', 'Nutze Unpacking, wenn die Struktur stabil ist.', 'Unpacking für Daten verwenden, deren Länge unklar ist.'),
      lesson('Generatoren', 'Generatoren liefern Werte nach Bedarf. Sie sind stark für große Dateien, Streams oder Pipelines, bei denen du nicht alles gleichzeitig im Speicher halten willst.', 'def active_titles(lessons):\n    for lesson in lessons:\n        if lesson["active"]:\n            yield lesson["title"]', 'Schreibe einen Generator für aktive Lektions-Titel.', 'Nutze yield für lazy Datenströme.', 'Große Listen bauen, obwohl nur iteriert wird.', 'intermediate'),
      lesson('Decorators', 'Decorators erweitern Funktionen, ohne ihre Fachlogik zu vermischen. Logging, Timing oder Zugriffskontrolle lassen sich so an Grenzen sauber kapseln.', 'def log_call(function):\n    def wrapper(*args, **kwargs):\n        print("called")\n        return function(*args, **kwargs)\n    return wrapper', 'Schreibe einen Decorator, der vor einem Funktionsaufruf loggt.', 'Halte Decorators klein und transparent.', 'Fachlogik im Wrapper verstecken.', 'intermediate')
    ]),
    module('Web, APIs und Daten', 'HTTP, Requests, Datenanalyse und einfache Automationen vorbereiten.', [
      lesson('HTTP Requests', 'Viele Python-Tools sprechen mit APIs. Wichtig ist, Requests klar zu kapseln, Statuscodes zu prüfen und Antworten erst danach weiterzuverarbeiten.', 'import requests\n\nresponse = requests.get("https://api.example.com/lessons", timeout=5)\nresponse.raise_for_status()\nlessons = response.json()', 'Schreibe einen API-Request mit Timeout und Statusprüfung.', 'Prüfe HTTP-Fehler, bevor du JSON nutzt.', 'API-Antworten ungeprüft als Erfolg behandeln.', 'intermediate'),
      lesson('Environment Variables', 'Secrets gehören nicht in Code. Umgebungsvariablen halten Tokens, URLs und Konfigurationen getrennt vom Repository.', 'import os\n\napi_key = os.environ.get("API_KEY")\nif not api_key:\n    raise RuntimeError("missing API key")', 'Lies einen API-Key aus der Umgebung und validiere ihn.', 'Nutze Environment Variables für Secrets.', 'Tokens hart in Git committen.'),
      lesson('Pandas Einstieg', 'Pandas ist für tabellarische Daten nützlich, wenn Listen von Dictionaries zu umständlich werden. Starte mit klaren Spalten und kleinen Transformationen.', 'import pandas as pd\n\ndata = pd.DataFrame([{"name": "Mina", "xp": 320}])\nprint(data["xp"].mean())', 'Erstelle ein kleines DataFrame und berechne den XP-Durchschnitt.', 'Nutze DataFrames für tabellarische Analysen.', 'Pandas für einzelne primitive Werte einsetzen.', 'intermediate'),
      lesson('NumPy Arrays', 'NumPy ist die Basis vieler Data-Science-Bibliotheken. Arrays sind schnell für numerische Operationen, wenn Daten homogen und vektorisiert verarbeitet werden.', 'import numpy as np\n\nscores = np.array([42, 80, 95])\nprint(scores.mean())', 'Berechne den Durchschnitt eines Score-Arrays mit NumPy.', 'Nutze NumPy für numerische Vektoroperationen.', 'Numerische Listen unnötig verschachtelt manuell durchlaufen.', 'intermediate'),
      lesson('RegEx Basics', 'Reguläre Ausdrücke sind stark für Muster, aber schnell unlesbar. Nutze sie für klar begrenzte Validierung und benenne Zwischenergebnisse.', 'import re\n\nmatch = re.search(r"\\d+", "XP: 320")\nprint(match.group() if match else "0")', 'Extrahiere die erste Zahl aus einem Text.', 'Halte Regex-Muster klein und teste sie isoliert.', 'Komplette Parser als einen riesigen Regex bauen.'),
      lesson('CLI Argumente', 'Kleine Python-Automationen werden oft als CLI gestartet. argparse macht Optionen dokumentiert, validierbar und benutzerfreundlicher als rohe sys.argv-Zugriffe.', 'import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("--name", required=True)\nargs = parser.parse_args()', 'Definiere ein CLI-Argument für einen Namen.', 'Nutze argparse für echte Kommandozeilentools.', 'Argumente nur über feste Listenindizes lesen.', 'intermediate')
    ]),
    module('Testing und Automatisierung', 'Python-Code prüfbar, planbar und produktionsnäher machen.', [
      lesson('Pytest Basics', 'Tests geben dir Mut, Code zu ändern. Ein guter Pytest testet Verhalten, nicht Implementierungsdetails, und bleibt klein genug, um sofort verstanden zu werden.', 'def add_xp(current, reward):\n    return current + reward\n\ndef test_add_xp():\n    assert add_xp(10, 5) == 15', 'Schreibe einen kleinen Test für eine XP-Funktion.', 'Teste beobachtbares Verhalten mit klaren Beispielen.', 'Nur testen, dass eine Funktion aufgerufen wurde.'),
      lesson('Parametrisierte Tests', 'Parametrisierung reduziert Duplikate, wenn dieselbe Regel mit mehreren Beispielen geprüft wird. So bleiben Tests kompakt und trotzdem aussagekräftig.', 'import pytest\n\n@pytest.mark.parametrize("score,passed", [(60, True), (40, False)])\ndef test_passing(score, passed):\n    assert (score >= 60) is passed', 'Teste eine Bestehensregel mit mehreren Scores.', 'Nutze Parametrize für Varianten derselben Regel.', 'Für jeden Zahlenwert fast gleiche Tests kopieren.', 'intermediate'),
      lesson('Logging', 'Logging ist die Blackbox für Scripts und Automationen. Gute Logs erklären Start, Entscheidung und Ergebnis, ohne sensible Daten preiszugeben.', 'import logging\n\nlogging.basicConfig(level=logging.INFO)\nlogging.info("lesson completed")', 'Füge ein Info-Log für eine abgeschlossene Lektion hinzu.', 'Logge Ereignisse, keine Secrets.', 'print als einziges Produktionslogging verwenden.'),
      lesson('Scheduling', 'Viele Python-Jobs laufen regelmäßig: Reports, Imports oder Cleanups. Auch wenn später Cron übernimmt, sollte die Job-Funktion selbst klein und wiederholbar bleiben.', 'from datetime import datetime\n\ndef run_daily_report(now: datetime) -> str:\n    return now.strftime("%Y-%m-%d")', 'Schreibe eine Funktion für einen täglichen Report-Lauf.', 'Übergib Zeit als Parameter, damit Tests stabil bleiben.', 'datetime.now überall direkt in Fachlogik verstecken.'),
      lesson('Async IO', 'Async IO hilft bei vielen wartenden Netzwerkoperationen. Es ist kein Beschleuniger für jede Aufgabe, sondern ein Werkzeug für gleichzeitige I/O-Flows.', 'import asyncio\n\nasync def load_profile():\n    await asyncio.sleep(0.1)\n    return {"name": "Mina"}', 'Schreibe eine async Funktion, die ein Profil lädt.', 'Nutze async für wartende I/O-Arbeit.', 'CPU-lastige Arbeit blind in async Funktionen packen.', 'intermediate'),
      lesson('Projektstruktur', 'Wachsende Python-Projekte brauchen klare Ordner und Einstiegspunkte. Trenne Package-Code, Tests und CLI-Start, damit Tools, Imports und Deployment berechenbar bleiben.', 'from pathlib import Path\n\nPACKAGE_ROOT = Path(__file__).parent\nTEST_ROOT = PACKAGE_ROOT.parent / "tests"\nprint(TEST_ROOT.name)', 'Skizziere Konstanten für Package- und Test-Verzeichnis.', 'Halte Projektpfade zentral und nachvollziehbar.', 'Imports durch zufällige sys.path-Hacks reparieren.', 'intermediate')
    ])
  ]),
  course('csharp', 'C#', 'C#', 'Stark typisierte .NET-Entwicklung, LINQ und Web APIs.', '#b47cff', 'from-[#b47cff] to-[#6f4dff]', 'C#', 'csharp', [
    module('Grundlagen', 'Typen, Methoden und Collections im .NET-Alltag.', [
      lesson('Variablen und Typen', 'C# nutzt statische Typen, damit der Compiler viele Fehler früh erkennt. Wähle Typen, die die Absicht ausdrücken, und nutze var nur, wenn die rechte Seite eindeutig ist.', 'string name = "Mina";\nint xp = 180;\nbool isActive = true;\nConsole.WriteLine($"{name}: {xp} XP");', 'Erzeuge typisierte Variablen für eine Kurskarte und gib eine Zusammenfassung aus.', 'Nutze String-Interpolation für lesbare Ausgabe.', 'object für jeden Wert verwenden.'),
      lesson('Methoden', 'Methoden sollten eine klare Aufgabe und einen klaren Rückgabetyp haben. Kleine Methoden lassen sich testen und später sauber in Services oder Controller einbauen.', 'static int AddXp(int currentXp, int reward)\n{\n    return currentXp + reward;\n}', 'Schreibe eine Methode, die true zurückgibt, wenn ein Score bestanden ist.', 'Nutze bool als Rückgabetyp für Ja/Nein-Regeln.', 'Nur auf die Konsole schreiben und nichts zurückgeben.'),
      lesson('Collections', 'Listen und Dictionaries sind Standardwerkzeuge für App-Daten. Entscheide nach Zugriffsmuster: Reihenfolge, Eindeutigkeit oder schneller Zugriff per Schlüssel.', 'var lessons = new List<string> { "Types", "Methods", "LINQ" };\nforeach (var lesson in lessons)\n{\n    Console.WriteLine(lesson);\n}', 'Lege eine Liste mit Badge-Namen an und gib sie sortiert aus.', 'Nutze List<string> für geordnete Werte.', 'badge1, badge2 und badge3 als Einzelvariablen anlegen.')
    ]),
    module('OOP und LINQ', 'Objekte modellieren und Daten lesbar abfragen.', [
      lesson('Klassen', 'Klassen bündeln Zustand und Verhalten. Konstruktoren, Properties und private Setter helfen, Objekte nach der Erstellung in einem gültigen Zustand zu halten.', 'public class LessonProgress\n{\n    public string LessonId { get; }\n    public bool Completed { get; private set; }\n    public LessonProgress(string lessonId) => LessonId = lessonId;\n    public void Complete() => Completed = true;\n}', 'Erstelle eine Badge-Klasse mit Name und AwardedAt.', 'Nutze Properties statt frei änderbarer Felder.', 'Jedes Feld public mutable machen.'),
      lesson('Interfaces', 'Interfaces beschreiben Fähigkeiten an Grenzen: Storage, Mail, APIs oder Clock. Dort erleichtern sie Tests und spätere Austauschbarkeit.', 'public interface IProgressStore\n{\n    Task SaveAsync(LessonProgress progress);\n}', 'Definiere ein Interface zum Laden von Kursinhalten.', 'Benenne Verhalten aus Sicht des Consumers.', 'Für jede winzige Klasse automatisch ein Interface erstellen.'),
      lesson('LINQ', 'LINQ macht Filtern, Mappen und Gruppieren lesbar, wenn die Pipeline klar bleibt. Komplexe Queries verdienen Namen, damit Kosten und Absicht sichtbar bleiben.', 'var completed = lessons\n    .Where(lesson => lesson.Completed)\n    .Select(lesson => lesson.Title)\n    .ToList();', 'Filtere aktive User und sammle ihre Namen.', 'Setze Where vor Select.', 'Für einfache Filter verschachtelte Schleifen schreiben.', 'intermediate')
    ]),
    module('.NET Web APIs', 'HTTP-Endpunkte und Persistenz vorbereitet denken.', [
      lesson('Minimal APIs', 'Minimal APIs sind ein direkter Einstieg in ASP.NET Core. Halte Handler schlank und verschiebe fachliche Regeln in Services, sobald die App wächst.', 'var builder = WebApplication.CreateBuilder(args);\nvar app = builder.Build();\napp.MapGet("/health", () => Results.Ok(new { status = "ok" }));\napp.Run();', 'Skizziere einen GET-Endpunkt für Lektionen.', 'Gib strukturierte JSON-Antworten zurück.', 'Datenbanklogik in jeden Handler kopieren.'),
      lesson('Controller', 'Controller organisieren zusammenhängende HTTP-Aktionen. Sie koordinieren Validierung, Services und Statuscodes, sollten aber keine große Fachlogik enthalten.', '[ApiController]\n[Route("api/[controller]")]\npublic class LessonsController : ControllerBase\n{\n    [HttpGet]\n    public IActionResult Get() => Ok(Array.Empty<string>());\n}', 'Benenne eine Controller-Action für Lesson Completion.', 'Nutze Route und HTTP-Verb semantisch.', 'POST für jede einzelne Operation nutzen.'),
      lesson('Entity Framework Core', 'EF Core mappt C#-Entities auf Tabellen. Saubere Entities, Beziehungen und Migrationen machen Schemaänderungen reviewbar und reproduzierbar.', 'public class AppDbContext : DbContext\n{\n    public DbSet<LessonProgress> Progress => Set<LessonProgress>();\n}', 'Entwirf eine EF-Entity für einen Quizversuch.', 'Speichere UserId, Score und Timestamp.', 'Attempts nur im Arbeitsspeicher halten.', 'intermediate')
    ])
  ]),
  course('java', 'Java', 'Java', 'OOP, Collections, Streams und Spring Boot REST APIs.', '#ff7a45', 'from-[#ff7a45] to-[#e43d30]', 'JV', 'java', [
    module('Grundlagen', 'Syntax, Methoden und Collections mit Compiler-Sicherheit.', [
      lesson('Typen und Variablen', 'Java ist explizit und typensicher. Die zusätzliche Schreibarbeit zahlt sich in Teams aus, weil Refactorings und Schnittstellen verlässlicher werden.', 'String name = "Mina";\nint xp = 220;\nboolean active = true;\nSystem.out.println(name + " has " + xp + " XP");', 'Lege Variablen für Kurstitel, Lektionsanzahl und aktiv-Flag an.', 'Nutze passende primitive Typen.', 'Jeden Wert als String darstellen.'),
      lesson('Methoden', 'Java-Methoden kommunizieren über Parameter und Rückgabewerte. Gute Methodennamen reduzieren die kognitive Last in größeren Codebasen enorm.', 'static boolean isPassing(int score) {\n    return score >= 60;\n}', 'Schreibe eine Methode, die aus XP einen Levelnamen ableitet.', 'Gib einen Wert zurück, statt nur zu drucken.', 'Ein mutable static Feld für das Ergebnis verwenden.'),
      lesson('Collections', 'Collections modellieren Gruppen von Daten. List ist für Reihenfolge, Set für Eindeutigkeit und Map für Schlüsselzugriff geeignet.', 'List<String> lessons = List.of("Types", "OOP", "Streams");\nfor (String lesson : lessons) {\n    System.out.println(lesson);\n}', 'Erstelle ein Set abgeschlossener Lektions-IDs.', 'Nutze Set, wenn Duplikate ungültig sind.', 'Ein Array nutzen und Duplikate manuell suchen.')
    ]),
    module('OOP und Streams', 'Daten kapseln und Collections funktional verarbeiten.', [
      lesson('Klassen', 'Eine Java-Klasse sollte ihre Invarianten schützen. Konstruktoren, private Felder und fokussierte Methoden halten Objekte nach der Erstellung gültig.', 'public class Badge {\n    private final String name;\n    public Badge(String name) { this.name = name; }\n    public String name() { return name; }\n}', 'Erstelle eine Lesson-Klasse mit title und xp.', 'Nutze private final für unänderliche Werte.', 'Alle Felder public machen.'),
      lesson('Komposition', 'Vererbung koppelt Klassen stark. Komposition ist in App-Code oft robuster, weil du Verhalten austauschen kannst, ohne starre Hierarchien zu bauen.', 'class QuizService {\n    private final QuestionRepository repository;\n    QuizService(QuestionRepository repository) {\n        this.repository = repository;\n    }\n}', 'Übergib ein Repository per Konstruktor an einen Service.', 'Injiziere Abhängigkeiten über den Konstruktor.', 'In jeder Methode neue Abhängigkeiten erzeugen.'),
      lesson('Streams', 'Streams beschreiben Transformationen über Collections. Sie sind stark, wenn die Pipeline wie ein Satz lesbar bleibt und keine versteckten Seiteneffekte hat.', 'List<String> titles = lessons.stream()\n    .filter(Lesson::completed)\n    .map(Lesson::title)\n    .toList();', 'Sammle Titel aller Advanced-Lektionen mit Streams.', 'Filtere vor dem Mapping.', 'Externe Listen innerhalb von map ändern.', 'intermediate')
    ]),
    module('Spring Boot APIs', 'Controller, Services und REST-Schnittstellen sauber trennen.', [
      lesson('Controller', 'Spring Controller übersetzen HTTP in Anwendungshandlungen. Sie sollten schlank bleiben und fachliche Entscheidungen an Services delegieren.', '@RestController\n@RequestMapping("/api/lessons")\nclass LessonController {\n    @GetMapping\n    List<String> all() { return List.of("Basics"); }\n}', 'Skizziere einen Controller für Quizversuche.', 'Nutze ressourcenorientierte Routen.', 'Alle Logik in die Controller-Methode schreiben.'),
      lesson('Services', 'Services enthalten Use-Case-Logik. Ein guter Service ist testbar, ohne dass Webserver, Datenbank oder Framework-Kontext gestartet werden müssen.', '@Service\nclass ProgressService {\n    int awardXp(int current, int reward) {\n        return current + reward;\n    }\n}', 'Entwirf eine Service-Methode zum Abschließen einer Lektion.', 'Nimm IDs entgegen und gib aktualisierten Fortschritt zurück.', 'Request-Bodies direkt im Service lesen.'),
      lesson('REST APIs', 'REST-Design bedeutet vorhersehbare Ressourcen, Methoden und Statuscodes. Gute APIs machen Client-Code langweilig und dadurch stabil.', '@PostMapping("/{lessonId}/complete")\nResponseEntity<Void> complete(@PathVariable String lessonId) {\n    return ResponseEntity.noContent().build();\n}', 'Wähle Routen für Module und Lesson Completion.', 'Nutze GET zum Lesen und POST/PATCH für Änderungen.', 'Eine Route /doEverything bauen.', 'intermediate')
    ])
  ]),
  course('html', 'HTML', 'HTML', 'Semantische Struktur, Formulare, Accessibility und Dokumentbedeutung.', '#ff8a3d', 'from-[#ff8a3d] to-[#ef4d2f]', 'H5', 'html', [
    module('Semantik', 'Dokumente bauen, die Browser und Assistive Tech verstehen.', [
      lesson('Semantisches Layout', 'Semantisches HTML beschreibt Bedeutung vor Aussehen. Das richtige Element gibt Browsern, Suchmaschinen und Screenreadern eine bessere Karte der Seite.', '<main>\n  <article>\n    <h1>Learning Path</h1>\n    <p>Practice one lesson every day.</p>\n  </article>\n</main>', 'Baue eine Lesson-Card mit article, heading und paragraph.', 'Wähle Elemente zuerst nach Bedeutung.', 'Für alles div verwenden.'),
      lesson('Navigation', 'Links führen zu Ressourcen, Buttons lösen Aktionen aus. Wenn du beides vermischst, wird Bedienung per Tastatur und Screenreader unklar.', '<nav aria-label="Primary">\n  <a href="/courses">Courses</a>\n  <a href="/profile">Profile</a>\n</nav>', 'Erstelle eine Navigation mit drei Links.', 'Gib Navigationen ein sinnvolles aria-label.', 'Buttons für Seitenwechsel verwenden.'),
      lesson('Alt-Texte', 'Bilder brauchen Alternativtexte, wenn sie Bedeutung tragen. Dekorative Bilder sollten dagegen versteckt werden, damit sie nicht als Störung vorgelesen werden.', '<img src="/badge.png" alt="Python starter badge" />', 'Schreibe einen Alt-Text für ein Kurs-Badge.', 'Beschreibe Zweck und Bedeutung des Bildes.', 'alt="image" verwenden.')
    ]),
    module('Formulare', 'Eingaben mit Labels, Validierung und klaren Aktionen erfassen.', [
      lesson('Labels und Inputs', 'Labels verbinden sichtbaren Text mit Formularfeldern. Das verbessert Touch-Ziele, Screenreader-Ausgabe und automatisierte Tests.', '<label for="name">Display name</label>\n<input id="name" name="name" autocomplete="name" />', 'Baue ein Feld für den Anzeigenamen mit Label.', 'Verbinde label for mit input id.', 'Placeholder als einziges Label nutzen.'),
      lesson('Validierung', 'HTML-Validierung fängt einfache Fehler ab, bevor JavaScript läuft. Nutze required, input types und Constraints als solide Basisschicht.', '<input type="email" required aria-describedby="email-help" />\n<p id="email-help">Use your learning account email.</p>', 'Erstelle ein E-Mail-Feld mit Hilfetext.', 'Nutze type=email und aria-describedby.', 'Erst nach dem Server-Request validieren.'),
      lesson('Buttons', 'Buttons sollten klar sagen, welche Aktion sie auslösen. Explizite Typen verhindern unbeabsichtigte Formular-Submits.', '<button type="submit">Save profile</button>\n<button type="button">Preview avatar</button>', 'Füge Speichern- und Vorschau-Buttons zu einem Formular hinzu.', 'Setze button types bewusst.', 'Klickbare divs bauen.')
    ]),
    module('Praxis', 'HTML-Strukturen für wartbare Apps nutzen.', [
      lesson('Heading-Struktur', 'Überschriften sind Navigation. Wer Level nur wegen der Optik überspringt, macht lange Seiten schwerer scanbar und schlechter auditierbar.', '<section>\n  <h2>Modules</h2>\n  <h3>Control Flow</h3>\n</section>', 'Erstelle eine Section mit h2 und zwei h3-Lektionstiteln.', 'Halte Heading-Level logisch.', 'Headings nur nach Schriftgröße wählen.'),
      lesson('Tabellen', 'Tabellen sind für echte Datenbeziehungen da, nicht für Layout. Wenn Zeilen, Spalten und Header Bedeutung haben, liefert table-Markup diese Bedeutung mit.', '<table>\n  <thead><tr><th>Lesson</th><th>XP</th></tr></thead>\n  <tbody><tr><td>Forms</td><td>40</td></tr></tbody>\n</table>', 'Markiere eine kleine XP-Tabelle semantisch korrekt.', 'Nutze th für Header.', 'Tabellendaten mit verschachtelten divs nachbauen.'),
      lesson('Metadaten', 'Metadaten beeinflussen Browser, Suche, Sharing und PWA-Installation. Sie sind kleine Dateien, aber echtes Produktdetail.', '<meta name="viewport" content="width=device-width, initial-scale=1" />\n<meta name="description" content="Practice coding lessons daily." />', 'Füge viewport und description metadata hinzu.', 'Halte Beschreibungen konkret.', 'Metadata bis zum Launch ignorieren.', 'intermediate')
    ])
  ]),
  course('css', 'CSS', 'CSS', 'Responsive Layouts, moderne Gestaltung, Animationen und Tailwind.', '#50a7ff', 'from-[#50a7ff] to-[#2559ff]', 'CSS', 'css', [
    module('Grundlagen', 'Cascade, Selektoren, Box Model und Design Tokens.', [
      lesson('Selektoren', 'Die Cascade entscheidet, welche Regel gewinnt. Gute CSS-Architektur nutzt einfache Selektoren und vorhersehbare Komponenten statt Spezifitätskämpfe.', '.lesson-card {\n  padding: 1rem;\n  border: 1px solid #273245;\n}', 'Style eine Card-Klasse mit Padding, Border und Hintergrund.', 'Nutze Klassen für Komponenten.', 'Jedes Element per id stylen.'),
      lesson('Box Model', 'Jedes Layout besteht aus Content, Padding, Border und Margin. Wer das Box Model versteht, findet Overflow und zu kleine Touch-Ziele deutlich schneller.', '.button {\n  min-height: 44px;\n  padding: 0 16px;\n  box-sizing: border-box;\n}', 'Erstelle einen touchfreundlichen Button-Style.', 'Nutze min-height für Tap Targets.', 'Nur die font-size setzen.'),
      lesson('CSS Variablen', 'Custom Properties machen Farbsysteme, Abstände und Radien wartbar. Benenne sie nach Rolle, nicht nach zufälligem Farbwert.', ':root {\n  --surface: #121923;\n  --accent: #50a7ff;\n}', 'Definiere Variablen für Background und Accent.', 'Benenne Variablen nach ihrer Aufgabe.', 'Dieselbe Farbe überall hart codieren.')
    ]),
    module('Responsive Layout', 'Mobile-first Layouts mit Flexbox, Grid und Breakpoints.', [
      lesson('Flexbox', 'Flexbox ist ideal für eine Dimension: Toolbars, Navs, Reihen und Spalten. Es glänzt, wenn Elemente Platz teilen oder sauber ausgerichtet werden müssen.', '.toolbar {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}', 'Baue eine Toolbar mit Flexbox und gap.', 'Nutze gap statt Margin-Hacks.', 'Alle Elemente absolut positionieren.'),
      lesson('CSS Grid', 'Grid löst zweidimensionale Layouts. Es passt gut für Cards, Dashboards und Bereiche, in denen Reihen und Spalten gleichzeitig wichtig sind.', '.course-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 12px;\n}', 'Baue ein zweispaltiges Course Grid.', 'Nutze minmax(0, 1fr) gegen Overflow.', 'Fixe Pixelbreiten für mobile Cards setzen.'),
      lesson('Media Queries', 'Responsive Design reagiert auf verfügbaren Platz, nicht auf geratenen Gerätenamen. Starte mobil und füge größere Layouts per min-width hinzu.', '@media (min-width: 720px) {\n  .shell { max-width: 460px; }\n}', 'Begrenze eine App-Shell auf breiteren Screens.', 'Nutze min-width von Mobile Defaults aus.', 'Separates HTML für Mobile und Desktop bauen.', 'intermediate')
    ]),
    module('Moderne Praxis', 'Transitions, Animationen und Tailwind sauber einsetzen.', [
      lesson('Transitions', 'Motion sollte Zustandswechsel erklären. Kurze Transitions auf transform, opacity und color fühlen sich direkt an, ohne die App träge zu machen.', '.card {\n  transition: transform 160ms ease, border-color 160ms ease;\n}\n.card:hover { transform: translateY(-2px); }', 'Füge einer Card eine Hover-Transition hinzu.', 'Animiere transform statt Layout-Eigenschaften.', 'Bei jeder Interaktion height animieren.'),
      lesson('Animationen', 'Animationen sind dann stark, wenn sie Feedback oder Fortschritt zeigen. Respektiere reduced-motion, damit die App für mehr Menschen angenehm bleibt.', '@media (prefers-reduced-motion: no-preference) {\n  .success { animation: pop 220ms ease; }\n}', 'Schreibe eine reduced-motion-sichere Success-Animation.', 'Kapsle Bewegung in einer Media Query.', 'Allen Nutzern lange Animationen aufzwingen.'),
      lesson('Tailwind Basics', 'Tailwind funktioniert am besten, wenn wiederkehrende Muster zu Komponenten werden. Utility-Klassen sind ein Werkzeug, kein Ersatz für Designentscheidungen.', '<button class="min-h-11 rounded-xl bg-blue-500 px-4 font-semibold">\n  Continue\n</button>', 'Erstelle Klassen für einen Primary Button.', 'Extrahiere wiederholte Muster in Komponenten.', 'Beliebige Klassenlisten überall kopieren.', 'intermediate')
    ])
  ]),
  course('javascript', 'JavaScript', 'JS', 'Browser-Interaktion, Async APIs, TypeScript, React, Vue und Node.', '#ffe45c', 'from-[#ffe45c] to-[#f4b400]', 'JS', 'javascript', [
    module('Grundlagen', 'Werte, Funktionen, DOM, Events und Fetch.', [
      lesson('Werte und Funktionen', 'JavaScript ist flexibel; genau deshalb sind klare Funktionsgrenzen wichtig. Nutze const, kleine Funktionen und explizite Rückgaben, damit Verhalten nachvollziehbar bleibt.', 'const addXp = (currentXp, reward) => currentXp + reward;\nconsole.log(addXp(120, 40));', 'Schreibe eine Funktion, die Name und Level formatiert.', 'Nutze const für Funktionsausdrücke.', 'Zufällige äußere Variablen mutieren.'),
      lesson('DOM und Events', 'Das DOM ist der lebende Dokumentbaum. Events verbinden Nutzereingaben mit Zustand; gute Handler lesen Eingaben, aendern Zustand und lassen Rendering vorhersehbar.', 'const button = document.querySelector("[data-complete]");\nbutton?.addEventListener("click", () => {\n  document.body.dataset.done = "true";\n});', 'Füge einen Click-Handler hinzu, der eine Lektion abschließt.', 'Nutze data-Attribute als stabile Hooks.', 'Unklare globale Selektoren verwenden.'),
      lesson('Fetch API', 'fetch liefert ein Promise für eine HTTP-Antwort. Produktiver Code prüft response.ok und behandelt Fehler, statt jede Antwort als Erfolg zu interpretieren.', 'async function loadLessons() {\n  const response = await fetch("/api/lessons");\n  if (!response.ok) throw new Error("Request failed");\n  return response.json();\n}', 'Schreibe einen Fetch-Wrapper zum Laden von Kursen.', 'Prüfe response.ok vor dem Parsen.', 'Netzwerkfehler ignorieren.')
    ]),
    module('TypeScript und Frameworks', 'Typen und Komponenten für moderne Frontends.', [
      lesson('TypeScript Typen', 'TypeScript macht Datenverträge im Editor und beim Build sichtbar. Starte mit nützlichen Domain-Interfaces, bevor du fortgeschrittene Type-Tricks einsetzt.', 'type Lesson = {\n  id: string;\n  title: string;\n  xp: number;\n};', 'Erstelle einen Typ für eine Quizantwort.', 'Modelliere ids und selected option klar.', 'any für jedes Objekt verwenden.'),
      lesson('React Basics', 'React rendert UI aus Zustand. Kleine Komponenten, typisierte Props und wiederverwendbare Hooks halten die Oberfläche verständlich.', 'function LessonCard({ title, xp }: { title: string; xp: number }) {\n  return <article><h2>{title}</h2><p>{xp} XP</p></article>;\n}', 'Baue eine React-Komponente für eine Kurskarte.', 'Übergib Inhalte über typisierte Props.', 'Inhalte mit document.querySelector lesen.'),
      lesson('Vue Basics', 'Vue kombiniert Templates, Reaktivität und Komponenten. Das Denkmodell bleibt aehnlich: Zustand aendert sich, UI aktualisiert sich, Komponenten haben klare Grenzen.', '<script setup>\nconst props = defineProps<{ title: string }>();\n</script>\n<template><h2>{{ props.title }}</h2></template>', 'Erstelle ein Vue-Prop für einen Lektionstitel.', 'Halte Props explizit.', 'Den gesamten App-State in eine globale Variable legen.', 'intermediate')
    ]),
    module('Node und Express', 'JavaScript auf dem Server mit klaren API-Grenzen.', [
      lesson('Node Module', 'Node-Apps bestehen aus Modulen. Trenne Konfiguration, Routen und Fachlogik, damit das Backend nicht zu einer unwartbaren Datei wird.', 'export function addXp(currentXp, reward) {\n  return currentXp + reward;\n}', 'Exportiere eine Utility-Funktion aus einem Modul.', 'Nutze named exports für geteilte Helfer.', 'Alles an globalThis hängen.'),
      lesson('Express Routes', 'Express-Handler sollten Eingaben validieren, Service-Logik aufrufen und klare Statuscodes senden. Schlanke Routen lassen sich später leichter ersetzen.', 'app.get("/api/health", (req, res) => {\n  res.json({ status: "ok" });\n});', 'Erstelle eine Express-Route für Kurslisten.', 'Antworte mit res.json.', 'HTML an API-Clients senden.'),
      lesson('Async/Await', 'async und await machen Promise-Code linear lesbar. Trotzdem musst du Fehler behandeln, weil asynchrone Fehler als abgelehnte Promises weiterlaufen.', 'async function completeLesson(id) {\n  try {\n    return await api.complete(id);\n  } catch (error) {\n    console.error(error);\n    throw error;\n  }\n}', 'Schreibe eine async Funktion zum Speichern von Progress.', 'Catch, logge und wirf weiter, wenn Caller reagieren sollen.', 'Fehler still verschlucken.', 'intermediate')
    ])
  ]),
  course('typescript', 'TypeScript', 'TS', 'Stabile Frontend- und Backend-Typen für echte Produktentwicklung.', '#7dd3fc', 'from-[#7dd3fc] to-[#2563eb]', 'TS', 'typescript', [
    module('Typen im Alltag', 'Alltagsnahe Typen, Unions und Narrowing sauber einsetzen.', [
      lesson('Domain Types', 'TypeScript hilft dir, Produktbegriffe direkt im Code sichtbar zu machen. Gute Typen beschreiben nicht nur technische Formen, sondern echte Regeln wie Status, XP oder Kurs-IDs.', 'type LessonStatus = "open" | "done";\ntype Lesson = {\n  id: string;\n  title: string;\n  status: LessonStatus;\n};\n\nconst nextLesson: Lesson = { id: "ts-types", title: "Types", status: "open" };', 'Erstelle einen Typ für eine Kurskarte mit id, title, xp und status.', 'Modelliere fachliche Zustände als konkrete Union statt als beliebigen String.', 'Alle Felder als string typisieren, nur damit der Compiler ruhig ist.'),
      lesson('Union Types', 'Union Types beschreiben kontrollierte Varianten. Sie sind stark, wenn ein Wert nur bestimmte Zustände annehmen darf und die UI je Zustand anders reagieren muss.', 'type SaveState = "idle" | "saving" | "saved" | "error";\n\nfunction labelFor(state: SaveState): string {\n  if (state === "saving") return "Saving...";\n  return "Ready";\n}', 'Baue einen Union Type für Ladezustände und gib je Zustand ein Label zurück.', 'Halte erlaubte Zustände explizit und klein.', 'Statuswerte als freie Texte durch die App reichen.'),
      lesson('Narrowing', 'Narrowing macht unsichere Werte Schritt für Schritt konkret. Dadurch kannst du Daten aus Formularen, APIs oder localStorage prüfen, bevor dein Code damit arbeitet.', 'function parseXp(value: number | string): number {\n  if (typeof value === "string") {\n    return Number(value);\n  }\n  return value;\n}', 'Schreibe eine Funktion, die number oder string annimmt und eine Zahl zurückgibt.', 'Prüfe Varianten nah an der Grenze, an der Daten hereinkommen.', 'Mit as number behaupten, dass schon alles passt.', 'intermediate')
    ]),
    module('Sichere APIs', 'Interfaces, Generics und unknown für API-nahe Grenzen nutzen.', [
      lesson('Interfaces', 'Interfaces sind gute Verträge für Objekte, die von mehreren Stellen verwendet werden. Sie helfen besonders bei Komponenten-Props, Service-Antworten und Repository-Grenzen.', 'interface CourseSummary {\n  readonly id: string;\n  title: string;\n  completedLessons: number;\n}\n\nconst summary: CourseSummary = { id: "react", title: "React", completedLessons: 4 };', 'Definiere ein Interface für einen gespeicherten Lernfortschritt.', 'Nutze readonly für IDs, die nach dem Erzeugen nicht geändert werden sollen.', 'IDs nachträglich an vielen Stellen überschreiben.'),
      lesson('Generics', 'Generics machen wiederverwendbare Funktionen typsicher, ohne Informationen zu verlieren. Sie passen gut zu Listen, API-Antworten und kleinen Helfern.', 'function firstItem<T>(items: T[]): T | undefined {\n  return items[0];\n}\n\nconst firstTitle = firstItem(["Types", "React"]);', 'Schreibe eine generische Funktion, die das letzte Element einer Liste zurückgibt.', 'Nutze Generics, wenn derselbe Ablauf mit verschiedenen Typen arbeitet.', 'any verwenden und danach hoffen, dass der Rückgabetyp stimmt.', 'intermediate'),
      lesson('Unknown validieren', 'unknown ist ehrlicher als any, weil du vor der Nutzung prüfen musst. Gerade an API-, Storage- und KI-Grenzen schützt dich das vor stillen Laufzeitfehlern.', 'function readTitle(input: unknown): string {\n  if (typeof input === "object" && input !== null && "title" in input) {\n    return String(input.title);\n  }\n  return "Untitled";\n}', 'Lies ein title-Feld aus unknown und gib einen sicheren Fallback zurück.', 'Validiere unbekannte Daten, bevor du Felder verwendest.', 'API-Antworten direkt als fertige Domain-Objekte casten.', 'intermediate')
    ]),
    module('Produktive Patterns', 'Utility Types, discriminated unions und async Ergebnisse modellieren.', [
      lesson('Utility Types', 'Utility Types ersparen doppelte Typdefinitionen. Pick, Omit und Partial sind besonders praktisch, wenn Formulare, Updates und Listenansichten nur Teile eines Modells brauchen.', 'type UserProfile = { id: string; name: string; email: string; xp: number };\ntype ProfilePreview = Pick<UserProfile, "name" | "xp">;\n\nconst preview: ProfilePreview = { name: "Mina", xp: 420 };', 'Erzeuge aus einem Profiltyp einen Preview-Typ mit name und xp.', 'Leite Varianten aus bestehenden Typen ab, wenn sie fachlich zusammengehören.', 'Fast gleiche Typen per Copy Paste auseinanderlaufen lassen.'),
      lesson('Discriminated Unions', 'Discriminated Unions machen Varianten sicher unterscheidbar. Ein gemeinsames type-Feld hilft dem Compiler und den Lesern, jeden Fall bewusst zu behandeln.', 'type Result<T> = { type: "success"; data: T } | { type: "failure"; error: string };\n\nfunction message(result: Result<string>): string {\n  return result.type === "success" ? result.data : result.error;\n}', 'Modelliere Erfolg und Fehler einer Quizauswertung als discriminated union.', 'Nutze ein gemeinsames Diskriminator-Feld für Varianten.', 'Erfolg und Fehler in einem Objekt mit vielen optionalen Feldern mischen.', 'advanced'),
      lesson('Async Result Types', 'Asynchrone Funktionen sollten ihren Erfolgs- und Fehlerweg sichtbar machen. Kleine Result-Typen helfen, UI-Zustände zu rendern, ohne Exceptions überall zu verstreuen.', 'type LoadResult = { ok: true; lessons: string[] } | { ok: false; reason: string };\n\nasync function loadLessonTitles(): Promise<LoadResult> {\n  return { ok: true, lessons: ["Types", "React"] };\n}', 'Schreibe einen Promise-Rückgabetyp für erfolgreich oder fehlgeschlagen geladene Kurse.', 'Mache den Fehlerweg im Rückgabetyp sichtbar, wenn die UI darauf reagieren soll.', 'Nur console.error nutzen und trotzdem undefined zurückgeben.', 'advanced')
    ])
  ]),
  course('react', 'React', 'React', 'Komponenten, State, Effekte und robuste App-Oberflächen.', '#61dafb', 'from-[#61dafb] to-[#1d4ed8]', 'RX', 'tsx', [
    module('Komponenten', 'Props, State und Events als Bausteine moderner Interfaces.', [
      lesson('Props', 'Props sind der Vertrag einer Komponente. Wenn du Props klein und typisiert hältst, bleibt klar, welche Daten eine Komponente braucht und was sie selbst entscheiden darf.', 'type CourseCardProps = {\n  title: string;\n  xp: number;\n};\n\nexport function CourseCard({ title, xp }: CourseCardProps) {\n  return <article><h2>{title}</h2><p>{xp} XP</p></article>;\n}', 'Baue eine typisierte Card-Komponente mit title und progress.', 'Übergib Daten über Props statt globale Werte zu lesen.', 'Komponenten direkt aus localStorage lesen lassen.'),
      lesson('State', 'State beschreibt UI-Daten, die sich durch Interaktion ändern. Halte State so klein wie möglich und berechne ableitbare Werte beim Rendern.', 'const [completed, setCompleted] = useState(false);\n\n<button onClick={() => setCompleted(true)}>\n  Mark done\n</button>;', 'Erstelle einen State für eine ausgewählte Quizoption.', 'Speichere nur den kleinsten notwendigen Zustand.', 'Dieselbe Information in mehreren State-Werten doppelt halten.'),
      lesson('Events', 'Event Handler verbinden Nutzeraktionen mit Zustandsänderungen. Gute Handler haben sprechende Namen und enthalten nur die Logik, die direkt zur Interaktion gehört.', 'function handleAnswerClick(answerId: string) {\n  setSelectedAnswer(answerId);\n}\n\n<button onClick={() => handleAnswerClick("a")}>Answer A</button>;', 'Schreibe einen Click Handler für eine Antwortauswahl.', 'Benenne Handler nach der Nutzeraktion.', 'Komplexe Datenberechnung direkt im JSX verstecken.')
    ]),
    module('Datenfluss', 'Effects, abgeleitete Daten und Listen stabil rendern.', [
      lesson('Effects', 'Effects sind für Synchronisation mit der Außenwelt da: Netzwerk, Browser APIs oder Subscriptions. Für reine Berechnungen brauchst du normalerweise keinen Effect.', 'useEffect(() => {\n  document.title = `${completedCount} lessons done`;\n}, [completedCount]);', 'Setze den Dokumenttitel abhängig von abgeschlossenen Lektionen.', 'Nutze Effects für Seiteneffekte, nicht für normale Berechnungen.', 'Jede State-Änderung in einem Effect nachbauen.', 'intermediate'),
      lesson('Derived State', 'Abgeleiteter State entsteht aus vorhandenen Daten. Wenn du ihn speicherst, riskierst du Widersprüche; berechne ihn lieber direkt oder mit useMemo bei teuren Listen.', 'const completedLessons = lessons.filter((lesson) => lesson.done);\nconst progress = completedLessons.length / lessons.length;', 'Berechne Fortschritt aus einer Lektionsliste.', 'Leite Fortschritt aus echten Daten ab.', 'completedCount separat speichern und manuell synchron halten.', 'intermediate'),
      lesson('Lists and Keys', 'Listen brauchen stabile Keys, damit React Elemente sauber zuordnen kann. IDs aus deinen Daten sind fast immer besser als Array-Indizes.', 'return lessons.map((lesson) => (\n  <li key={lesson.id}>{lesson.title}</li>\n));', 'Rendere eine Liste von Kursmodulen mit stabilen Keys.', 'Nutze fachliche IDs als key.', 'Array-Indizes als Standard-Key verwenden.', 'intermediate')
    ]),
    module('App-Praxis', 'Formulare, Loading States und Komponentengrenzen produktreif bauen.', [
      lesson('Forms', 'Formulare sind kontrollierte Datenflüsse: Eingabe lesen, validieren, absenden und Feedback zeigen. Schon kleine Formulare profitieren von klaren Feldnamen.', 'const [displayName, setDisplayName] = useState("");\n\n<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />;', 'Baue ein kontrolliertes Eingabefeld für den Anzeigenamen.', 'Halte Formularwerte explizit im State.', 'Input-Werte erst beim Debuggen aus dem DOM auslesen.'),
      lesson('Loading and Error States', 'Gute Apps zeigen nicht nur Erfolg, sondern auch Warten und Fehler. Diese Zustände sind Teil der UX und sollten im Komponentenmodell sichtbar sein.', 'if (status === "loading") return <p>Loading...</p>;\nif (status === "error") return <p>Try again.</p>;\nreturn <CourseList courses={courses} />;', 'Rendere Loading, Error und Success für eine Kursliste.', 'Plane UI-Zustände als erstes mit ein.', 'Nur leere Flächen zeigen, bis Daten zufällig da sind.', 'intermediate'),
      lesson('Component Boundaries', 'Komponentengrenzen sollten echten Verantwortungen folgen. Eine gute Grenze trennt Datenbeschaffung, Layout und wiederverwendbare UI, ohne unnötig viele Dateien zu erzeugen.', 'export function CourseSection({ courses }: { courses: Course[] }) {\n  return <section>{courses.map((course) => <CourseCard key={course.id} {...course} />)}</section>;\n}', 'Extrahiere eine Section, die mehrere CourseCards rendert.', 'Schneide Komponenten nach Verantwortung und Datenbedarf.', 'Eine komplette Seite als einzige riesige Komponente lassen.', 'advanced')
    ])
  ]),
  course('git', 'Git & GitHub', 'Git', 'Versionierung, Branches, Pull Requests und Team-Workflows.', '#f97316', 'from-[#f97316] to-[#b45309]', 'GT', 'bash', [
    module('Grundlagen', 'Status, Staging, Commits und Verlauf verstehen.', [
      lesson('Status lesen', 'git status ist dein Cockpit. Bevor du etwas committest oder pushst, zeigt es dir Branch, geänderte Dateien und ob etwas staged ist.', 'git status\n\ngit diff -- src/data/courses.ts', 'Prüfe den Arbeitsstand und schaue dir eine konkrete Datei-Diff an.', 'Lies Status und Diff, bevor du Dateien bündelst.', 'Blind alles stagen, ohne die Änderung gesehen zu haben.'),
      lesson('Staging', 'Staging ist die bewusste Auswahl für den nächsten Commit. Dadurch kannst du zusammengehörige Änderungen bündeln und unfertige Arbeit draußen lassen.', 'git add src/data/courses.ts\ngit add src/data/courses.test.ts\n\ngit status', 'Stage nur Kursdaten und Tests für einen Curriculum-Commit.', 'Stage nach fachlichem Zusammenhang, nicht nach Bequemlichkeit.', 'git add . verwenden, ohne den Status zu prüfen.'),
      lesson('Commits', 'Ein Commit ist ein nachvollziehbarer Schritt im Projektverlauf. Gute Commit Messages erklären Art und Absicht der Änderung, damit Review und Rollback leichter werden.', 'git commit -m "feat: expand learning curriculum"\n\ngit log --oneline -3', 'Erstelle eine Conventional-Commit-Message für eine neue Lernfunktion.', 'Halte Commits klein und benenne den Nutzen.', 'Mehrere unabhängige Features in einen Sammelcommit packen.')
    ]),
    module('Branches', 'Branching, Merging und Rebase ohne Chaos einsetzen.', [
      lesson('Branch erstellen', 'Branches geben dir einen separaten Arbeitsbereich für ein Feature. Sie helfen besonders, wenn mehrere Entwickler oder KI-Agenten parallel am Projekt arbeiten.', 'git switch -c codex/expand-curriculum\n\ngit branch --show-current', 'Lege einen Feature-Branch für Kursinhalte an und prüfe den Namen.', 'Nutze sprechende Branch-Namen mit Aufgabe oder Ticket.', 'Direkt auf main experimentieren, wenn parallele Arbeit läuft.', 'intermediate'),
      lesson('Merge', 'Ein Merge verbindet abgeschlossene Arbeit mit einem Zielbranch. Vorher sollten Tests laufen und der Branch aktuell genug sein, damit Konflikte klein bleiben.', 'git switch main\ngit merge codex/expand-curriculum\n\ngit status', 'Beschreibe den Ablauf, um einen fertigen Curriculum-Branch in main zu mergen.', 'Merge erst nach grünen Tests und geprüftem Diff.', 'Konflikte lösen, ohne die betroffenen Dateien zu verstehen.', 'intermediate'),
      lesson('Rebase', 'Rebase setzt deine Commits auf eine neuere Basis. Das macht Verlauf oft lesbarer, verlangt aber Disziplin, weil veröffentlichte Historie nicht leichtfertig umgeschrieben werden sollte.', 'git fetch origin\ngit rebase origin/main\n\ngit status', 'Skizziere, wann du einen lokalen Feature-Branch auf origin/main rebasen würdest.', 'Nutze Rebase für lokale Feature-Branches mit bewusstem Blick auf Konflikte.', 'Geteilte Branches umschreiben, ohne das Team zu informieren.', 'advanced')
    ]),
    module('Teamflow', 'Remote, Pull Requests und Konflikte professionell handhaben.', [
      lesson('Push', 'Push veröffentlicht lokale Commits auf GitHub. Vorher solltest du wissen, welche Commits voraus sind und ob die richtigen Dateien enthalten sind.', 'git log --oneline origin/main..HEAD\n\ngit push origin main', 'Prüfe lokale Commits und pushe danach den aktuellen Branch.', 'Kontrolliere vorauslaufende Commits vor dem Push.', 'Ungeprüft pushen und hoffen, dass CI es schon richtet.'),
      lesson('Pull Requests', 'Pull Requests sind Kommunikationsfläche und Qualitätskontrolle. Eine gute Beschreibung erklärt Ziel, Tests und Risiken, nicht nur welche Dateien geändert wurden.', 'gh pr create --title "Expand curriculum" --body "Adds TypeScript, React, Git, SQL, and Backend API tracks."', 'Formuliere Titel und Body für einen Curriculum-Pull-Request.', 'Beschreibe Nutzen, Prüfungen und offene Punkte.', 'PRs ohne Kontext öffnen und Reviewer raten lassen.', 'intermediate'),
      lesson('Konflikte lösen', 'Merge-Konflikte sind keine Katastrophe, sondern widersprüchliche Änderungen an derselben Stelle. Löse sie fachlich, teste danach und prüfe die finale Datei sorgfältig.', 'git status\n\ngit diff --check\n\ngit add src/data/courses.ts', 'Beschreibe einen sicheren Ablauf nach einem Konflikt in Kursdaten.', 'Prüfe Konfliktdateien, Whitespace und Tests nach der Lösung.', 'Konfliktmarker entfernen, ohne den Inhalt zu validieren.', 'intermediate')
    ])
  ]),
  course('sql', 'SQL', 'SQL', 'Daten abfragen, modellieren und sicher verändern.', '#22c55e', 'from-[#22c55e] to-[#0f766e]', 'DB', 'sql', [
    module('Lesen', 'SELECT, WHERE und Sortierung für App-Daten.', [
      lesson('SELECT', 'SELECT ist die Grundlage jeder Datenansicht. Gute Queries wählen gezielt Spalten aus, damit API und UI nur die Daten bekommen, die sie wirklich brauchen.', 'select lesson_id, completed_at\nfrom lesson_progress\nwhere user_id = \'user_123\';', 'Lies abgeschlossene Lektionen eines Users mit ausgewählten Spalten.', 'Wähle konkrete Spalten statt alles mit select star zu laden.', 'Jede Abfrage mit select * beginnen.'),
      lesson('WHERE', 'WHERE übersetzt fachliche Filter in Datenbanklogik. Wenn du Filter früh in SQL formulierst, muss die App weniger unnötige Daten laden und sortieren.', 'select id, title, difficulty\nfrom lessons\nwhere difficulty = \'intermediate\';', 'Filtere Lektionen nach Schwierigkeit.', 'Formuliere Filter in der Query, wenn die Datenbank sie effizient anwenden kann.', 'Alle Zeilen laden und im Frontend filtern.'),
      lesson('ORDER BY', 'Sortierung gehört zur fachlichen Aussage einer Liste. Ohne ORDER BY kann die Datenbank Reihenfolgen ändern, auch wenn es lokal zufällig stabil wirkt.', 'select title, xp\nfrom lessons\norder by xp desc, title asc;', 'Sortiere Lektionen nach XP absteigend und Titel aufsteigend.', 'Setze ORDER BY, wenn Reihenfolge für Nutzer sichtbar ist.', 'Sich auf zufällige Tabellenreihenfolge verlassen.')
    ]),
    module('Modellieren', 'Tabellen, Beziehungen und Indizes für Fortschrittsdaten bauen.', [
      lesson('CREATE TABLE', 'Tabellenmodellierung macht Regeln dauerhaft. Pflichtfelder, Primärschlüssel und Datentypen sollten ausdrücken, was deine App wirklich garantiert.', 'create table lesson_progress (\n  user_id uuid not null,\n  lesson_id text not null,\n  completed_at timestamptz not null,\n  primary key (user_id, lesson_id)\n);', 'Erstelle eine Tabelle für abgeschlossene Lektionen.', 'Setze Primärschlüssel so, dass doppelte Completions verhindert werden.', 'Duplikate später nur im Code herausfiltern.', 'intermediate'),
      lesson('Foreign Keys', 'Foreign Keys schützen Beziehungen zwischen Tabellen. Sie verhindern, dass Fortschritt auf nicht existierende Nutzer oder Lektionen zeigt.', 'create table quiz_attempts (\n  id uuid primary key,\n  user_id uuid references profiles(id),\n  lesson_id text not null\n);', 'Ergänze einen Fremdschlüssel von Attempts auf Profile.', 'Lass die Datenbank wichtige Beziehungen absichern.', 'Referenzen nur als lose Strings ohne Constraint speichern.', 'intermediate'),
      lesson('Indexes', 'Indizes beschleunigen häufige Suchmuster, kosten aber Speicher und Schreibzeit. Setze sie dort, wo echte Queries regelmäßig filtern oder sortieren.', 'create index lesson_progress_user_idx\non lesson_progress (user_id, completed_at desc);', 'Lege einen Index für die Fortschrittsliste eines Users an.', 'Indexiere konkrete Zugriffsmuster statt jede Spalte blind.', 'Indizes erst hinzufügen, nachdem alles langsam geworden ist.', 'advanced')
    ]),
    module('Ändern', 'INSERT, UPDATE, DELETE und Transaktionen verantwortungsvoll nutzen.', [
      lesson('INSERT', 'INSERT erzeugt neue Daten und sollte zu den Constraints der Tabelle passen. Bei Fortschritt ist besonders wichtig, doppelte Einträge kontrolliert zu behandeln.', 'insert into lesson_progress (user_id, lesson_id, completed_at)\nvalues (\'00000000-0000-0000-0000-000000000001\', \'sql-select\', now());', 'Füge einen abgeschlossenen Lektionsstand ein.', 'Schreibe Einfügungen passend zu Pflichtfeldern und Constraints.', 'Pflichtwerte leer lassen und auf spätere Korrektur hoffen.'),
      lesson('UPDATE', 'UPDATE ändert bestehende Daten und braucht fast immer ein präzises WHERE. Ohne Filter kann eine kleine Änderung die komplette Tabelle betreffen.', 'update profiles\nset display_name = \'Mina\'\nwhere id = \'00000000-0000-0000-0000-000000000001\';', 'Aktualisiere den Anzeigenamen eines Profils über die ID.', 'Nutze eindeutige Filter bei Änderungen.', 'UPDATE ohne WHERE in produktiven Daten ausführen.', 'intermediate'),
      lesson('Transactions', 'Transaktionen halten zusammengehörige Änderungen konsistent. Wenn XP, Completion und Activity gemeinsam gespeichert werden, sollten sie gemeinsam gelingen oder scheitern.', 'begin;\ninsert into lesson_progress (user_id, lesson_id, completed_at) values (\'00000000-0000-0000-0000-000000000001\', \'sql-transactions\', now());\nupdate profiles set xp = xp + 35 where id = \'00000000-0000-0000-0000-000000000001\';\ncommit;', 'Kombiniere Completion und XP-Update in einer Transaktion.', 'Nutze Transaktionen für fachlich zusammengehörige Schreibvorgänge.', 'Halb gespeicherte Zustände akzeptieren und später reparieren.', 'advanced')
    ])
  ]),
  course('backend', 'Backend APIs', 'API', 'HTTP, Validierung, Services und produktionsnahe API-Grenzen.', '#a78bfa', 'from-[#a78bfa] to-[#7c3aed]', 'API', 'typescript', [
    module('HTTP APIs', 'Routes, Statuscodes und Request-Validierung bewusst gestalten.', [
      lesson('Health Route', 'Eine Health Route ist klein, aber wichtig für Deployment und Monitoring. Sie sollte schnell antworten und keine schwere Fachlogik oder Datenbankabfragen erzwingen.', 'app.get("/health", (_request, response) => {\n  response.json({ status: "ok" });\n});', 'Erstelle eine Health Route, die JSON zurückgibt.', 'Halte Health Checks leichtgewichtig und eindeutig.', 'Health Checks mit komplexer Geschäftslogik vermischen.'),
      lesson('Status Codes', 'Statuscodes sind Teil des API-Vertrags. Clients können besser reagieren, wenn Erfolg, Validierungsfehler und fehlende Ressourcen unterscheidbar sind.', 'app.post("/lessons/:lessonId/complete", (request, response) => {\n  response.status(201).json({ lessonId: request.params.lessonId });\n});', 'Gib bei erfolgreicher Completion einen passenden Statuscode zurück.', 'Nutze Statuscodes als klare Signale für Clients.', 'Immer 200 senden, egal was passiert.'),
      lesson('Validation', 'Validierung gehört an die Grenze der API. Je früher ungültige Eingaben gestoppt werden, desto weniger defensive Sonderfälle brauchst du im Service-Code.', 'const schema = z.object({\n  lessonId: z.string().min(1),\n  userId: z.string().uuid()\n});\n\nconst input = schema.parse(request.body);', 'Validiere lessonId und userId eines Completion Requests.', 'Validiere externe Eingaben vor der Fachlogik.', 'Request Bodies direkt an Datenbankfunktionen weiterreichen.', 'intermediate')
    ]),
    module('Services', 'Businesslogik, Repositories und Fehler sauber trennen.', [
      lesson('Service Function', 'Services kapseln fachliche Regeln unabhängig vom Webframework. Dadurch kannst du Regeln testen, ohne HTTP-Requests oder Router zu simulieren.', 'export function awardCompletionXp(currentXp: number, reward: number): number {\n  return currentXp + reward;\n}', 'Schreibe eine Service-Funktion zum Berechnen neuer XP.', 'Halte fachliche Regeln außerhalb dünner Route Handler.', 'Alle Regeln direkt in Express-Callbacks schreiben.'),
      lesson('Repository Boundary', 'Repositories verstecken, wie Daten gespeichert werden. Das ist besonders nützlich, wenn localStorage später durch Supabase oder PostgreSQL ersetzt wird.', 'type ProgressRepository = {\n  completeLesson(userId: string, lessonId: string): Promise<void>;\n};\n\nasync function completeLesson(repository: ProgressRepository, userId: string, lessonId: string) {\n  await repository.completeLesson(userId, lessonId);\n}', 'Definiere ein Repository-Interface für Lesson Completion.', 'Trenne Speicherzugriff über eine kleine Schnittstelle.', 'Datenbankdetails in jeder Route wiederholen.', 'intermediate'),
      lesson('Typed Errors', 'Nicht jeder Fehler ist gleich. Eigene Error-Typen oder strukturierte Resultate helfen, Validierungsfehler, fehlende Daten und interne Probleme korrekt abzubilden.', 'class NotFoundError extends Error {\n  constructor(message: string) {\n    super(message);\n    this.name = "NotFoundError";\n  }\n}', 'Erstelle einen Fehler für nicht gefundene Ressourcen.', 'Unterscheide fachliche Fehler von technischen Ausfällen.', 'Alle Fehler als generic Error behandeln.', 'advanced')
    ]),
    module('Production', 'Auth, Rate Limits und Logging als Teil des Designs behandeln.', [
      lesson('Auth Context', 'Authentifizierung sollte früh in der Request-Pipeline geklärt werden. Danach arbeitet die Fachlogik mit einem klaren User-Kontext statt mit rohen Tokens.', 'type AuthenticatedRequest = Request & {\n  user: { id: string; role: "learner" | "admin" };\n};', 'Typisiere einen Request mit angemeldetem User-Kontext.', 'Reiche geprüfte User-Daten weiter, nicht rohe Tokens.', 'JWTs in jeder Service-Funktion neu parsen.', 'intermediate'),
      lesson('Rate Limits', 'Rate Limits schützen APIs vor Missbrauch und teuren Wiederholungen. Besonders KI-Hilfe, Login und Schreibendpunkte brauchen Grenzen und verständliche Fehlermeldungen.', 'app.use("/ai-hints", rateLimit({\n  windowMs: 60_000,\n  limit: 10\n}));', 'Setze ein Rate Limit für KI-Hilfe-Anfragen.', 'Begrenze teure oder sensible Endpunkte bewusst.', 'Alle Nutzer unbegrenzt KI-Anfragen senden lassen.', 'advanced'),
      lesson('Structured Logging', 'Strukturierte Logs machen Fehler auffindbar, ohne sensible Daten zu verraten. Logge IDs, Status und Dauer, aber keine Tokens, Passwörter oder vollständigen Prompts.', 'logger.info({ route: "/lessons/:id/complete", status: 201, durationMs: 42 }, "lesson completed");', 'Logge eine abgeschlossene Lesson Completion strukturiert.', 'Logge Ereignisse mit Kontext und ohne Secrets.', 'Komplette Request Bodies inklusive Secrets ausgeben.', 'intermediate')
    ])
  ]),
  course('automation', 'AI Automation', 'AI', 'No-Code-Flows, Webhooks, KI-Tools und agentische Workflows praxisnah modellieren.', '#7dd3fc', 'from-[#7dd3fc] to-[#8b5cf6]', 'AI', 'json', [
    module('Automation-Grundlagen', 'Trigger, Actions und Datenmapping wie in Make, Zapier oder n8n denken.', [
      lesson('Trigger und Actions', 'Eine Automation startet mit einem Trigger und führt danach klar getrennte Actions aus. Gute Flows sind klein, beobachtbar und haben eindeutige Eingaben, damit Fehler schnell gefunden werden.', '{\n  "trigger": "new_lead",\n  "action": "create_task",\n  "target": "crm"\n}', 'Modelliere eine Automation, die aus einem neuen Lead automatisch eine CRM-Aufgabe erzeugt.', 'Trenne Auslöser, Aktion und Zielsystem klar.', 'Alles in einen riesigen unbenannten Flow packen.'),
      lesson('Datenmapping', 'Datenmapping übersetzt Felder zwischen Tools. Wenn Namen, E-Mail und IDs sauber gemappt sind, bleibt der Flow stabil, auch wenn später weitere Systeme angeschlossen werden.', '{\n  "email": "{{lead.email}}",\n  "name": "{{lead.firstName}} {{lead.lastName}}",\n  "sourceId": "{{lead.id}}"\n}', 'Mappe Lead-Daten auf ein Kontaktobjekt mit Name, E-Mail und externer ID.', 'Dokumentiere jedes gemappte Feld bewusst.', 'Felder blind kopieren und hoffen, dass Typen passen.'),
      lesson('Webhooks', 'Webhooks verbinden Systeme ereignisbasiert. Wichtig sind Methode, URL, Payload und eine prüfbare Antwort, damit Automationen nicht still im Hintergrund scheitern.', '{\n  "method": "POST",\n  "url": "https://example.com/webhook",\n  "body": { "event": "lesson.completed" }\n}', 'Entwirf einen Webhook-Payload, der einen abgeschlossenen Kurs an ein anderes Tool sendet.', 'Sende strukturierte Events statt Freitext.', 'API-Keys direkt in sichtbare Payloads schreiben.')
    ]),
    module('KI-Automation', 'Prompts, Tool Calling und menschliche Freigaben sicher einsetzen.', [
      lesson('Prompt Inputs', 'KI-Automationen brauchen kontrollierte Eingaben. Ein guter Prompt trennt Rolle, Aufgabe und Daten, damit das Modell wiederholbar arbeitet und keine stillen Annahmen trifft.', '{\n  "role": "system",\n  "content": "Summarize customer requests as tasks.",\n  "input": "{{ticket.text}}"\n}', 'Beschreibe einen Prompt-Schritt, der Supporttickets zu Aufgaben zusammenfasst.', 'Trenne System-Anweisung und dynamische Eingabe.', 'Userdaten direkt ohne Kontext in den Prompt werfen.'),
      lesson('Tool Calling', 'Tool Calling macht KI nützlich, weil das Modell eine konkrete Aktion auslösen kann. Parameter müssen klein, typisiert und prüfbar sein, sonst wird der Workflow unzuverlässig.', '{\n  "name": "create_task",\n  "parameters": {\n    "title": "Follow up",\n    "priority": "high"\n  }\n}', 'Modelliere einen Tool-Call, der aus einer KI-Zusammenfassung eine Aufgabe erstellt.', 'Definiere Tool-Name und Parameter explizit.', 'Das Modell beliebige Freitext-Aktionen ausführen lassen.'),
      lesson('Human in the Loop', 'Bei riskanten Aktionen sollte ein Mensch freigeben, bevor etwas gesendet, gelöscht oder gekauft wird. Human-in-the-loop macht Automationen produktiv, ohne Kontrolle zu verlieren.', '{\n  "draft": "Approve before sending",\n  "requiresApproval": true,\n  "approver": "team_lead"\n}', 'Baue einen Freigabeschritt für eine automatisch formulierte Kundenantwort.', 'Kennzeichne riskante Aktionen mit Approval.', 'Jede KI-Antwort sofort ungeprüft versenden.', 'intermediate')
    ]),
    module('Agentic Workflows', 'Mehrschrittige Workflows planen, überwachen und absichern.', [
      lesson('Planen und Ausführen', 'Agentische Workflows zerlegen ein Ziel in Schritte und nutzen Tools nacheinander. Gute Agents haben ein klares Ziel, begrenzte Tools und sichtbare Zwischenergebnisse.', '{\n  "goal": "Prepare meeting brief",\n  "steps": ["search_crm", "summarize_notes", "draft_email"]\n}', 'Skizziere einen Agent-Workflow, der ein Meeting-Briefing vorbereitet.', 'Halte Ziel, Schritte und Tool-Namen sichtbar.', 'Dem Agent ohne Grenzen Zugriff auf alles geben.'),
      lesson('Fehlerbehandlung', 'Automation ist erst produktionsreif, wenn Fehlerwege geplant sind. Retries, Benachrichtigungen und Abbruchbedingungen verhindern doppelte Aktionen und stille Datenverluste.', '{\n  "onError": "retry_then_notify",\n  "maxRetries": 2,\n  "notify": "ops_channel"\n}', 'Definiere eine Fehlerstrategie für einen fehlgeschlagenen API-Schritt.', 'Begrenze Retries und informiere ein Team.', 'Endlos wiederholen, bis niemand mehr weiss warum.'),
      lesson('Logging und Sicherheit', 'Logs helfen beim Debuggen, dürfen aber keine sensiblen Daten verraten. Gute Workflows protokollieren Trigger, Tool und Ergebnis und maskieren Tokens, E-Mails oder Kundendaten.', '{\n  "log": ["trigger", "tool", "result"],\n  "redact": ["apiKey", "email", "customerNote"]\n}', 'Erstelle ein Logging-Konzept, das Ergebnisse sichtbar macht und sensible Felder maskiert.', 'Logge prüfbare Schritte und maskiere Geheimnisse.', 'Komplette Prompts und API-Keys in Logs speichern.', 'intermediate')
    ])
  ])
];

function course(
  id: LanguageId,
  title: string,
  shortName: string,
  description: string,
  accent: string,
  gradient: string,
  icon: string,
  codeLanguage: string,
  modules: ModuleSeed[]
): CourseSeed {
  return { id, title, shortName, description, accent, gradient, icon, codeLanguage, modules };
}

function module(title: string, description: string, lessons: LessonSeed[]): ModuleSeed {
  return { title, description, lessons };
}

function lesson(title: string, theory: string, code: string, task: string, bestPractice: string, trap: string, difficulty: Difficulty = 'basic'): LessonSeed {
  return { title, theory, code, task, bestPractice, trap, difficulty };
}

function buildCodingChallenge(courseSeed: CourseSeed, lessonSeed: LessonSeed) {
  return {
    prompt: `Schreibe selbst Code zur Aufgabe: ${lessonSeed.task}`,
    language: courseSeed.codeLanguage,
    starterCode: starterCodeFor(courseSeed.codeLanguage),
    solution: lessonSeed.code,
    requiredConcepts: buildConceptChecks(lessonSeed.code, lessonSeed.bestPractice)
  };
}

function starterCodeFor(language: string) {
  const starterByLanguage: Record<string, string> = {
    python: '# Write your solution here\n',
    csharp: '// Write your solution here\n',
    java: '// Write your solution here\n',
    html: '<!-- Write your markup here -->\n',
    css: '/* Write your styles here */\n',
    javascript: '// Write your solution here\n',
    typescript: '// Write your TypeScript solution here\n',
    tsx: '// Write your React component here\n',
    bash: '# Write your Git commands here\n',
    sql: '-- Write your SQL here\n',
    json: '{\n  "workflow": ""\n}\n'
  };

  return starterByLanguage[language] ?? '// Write your solution here\n';
}

function buildConceptChecks(code: string, bestPractice: string): CodingConceptCheck[] {
  const normalizedCode = code.toLowerCase();
  const preferredPatterns = [
    'def ',
    'return',
    'class ',
    'for ',
    'if ',
    'from ',
    '@app',
    'fastapi',
    'sqlmodel',
    'string',
    'int',
    'bool',
    'console.writeline',
    'static',
    'list<',
    'where',
    'select',
    'webapplication',
    'mapget',
    'controllerbase',
    'system.out.println',
    'list.of',
    'private final',
    'stream',
    '@restcontroller',
    '@service',
    'responseentity',
    '<main',
    '<article',
    '<nav',
    '<img',
    '<label',
    '<input',
    '<button',
    '<section',
    '<table',
    '<meta',
    'display: flex',
    'display: grid',
    '@media',
    'transition',
    'animation',
    'class=',
    'const',
    'document.queryselector',
    'addeventlistener',
    'fetch',
    'response.ok',
    'type ',
    'interface',
    'readonly',
    'unknown',
    'promise<',
    'usestate',
    'useeffect',
    'key=',
    'onclick',
    'function',
    'defineprops',
    'export function',
    'app.get',
    'async function',
    'try',
    'catch',
    'git status',
    'git add',
    'git commit',
    'git switch',
    'git merge',
    'git rebase',
    'git push',
    'gh pr create',
    'from ',
    'order by',
    'create table',
    'primary key',
    'references',
    'create index',
    'insert into',
    'update',
    'begin',
    'commit',
    'z.object',
    'response.status',
    'request.body',
    'ratelimit',
    'logger.info',
    '"trigger"',
    '"action"',
    '"email"',
    '"method"',
    '"url"',
    '"role"',
    '"input"',
    '"name"',
    '"parameters"',
    '"requiresapproval"',
    '"goal"',
    '"steps"',
    '"onerror"',
    '"maxretries"',
    '"log"',
    '"redact"'
  ];
  const selectedPatterns = preferredPatterns.filter((pattern) => normalizedCode.includes(pattern)).slice(0, 3);
  const fallbackPatterns = code
    .replace(/[{}()[\];,]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 4 && !selectedPatterns.some((pattern) => pattern.includes(token.toLowerCase())))
    .slice(0, 3 - selectedPatterns.length);
  const patterns = [...selectedPatterns, ...fallbackPatterns].slice(0, 3);

  return patterns.map((pattern, index) => ({
    id: `concept-${index + 1}`,
    label: pattern.replace(/["'<>]/g, '').trim(),
    pattern,
    hint: `${bestPractice} Achte besonders auf "${pattern.replace(/"/g, '')}".`
  }));
}

const BLANK_PLACEHOLDER = '____';

const blankTokensByLanguage: Record<string, string[]> = {
  python: ['yield', 'lambda', 'await', 'async', 'raise', 'except', 'enumerate', 'sorted', 'class', 'def', 'import', 'with', 'return', 'print', 'for', 'if'],
  csharp: ['interface', 'static', 'using', 'await', 'async', 'var', 'new', 'Console.WriteLine', 'class', 'return', 'public'],
  java: ['System.out.println', 'interface', 'stream', 'static', 'final', 'private', 'record', 'new', 'class', 'return', 'void'],
  javascript: ['addEventListener', 'defineProps', 'await', 'async', 'fetch', 'export', 'function', 'type', 'return', 'const', 'let'],
  typescript: ['interface', 'readonly', 'unknown', 'Promise', 'type', 'return', 'const', 'function', 'async', 'await', 'string', 'number'],
  tsx: ['useState', 'useEffect', 'return', 'export', 'function', 'type', 'key', 'onClick', 'className'],
  bash: ['git', 'status', 'add', 'commit', 'switch', 'branch', 'merge', 'rebase', 'push', 'diff'],
  sql: ['select', 'from', 'where', 'order', 'create', 'primary', 'references', 'index', 'insert', 'update', 'begin', 'commit'],
  css: ['grid', 'flex', 'transition', 'animation', 'min-height', 'media', 'padding', 'gap', 'transform']
};

const htmlBlankTags = ['nav', 'label', 'table', 'meta', 'article', 'main', 'button', 'input', 'section', 'img', 'thead', 'h1', 'h2'];

const jsonBlankKeys = ['requiresApproval', 'onError', 'redact', 'parameters', 'trigger', 'steps', 'goal', 'method', 'action', 'role', 'email', 'url', 'name'];

const quizFallbackDistractors = [
  'Erst über Struktur nachdenken, wenn das Projekt groß geworden ist.',
  'Nur prüfen, ob der Code einmal lokal durchläuft.',
  'Solche Details dem späteren Code-Review überlassen.',
  'Das Thema überspringen, weil es im Alltag selten gebraucht wird.',
  'Darauf vertrauen, dass der Editor das automatisch korrigiert.',
  'Das Thema vorerst den erfahrenen Kollegen überlassen.'
];

type PracticeQuestionVariant = {
  prompt: string;
  correct: string;
  distractors: [string, string];
  explanation: string;
};

const practiceQuestionVariants: PracticeQuestionVariant[] = [
  {
    prompt: 'Warum lohnt sich dieses Konzept im Team-Alltag?',
    correct: 'Weil Code wiederholt gelesen, getestet, reviewed und geändert wird.',
    distractors: ['Weil es nur für Interviewaufgaben relevant ist.', 'Weil Code nach dem Merge nie wieder angefasst wird.'],
    explanation: 'Professioneller Code wird selten nur einmal geschrieben: Kolleginnen lesen ihn im Review, Tests prüfen ihn bei jeder Änderung, und in einem halben Jahr musst du selbst wieder verstehen, was du gemeint hast. Deshalb lohnt sich jedes Konzept, das Code lesbarer und Grenzen klarer macht — es spart bei jeder späteren Änderung Zeit und verhindert Missverständnisse.'
  },
  {
    prompt: 'Du übernimmst fremden Code mit unklarer Struktur. Was hilft zuerst?',
    correct: 'Kleine, klar benannte Einheiten mit eindeutiger Verantwortung herstellen.',
    distractors: ['Alles sofort neu schreiben, ohne das Verhalten abzusichern.', 'Mehr Abkürzungen verwenden, damit der Code kürzer wird.'],
    explanation: 'Ein kompletter Neuanfang klingt verlockend, wirft aber alles weg, was der Code bereits richtig macht — und ohne Tests weißt du nicht, was du dabei kaputt machst. Besser: Schritt für Schritt kleine Einheiten herauslösen, ihnen sprechende Namen geben und jeweils eine klare Aufgabe zuweisen. So wächst Verständlichkeit, ohne dass das Verhalten sich unbemerkt ändert.'
  },
  {
    prompt: 'Was macht eine Lösung review-freundlich?',
    correct: 'Die Absicht ist erkennbar, ohne den Code im Kopf ausführen zu müssen.',
    distractors: ['Sie nutzt möglichst viele clevere Einzeiler.', 'Sie versteckt Details in globalen Variablen.'],
    explanation: 'Wer deinen Code reviewt, muss zwei Dinge erkennen: Was soll der Code tun, und was kann dabei schiefgehen? Clevere Einzeiler und versteckte globale Zustände zwingen den Reviewer, den Code im Kopf auszuführen — das ist langsam und fehleranfällig. Sichtbare Absicht (gute Namen, kleine Funktionen, klare Datenflüsse) macht Reviews schneller und sicherer.'
  },
  {
    prompt: 'Wie prüfst du am verlässlichsten, dass dein Code funktioniert?',
    correct: 'Mit einem kleinen, wiederholbaren Beispiel oder Test.',
    distractors: ['Indem der Code einmal ohne Fehlermeldung startet.', 'Indem sich eine Woche lang niemand beschwert.'],
    explanation: 'Dass ein Programm ohne Fehlermeldung startet, beweist nur, dass nichts sofort abstürzt — nicht, dass es das Richtige tut. Ein kleines, wiederholbares Beispiel (oder ein automatischer Test) prüft dagegen konkretes Verhalten: gleiche Eingabe, erwartete Ausgabe. Das kannst du nach jeder Änderung erneut laufen lassen und merkst sofort, wenn etwas kaputtgeht.'
  },
  {
    prompt: 'Was ist beim Benennen von Variablen und Funktionen am wichtigsten?',
    correct: 'Namen beschreiben Absicht und Inhalt aus Sicht des Lesers.',
    distractors: ['Namen so kurz wie möglich halten, um Tippzeit zu sparen.', 'Namen durchnummerieren, damit sie eindeutig bleiben.'],
    explanation: 'Code wird viel häufiger gelesen als geschrieben — von Kollegen, Reviewern und dir selbst in ein paar Monaten. Ein Name wie userXpAfterBonus erklärt sich sofort; bei x3 oder data2 muss jeder Leser erst den Code durchsuchen, um die Bedeutung zu rekonstruieren. Die paar gesparten Tastenanschläge kosten später ein Vielfaches an Lesezeit.'
  },
  {
    prompt: 'Wie gehst du mit Fehlerfällen in echten Apps um?',
    correct: 'Fehler an klaren Grenzen behandeln und verständlich melden.',
    distractors: ['Fehler global verschlucken, damit nichts abbricht.', 'Fehlerbehandlung auf die Zeit nach dem Launch verschieben.'],
    explanation: 'Ein still verschluckter Fehler verschwindet nicht — er taucht später als rätselhaftes Folgeproblem wieder auf, weit weg von seiner Ursache. Behandle Fehler deshalb dort, wo du sinnvoll reagieren kannst (z. B. Eingabe ablehnen, Standardwert setzen, Nutzer informieren), und melde sie verständlich. So bleiben Probleme früh sichtbar und lassen sich gezielt beheben.'
  },
  {
    prompt: 'Was unterscheidet Übungscode von produktionsreifem Code?',
    correct: 'Produktionscode plant Lesbarkeit, Fehlerfälle und Änderungen von Anfang an ein.',
    distractors: ['Produktionscode ist automatisch länger und komplizierter.', 'Übungscode braucht keine korrekte Syntax.'],
    explanation: 'Produktionsreif heißt nicht länger oder komplizierter — oft ist guter Produktionscode sogar einfacher. Der Unterschied liegt in den bewussten Entscheidungen: Was passiert bei ungültigen Eingaben? Wie findet der nächste Entwickler sich zurecht? Was muss getestet sein, bevor es live geht? Übungscode darf diese Fragen ignorieren, Produktionscode plant sie von Anfang an ein.'
  },
  {
    prompt: 'Warum sind kleine Schritte beim Entwickeln sinnvoll?',
    correct: 'Kleine Schritte machen Fehler schneller sichtbar und leichter rückgängig.',
    distractors: ['Kleine Schritte garantieren, dass keine Bugs entstehen.', 'Große Würfe sparen am Ende immer Zeit.'],
    explanation: 'Je kleiner der Schritt, desto kürzer die Zeit zwischen Fehler und Entdeckung: Wenn nach einer 10-Zeilen-Änderung etwas bricht, ist die Ursache fast immer in genau diesen 10 Zeilen. Nach einem großen Wurf mit 500 Zeilen suchst du dagegen stundenlang. Kleine Schritte verhindern keine Bugs — aber sie machen jeden Bug schnell auffindbar und leicht rückgängig.'
  }
];

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function rotate<T>(items: T[], offset: number): T[] {
  const shift = positiveModulo(offset, items.length);
  return [...items.slice(shift), ...items.slice(0, shift)];
}

function positiveModulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

function buildQuizOptions(entries: { correct: boolean; text: string }[], offset: number): { options: QuizOption[]; correctOptionId: string } {
  const ids = ['a', 'b', 'c'];
  const rotated = rotate(entries, offset);
  return {
    options: rotated.map((entry, index) => ({ id: ids[index], text: entry.text })),
    correctOptionId: ids[rotated.findIndex((entry) => entry.correct)]
  };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function blankCode(codeLanguage: string, code: string): { code: string; answer: string } {
  if (codeLanguage === 'html') {
    for (const tag of htmlBlankTags) {
      const pattern = new RegExp(`<${tag}(?=[\\s>/])`);
      if (pattern.test(code)) return { code: code.replace(pattern, `<${BLANK_PLACEHOLDER}`), answer: tag };
    }
  }

  if (codeLanguage === 'json') {
    for (const key of jsonBlankKeys) {
      const search = `"${key}"`;
      if (code.includes(search)) return { code: code.replace(search, `"${BLANK_PLACEHOLDER}"`), answer: key };
    }
  }

  for (const token of blankTokensByLanguage[codeLanguage] ?? []) {
    const pattern = new RegExp(`\\b${escapeRegExp(token)}\\b`);
    if (pattern.test(code)) return { code: code.replace(pattern, BLANK_PLACEHOLDER), answer: token };
  }

  const longestWord = [...code.matchAll(/[A-Za-z_][A-Za-z0-9_]{3,}/g)].map((match) => match[0]).sort((a, b) => b.length - a.length)[0];
  const answer = longestWord ?? code.trim().split(/\s+/)[0];
  return { code: code.replace(answer, BLANK_PLACEHOLDER), answer };
}

function buildFillBlank(codeLanguage: string, code: string, lessonTitle: string): FillBlankTask {
  const blanked = blankCode(codeLanguage, code);
  return {
    instruction: `Vervollständige das Codebeispiel aus "${lessonTitle}": Welcher Baustein gehört in die Lücke?`,
    code: blanked.code,
    answer: blanked.answer,
    hint: `Der gesuchte Baustein beginnt mit "${blanked.answer.slice(0, 1)}". Wirf notfalls noch einen Blick auf den Code-Schritt.`
  };
}

export const courses: Course[] = courseSeeds.map((courseSeed) => ({
  ...courseSeed,
  modules: courseSeed.modules.map((moduleSeed, moduleIndex): CourseModule => ({
    id: `${courseSeed.id}-module-${moduleIndex + 1}`,
    title: moduleSeed.title,
    description: moduleSeed.description,
    lessons: moduleSeed.lessons.map((lessonSeed, lessonIndex): Lesson => {
      const slug = lessonSeed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const id = `${courseSeed.id}-${slug || `lesson-${lessonIndex + 1}`}`;
      const difficulty = lessonSeed.difficulty ?? 'basic';
      const seedHash = hashString(id);
      const conceptQuestion = buildQuizOptions(
        [
          { correct: true, text: lessonSeed.bestPractice },
          { correct: false, text: lessonSeed.trap },
          { correct: false, text: quizFallbackDistractors[positiveModulo(seedHash, quizFallbackDistractors.length)] }
        ],
        positiveModulo(seedHash, 3)
      );
      const practiceVariant = practiceQuestionVariants[positiveModulo(seedHash >>> 3, practiceQuestionVariants.length)];
      const practiceQuestion = buildQuizOptions(
        [
          { correct: true, text: practiceVariant.correct },
          { correct: false, text: practiceVariant.distractors[0] },
          { correct: false, text: practiceVariant.distractors[1] }
        ],
        positiveModulo(seedHash >>> 5, 3)
      );
      return {
        id,
        title: lessonSeed.title,
        estimatedMinutes: 6 + lessonIndex * 2,
        xp: 35 + lessonIndex * 5,
        theory: lessonSeed.theory,
        codeExample: { language: courseSeed.codeLanguage, code: lessonSeed.code },
        fillBlank: buildFillBlank(courseSeed.codeLanguage, lessonSeed.code, lessonSeed.title),
        quiz: [
          {
            id: `${id}-q1`,
            prompt: `Welches Vorgehen passt am besten zum Thema "${lessonSeed.title}"?`,
            options: conceptQuestion.options,
            correctOptionId: conceptQuestion.correctOptionId,
            explanation: `${lessonSeed.bestPractice} Der typische Fehler an dieser Stelle: ${lessonSeed.trap} Wirf danach noch einmal einen Blick auf das Codebeispiel dieser Lektion — dort siehst du das empfohlene Muster im Einsatz.`,
            difficulty
          },
          {
            id: `${id}-q2`,
            prompt: practiceVariant.prompt,
            options: practiceQuestion.options,
            correctOptionId: practiceQuestion.correctOptionId,
            explanation: practiceVariant.explanation,
            difficulty: lessonIndex === 2 ? 'intermediate' : difficulty
          }
        ],
        practice: {
          prompt: lessonSeed.task,
          checklist: ['Benenne Daten und Verhalten klar.', 'Implementiere zuerst den normalen Fall.', 'Füge ein kleines Beispiel hinzu, das die Lösung beweist.'],
          hint: lessonSeed.bestPractice
        },
        codingChallenge: buildCodingChallenge(courseSeed, lessonSeed)
      };
    })
  }))
}));

export const getCourse = (courseId: string) => courses.find((courseItem) => courseItem.id === courseId);
export const getLesson = (lessonId: string) => courses.flatMap((courseItem) => courseItem.modules.flatMap((moduleItem) => moduleItem.lessons)).find((lessonItem) => lessonItem.id === lessonId);
export const allLessons = courses.flatMap((courseItem) => courseItem.modules.flatMap((moduleItem) => moduleItem.lessons.map((lessonItem) => ({ ...lessonItem, courseId: courseItem.id }))));
