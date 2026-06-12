import { AlertTriangle, Brain, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { StatTile } from '../components/StatTile';
import { allLessons, courses } from '../data/courses';
import type { SkillTag } from '../models/learning';
import { useLearningActivity } from '../store/LearningActivityContext';

const skillLabels: Record<SkillTag, string> = {
  variables: 'Variablen',
  functions: 'Funktionen',
  arrays: 'Arrays & Listen',
  objects: 'Objekte',
  async: 'Async',
  http: 'HTTP & APIs',
  'react-state': 'React State',
  'react-effects': 'React Effects',
  'sql-joins': 'SQL Joins',
  'git-branches': 'Git Branches',
  debugging: 'Debugging',
  'clean-code': 'Clean Code',
  'api-design': 'API Design',
  'automation-webhooks': 'Automation Webhooks'
};

export function MistakesPage() {
  const { activity, dueReviews, weakSkillTags } = useLearningActivity();
  const recentMistakes = activity.mistakes.slice(0, 8);

  return (
    <div>
      <Header title="Meine Fehler" subtitle="Sieh, welche Skills noch wackeln, und wiederhole gezielt statt zufällig." />

      <section className="grid grid-cols-3 gap-3">
        <StatTile label="Fehler" value={activity.mistakes.length} tone="yellow" />
        <StatTile label="Reviews" value={dueReviews.length} tone="blue" />
        <StatTile label="Skills" value={weakSkillTags.length} tone="purple" />
      </section>

      <section className="mt-5 rounded-3xl border border-white/10 bg-panel p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-violet-300/10 text-violet-100">
            <Brain size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black">Häufige Skill-Schwächen</h2>
            <p className="mt-1 text-sm leading-6 text-muted">Diese Tags kommen in falschen Antworten am häufigsten vor.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-2">
          {weakSkillTags.length > 0 ? weakSkillTags.slice(0, 6).map((item) => (
            <div key={item.skillTag} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <span className="text-sm font-extrabold">{skillLabels[item.skillTag]}</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-muted">{item.count}x</span>
            </div>
          )) : (
            <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-muted">
              Noch keine Skill-Schwächen gespeichert. Beantworte Quizfragen, dann entsteht hier dein persönliches Fehlerprofil.
            </p>
          )}
        </div>
      </section>

      <section className="mt-5 rounded-3xl border border-white/10 bg-panel p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-300/10 text-sky-100">
              <RotateCcw size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black">Fällige Wiederholungen</h2>
              <p className="mt-1 text-sm leading-6 text-muted">Aufgaben, die dein lokaler Review-Plan jetzt wieder sehen möchte.</p>
            </div>
          </div>
          <Link to="/quiz" className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black">
            Üben
          </Link>
        </div>
        <div className="mt-4 grid gap-2">
          {dueReviews.length > 0 ? dueReviews.slice(0, 5).map((card) => {
            const lesson = allLessons.find((item) => item.exercises.some((exercise) => exercise.id === card.exerciseId));
            const course = courses.find((item) => item.id === lesson?.courseId);
            return (
              <Link key={card.exerciseId} to={lesson ? `/lessons/${lesson.id}` : '/quiz'} className="block rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-sm font-extrabold">{lesson?.title ?? 'Quizfrage wiederholen'}</p>
                <p className="mt-1 text-xs font-bold text-muted">{course?.title ?? 'Gemischtes Quiz'} · {card.wrongCount} Fehler · Serie {card.correctStreak}</p>
              </Link>
            );
          }) : (
            <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-muted">
              Gerade ist nichts fällig. Neue Wiederholungen entstehen automatisch nach Quizantworten.
            </p>
          )}
        </div>
      </section>

      <section className="mt-5 rounded-3xl border border-white/10 bg-panel p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-yellow-300/10 text-yellow-100">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black">Falsche Antworten</h2>
            <p className="mt-1 text-sm leading-6 text-muted">Die letzten Fehlgriffe mit Feedback aus der jeweiligen Antwortoption.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          {recentMistakes.length > 0 ? recentMistakes.map((mistake) => {
            const lesson = allLessons.find((item) => item.id === mistake.lessonId);
            const course = courses.find((item) => item.id === mistake.courseId);
            return (
              <article key={mistake.exerciseId} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-muted">{course?.title ?? 'Kurs'} · {lesson?.title ?? 'Lektion'}</p>
                <p className="mt-2 text-sm leading-6 text-red-100">Deine Antwort: {mistake.selectedAnswer}</p>
                <p className="mt-1 text-sm leading-6 text-emerald-100">Richtig: {mistake.correctAnswer}</p>
                <p className="mt-3 text-sm leading-6 text-muted">{mistake.feedback}</p>
              </article>
            );
          }) : (
            <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-muted">
              Noch keine falschen Antworten gespeichert. Das ist entweder frisch oder erfreulich sauber.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
