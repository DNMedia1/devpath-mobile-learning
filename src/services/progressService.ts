import type { DailyActivity, DailyQuest, LanguageId, LevelInfo, QuizAnswer, UserProgress } from '../models/learning';

const STORAGE_KEY = 'devpath-progress-v1';
export const DAILY_BONUS_XP = 30;
const todayIso = () => new Date().toISOString().slice(0, 10);

const emptyDaily = (date: string): DailyActivity => ({
  date,
  lessonsCompleted: 0,
  quizCorrect: 0,
  xpEarned: 0,
  bonusAwarded: false
});

export const defaultProgress: UserProgress = {
  displayName: 'Entwickler',
  avatarTone: 'blue',
  xp: 0,
  streak: 1,
  bestStreak: 1,
  quizCorrectTotal: 0,
  lastActiveDate: todayIso(),
  completedLessons: {},
  quizMistakes: [],
  dailyGoal: 2,
  daily: emptyDaily(todayIso()),
  theme: 'dark'
};

export function calculateLevel(xp: number): LevelInfo {
  const level = Math.floor(xp / 120) + 1;
  const currentLevelXp = (level - 1) * 120;
  const nextLevelXp = level * 120;
  const progress = Math.min(100, Math.round(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));
  return { level, currentLevelXp, nextLevelXp, progress };
}

export function getDailyQuests(progress: UserProgress, date = todayIso()): DailyQuest[] {
  const daily = progress.daily.date === date ? progress.daily : emptyDaily(date);
  const quests = [
    { id: 'lessons', title: `${progress.dailyGoal} ${progress.dailyGoal === 1 ? 'Lektion' : 'Lektionen'} abschließen`, target: progress.dailyGoal, current: daily.lessonsCompleted },
    { id: 'quiz', title: '5 Quizfragen richtig beantworten', target: 5, current: daily.quizCorrect },
    { id: 'xp', title: '80 XP sammeln', target: 80, current: daily.xpEarned }
  ];
  return quests.map((quest) => ({ ...quest, done: quest.current >= quest.target }));
}

export function completeLesson(
  progress: UserProgress,
  courseId: LanguageId,
  lessonId: string,
  xp: number,
  date = todayIso()
): UserProgress {
  const courseLessons = progress.completedLessons[courseId] ?? [];
  if (courseLessons.includes(lessonId)) {
    return progress;
  }

  const active = withActivityDate(progress, date);
  return applyDailyBonus({
    ...active,
    xp: active.xp + xp,
    completedLessons: {
      ...active.completedLessons,
      [courseId]: [...courseLessons, lessonId]
    },
    daily: {
      ...active.daily,
      lessonsCompleted: active.daily.lessonsCompleted + 1,
      xpEarned: active.daily.xpEarned + xp
    }
  });
}

export function gradeQuiz(answers: QuizAnswer[], progress: UserProgress, date = todayIso()) {
  const missed = answers.filter((answer) => answer.selectedOptionId !== answer.correctOptionId).map((answer) => answer.questionId);
  const score = answers.length - missed.length;
  const nextMistakes = Array.from(new Set([...progress.quizMistakes.filter((id) => !answers.some((a) => a.questionId === id)), ...missed]));
  const xpGained = score * 12;

  const active = withActivityDate(progress, date);
  const nextProgress = applyDailyBonus({
    ...active,
    xp: active.xp + xpGained,
    quizCorrectTotal: active.quizCorrectTotal + score,
    quizMistakes: nextMistakes,
    daily: {
      ...active.daily,
      quizCorrect: active.daily.quizCorrect + score,
      xpEarned: active.daily.xpEarned + xpGained
    }
  });

  return {
    score,
    total: answers.length,
    percentage: answers.length === 0 ? 0 : Math.round((score / answers.length) * 100),
    nextProgress
  };
}

export function loadProgress(): UserProgress {
  if (typeof localStorage === 'undefined') return defaultProgress;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultProgress;

  try {
    const stored = { ...defaultProgress, ...JSON.parse(raw) } as UserProgress;
    const today = todayIso();
    const daily = { ...emptyDaily(today), ...stored.daily };
    const normalized: UserProgress = {
      ...stored,
      bestStreak: Math.max(stored.bestStreak ?? 1, stored.streak),
      quizCorrectTotal: stored.quizCorrectTotal ?? 0,
      daily: daily.date === today ? daily : emptyDaily(today)
    };
    return normalized.displayName === 'Developer' ? { ...normalized, displayName: 'Entwickler' } : normalized;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
}

function withActivityDate(progress: UserProgress, date: string): UserProgress {
  const streak = updateStreak(progress.lastActiveDate, progress.streak, date);
  return {
    ...progress,
    streak,
    bestStreak: Math.max(progress.bestStreak ?? 1, streak),
    lastActiveDate: date,
    daily: progress.daily.date === date ? progress.daily : emptyDaily(date)
  };
}

function applyDailyBonus(progress: UserProgress): UserProgress {
  if (progress.daily.bonusAwarded) return progress;
  const quests = getDailyQuests(progress, progress.daily.date);
  if (!quests.every((quest) => quest.done)) return progress;

  return {
    ...progress,
    xp: progress.xp + DAILY_BONUS_XP,
    daily: {
      ...progress.daily,
      xpEarned: progress.daily.xpEarned + DAILY_BONUS_XP,
      bonusAwarded: true
    }
  };
}

function updateStreak(lastActiveDate: string, currentStreak: number, date: string) {
  const previous = new Date(`${lastActiveDate}T00:00:00`);
  const current = new Date(`${date}T00:00:00`);
  const diffDays = Math.round((current.getTime() - previous.getTime()) / 86_400_000);
  if (diffDays === 0) return currentStreak;
  if (diffDays === 1) return currentStreak + 1;
  return 1;
}
