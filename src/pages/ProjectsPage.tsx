import { useState } from 'react';
import { Header } from '../components/Header';
import { courses } from '../data/courses';
import { projects } from '../data/projects';
import type { Difficulty, LanguageId } from '../models/learning';

const difficultyLabels: Record<Difficulty, string> = {
  basic: 'Basis',
  intermediate: 'Mittel',
  advanced: 'Fortgeschritten'
};

const difficultyTones: Record<Difficulty, string> = {
  basic: 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100',
  intermediate: 'border-sky-300/40 bg-sky-300/10 text-sky-100',
  advanced: 'border-violet-300/40 bg-violet-300/10 text-violet-100'
};

export function ProjectsPage() {
  const [courseFilter, setCourseFilter] = useState<LanguageId | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const projectCourses = courses.filter((course) => projects.some((project) => project.courseId === course.id));
  const visibleProjects = projects.filter(
    (project) =>
      (courseFilter === 'all' || project.courseId === courseFilter) &&
      (difficultyFilter === 'all' || project.difficulty === difficultyFilter)
  );

  return (
    <div>
      <Header title="Projekte" subtitle="Kleine Portfolio-Übungen mit Anforderungen, Hinweisen und Lösungsnotizen." />
      <div className="mb-3 flex flex-wrap gap-2">
        <FilterChip active={courseFilter === 'all'} onClick={() => setCourseFilter('all')}>Alle Kurse</FilterChip>
        {projectCourses.map((course) => (
          <FilterChip key={course.id} active={courseFilter === course.id} onClick={() => setCourseFilter(course.id)}>
            {course.shortName}
          </FilterChip>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <FilterChip active={difficultyFilter === 'all'} onClick={() => setDifficultyFilter('all')}>Jede Stufe</FilterChip>
        {(Object.keys(difficultyLabels) as Difficulty[]).map((level) => (
          <FilterChip key={level} active={difficultyFilter === level} onClick={() => setDifficultyFilter(level)}>
            {difficultyLabels[level]}
          </FilterChip>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {visibleProjects.map((project) => {
          const course = courses.find((item) => item.id === project.courseId)!;
          return (
            <article key={project.id} className="rounded-3xl border border-white/10 bg-panel p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${course.gradient} text-xs font-black text-ink`}>
                    {course.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{course.title}</p>
                    <h2 className="mt-1 break-words text-xl font-black">{project.title}</h2>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-muted">{project.duration}</span>
              </div>
              <span className={`mt-3 inline-block rounded-full border px-3 py-1 text-xs font-black ${difficultyTones[project.difficulty]}`}>
                {difficultyLabels[project.difficulty]}
              </span>
              <p className="mt-3 text-sm leading-6 text-slate-200">{project.summary}</p>
              <div className="mt-4 grid gap-3">
                <DetailList title="Anforderungen" items={project.requirements} />
                <DetailList title="Hinweise" items={project.hints} />
                <DetailList title="Lösungsnotizen" items={project.solutionNotes} />
              </div>
            </article>
          );
        })}
      </div>
      {visibleProjects.length === 0 ? (
        <p className="rounded-3xl border border-white/10 bg-panel p-5 text-sm leading-6 text-muted">
          Keine Projekte für diese Kombination. Wähle einen anderen Kurs oder eine andere Stufe.
        </p>
      ) : null}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`min-h-10 rounded-2xl border border-white/10 px-4 text-sm font-extrabold transition ${active ? 'bg-text text-ink' : 'bg-panel text-muted'}`}
    >
      {children}
    </button>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <details className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <summary className="cursor-pointer text-sm font-extrabold">{title}</summary>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </details>
  );
}
