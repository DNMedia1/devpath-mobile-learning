import { Header } from '../components/Header';
import { ProgressBar } from '../components/ProgressBar';
import { courses } from '../data/courses';
import { useProgress } from '../store/ProgressContext';
import { getCourseProgress, getOverallProgress } from '../utils/learning';

export function ProgressPage() {
  const { progress } = useProgress();
  const overall = getOverallProgress(progress);

  return (
    <div>
      <Header title="Fortschritt" subtitle="Ein klarer Blick auf Kurse, Module, Lektionen und Quizpraxis." />
      <section className="rounded-3xl border border-white/10 bg-panel p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black">Gesamt</h2>
          <span className="text-sm font-bold text-muted">{overall.completed}/{overall.total} Lektionen</span>
        </div>
        <div className="mt-4"><ProgressBar value={overall.percent} accent="#86efac" /></div>
      </section>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {courses.map((course) => {
          const stats = getCourseProgress(course, progress);
          return (
            <section key={course.id} className="rounded-2xl border border-white/10 bg-panel p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${course.gradient} text-xs font-black text-ink`}>{course.icon}</div>
                  <div>
                    <h2 className="font-extrabold">{course.title}</h2>
                    <p className="text-xs text-muted">{stats.completed}/{stats.total} Lektionen</p>
                  </div>
                </div>
                <span className="text-sm font-black">{stats.percent}%</span>
              </div>
              <div className="mt-3"><ProgressBar value={stats.percent} accent={course.accent} /></div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
