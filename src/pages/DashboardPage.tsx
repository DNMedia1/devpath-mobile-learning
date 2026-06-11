import { CheckCircle2, Flame, Play, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { courses } from '../data/courses';
import { CourseCard } from '../components/CourseCard';
import { Header } from '../components/Header';
import { ProgressBar } from '../components/ProgressBar';
import { StatTile } from '../components/StatTile';
import { DAILY_BONUS_XP, getDailyQuests } from '../services/progressService';
import { useProgress } from '../store/ProgressContext';
import { getCourseProgress, getOverallProgress } from '../utils/learning';

export function DashboardPage() {
  const { progress, levelInfo } = useProgress();
  const overall = getOverallProgress(progress);
  const quests = getDailyQuests(progress);
  const questsDone = quests.filter((quest) => quest.done).length;
  const activeCourse = courses.find((course) => getCourseProgress(course, progress).percent < 100) ?? courses[0];
  const activeModule = activeCourse.modules[0];
  const activeLesson = activeModule.lessons.find((lesson) => !(progress.completedLessons[activeCourse.id] ?? []).includes(lesson.id)) ?? activeModule.lessons[0];

  return (
    <div>
      <Header title={`Hi ${progress.displayName}`} subtitle="Baue echte Entwicklerpraxis in kurzen täglichen Sessions auf." />

      <div className="lg:grid lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-4">
        <div>
      <section className="rounded-3xl border border-white/10 bg-panel p-5 shadow-glow">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-muted">Weiterlernen</p>
            <h2 className="mt-1 text-2xl font-black">{activeLesson.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{activeCourse.title} · {activeModule.title}</p>
          </div>
          <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${activeCourse.gradient} font-black text-ink`}>
            {activeCourse.icon}
          </div>
        </div>
        <div className="mt-5">
          <ProgressBar value={getCourseProgress(activeCourse, progress).percent} accent={activeCourse.accent} />
        </div>
        <Link to={`/lessons/${activeLesson.id}`} className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-text px-4 font-extrabold text-ink">
          <Play size={18} fill="currentColor" /> Lektion starten
        </Link>
      </section>

      <section className="mt-4 grid grid-cols-3 gap-3">
        <StatTile label="XP" value={progress.xp} tone="yellow" />
        <StatTile label="Level" value={levelInfo.level} tone="blue" />
        <StatTile label="Fertig" value={`${overall.percent}%`} tone="green" />
      </section>
        </div>

        <section className="mt-5 rounded-3xl border border-white/10 bg-panelSoft p-5 lg:mt-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-400/15 text-orange-200">
              <Flame size={22} />
            </div>
            <div>
              <h2 className="font-extrabold">Tagesziele</h2>
              <p className="text-sm text-muted">
                {progress.daily.bonusAwarded ? `Tagesbonus +${DAILY_BONUS_XP} XP erhalten!` : `Alle Ziele geschafft = +${DAILY_BONUS_XP} XP Bonus.`}
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-black">{questsDone}/{quests.length}</span>
        </div>
        <div className="mt-4 space-y-3">
          {quests.map((quest) => (
            <div key={quest.id}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className={`flex min-w-0 items-center gap-2 break-words font-bold ${quest.done ? 'text-emerald-200' : 'text-slate-200'}`}>
                  <CheckCircle2 size={16} className={`shrink-0 ${quest.done ? 'text-emerald-300' : 'text-muted'}`} /> {quest.title}
                </span>
                <span className="shrink-0 text-xs font-black text-muted">{Math.min(quest.current, quest.target)}/{quest.target}</span>
              </div>
              <div className="mt-1.5">
                <ProgressBar value={(Math.min(quest.current, quest.target) / quest.target) * 100} accent={quest.done ? '#86efac' : '#50a7ff'} />
              </div>
            </div>
          ))}
        </div>
          <Link to="/quiz" className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-extrabold">
            <Trophy size={18} /> Quiz üben
          </Link>
        </section>
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-black">Lernpfade</h2>
          <Link to="/courses" className="text-sm font-bold text-sky-200">Alle anzeigen</Link>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {courses.slice(0, 3).map((course) => <CourseCard key={course.id} course={course} />)}
        </div>
      </section>
    </div>
  );
}
