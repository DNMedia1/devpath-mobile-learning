import { Award, Flame, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { ProgressBar } from '../components/ProgressBar';
import { StatTile } from '../components/StatTile';
import { courses } from '../data/courses';
import { getBadgeStates } from '../services/badgeService';
import { useProgress } from '../store/ProgressContext';
import { getCourseProgress, getOverallProgress } from '../utils/learning';

export function ProfilePage() {
  const { progress, levelInfo } = useProgress();
  const overall = getOverallProgress(progress);
  const completedCourses = courses.filter((course) => getCourseProgress(course, progress).percent === 100).length;
  const badgeStates = getBadgeStates(progress);
  const earnedCount = badgeStates.filter((state) => state.earned).length;

  return (
    <div>
      <Header title="Profil" subtitle="Dein lokales Lernprofil als Entwickler." />
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-4">
        <div>
      <section className="rounded-3xl border border-white/10 bg-panel p-5 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-sky-300 to-violet-300 text-3xl font-black text-ink">
          {progress.displayName.slice(0, 1).toUpperCase()}
        </div>
        <h2 className="mt-4 text-2xl font-black">{progress.displayName}</h2>
        <p className="mt-1 text-sm text-muted">Level {levelInfo.level} Entwickler · {progress.xp} XP</p>
        <div className="mt-5">
          <ProgressBar value={levelInfo.progress} accent="#7dd3fc" />
          <p className="mt-2 text-xs font-bold text-muted">{levelInfo.nextLevelXp - progress.xp} XP bis zum naechsten Level</p>
        </div>
      </section>
      <section className="mt-4 grid grid-cols-3 gap-3">
        <StatTile label="Streak" value={progress.streak} tone="yellow" />
        <StatTile label="Kurse" value={completedCourses} tone="green" />
        <StatTile label="Total" value={`${overall.percent}%`} tone="purple" />
      </section>
        </div>
        <section className="mt-5 rounded-3xl border border-white/10 bg-panel p-5 lg:mt-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black">Badges</h2>
          <span className="text-sm font-bold text-muted">{earnedCount}/{badgeStates.length}</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {badgeStates.map(({ badge, earned }) => (
            <div
              key={badge.id}
              title={badge.description}
              className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-center ${earned ? 'border-yellow-300/40 bg-yellow-300/10' : 'border-white/10 bg-white/5 opacity-45'}`}
            >
              <span className="text-2xl" aria-hidden>{badge.icon}</span>
              <span className="text-[11px] font-extrabold leading-4">{badge.title}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-muted">Bester Streak bisher: {progress.bestStreak} Tage · {progress.quizCorrectTotal} richtige Quizantworten</p>
        </section>
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <Link to="/progress" className="profile-link"><GraduationCap size={20} /> Fortschritt ansehen</Link>
        <Link to="/projects" className="profile-link"><Award size={20} /> Praxisprojekte</Link>
        <Link to="/quiz" className="profile-link"><Flame size={20} /> Fehler wiederholen</Link>
      </div>
    </div>
  );
}
