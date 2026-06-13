import { describe, expect, it } from 'vitest';
import { DAILY_BONUS_XP, calculateLevel, completeBossFight, completeLesson, getDailyQuests, gradeQuiz } from '@/services/progressService';
import type { UserProgress } from '@/models/learning';

const baseProgress: UserProgress = {
  displayName: 'Dominik',
  avatarTone: 'blue',
  xp: 90,
  streak: 1,
  bestStreak: 1,
  quizCorrectTotal: 0,
  lastActiveDate: '2026-06-10',
  completedLessons: {},
  completedBossFights: [],
  quizMistakes: [],
  dailyGoal: 2,
  daily: { date: '2026-06-10', lessonsCompleted: 1, quizCorrect: 2, xpEarned: 47, bonusAwarded: false },
  theme: 'dark'
};

describe('progressService', () => {
  it('calculates developer levels from total XP', () => {
    expect(calculateLevel(0)).toEqual({ level: 1, currentLevelXp: 0, nextLevelXp: 120, progress: 0 });
    expect(calculateLevel(250).level).toBe(3);
    expect(calculateLevel(250).progress).toBeGreaterThan(0);
  });

  it('completes a lesson once and awards XP idempotently', () => {
    const first = completeLesson(baseProgress, 'python', 'python-variablen-und-typen', 40, '2026-06-11');
    const second = completeLesson(first, 'python', 'python-variablen-und-typen', 40, '2026-06-11');

    expect(first.xp).toBe(130);
    expect(first.completedLessons.python).toContain('python-variablen-und-typen');
    expect(second.xp).toBe(130);
    expect(second.completedLessons.python).toHaveLength(1);
  });

  it('continues the streak and resets daily counters on a new day', () => {
    const next = completeLesson(baseProgress, 'python', 'python-kontrollfluss', 40, '2026-06-11');

    expect(next.streak).toBe(2);
    expect(next.bestStreak).toBe(2);
    expect(next.daily).toEqual({ date: '2026-06-11', lessonsCompleted: 1, quizCorrect: 0, xpEarned: 40, bonusAwarded: false });
  });

  it('grades quiz attempts, tracks mistakes and keeps the streak alive', () => {
    const result = gradeQuiz(
      [
        { questionId: 'q1', correctOptionId: 'a', selectedOptionId: 'a' },
        { questionId: 'q2', correctOptionId: 'b', selectedOptionId: 'a' }
      ],
      baseProgress,
      '2026-06-11'
    );

    expect(result.score).toBe(1);
    expect(result.total).toBe(2);
    expect(result.nextProgress.quizMistakes).toContain('q2');
    expect(result.nextProgress.quizMistakes).not.toContain('q1');
    expect(result.nextProgress.quizCorrectTotal).toBe(1);
    expect(result.nextProgress.streak).toBe(2);
    expect(result.nextProgress.daily.quizCorrect).toBe(1);
  });

  it('awards the daily bonus exactly once when all quests are done', () => {
    const nearlyDone: UserProgress = {
      ...baseProgress,
      dailyGoal: 1,
      lastActiveDate: '2026-06-11',
      daily: { date: '2026-06-11', lessonsCompleted: 0, quizCorrect: 5, xpEarned: 50, bonusAwarded: false }
    };

    const withBonus = completeLesson(nearlyDone, 'css', 'css-flexbox', 35, '2026-06-11');
    expect(withBonus.daily.bonusAwarded).toBe(true);
    expect(withBonus.xp).toBe(nearlyDone.xp + 35 + DAILY_BONUS_XP);

    const afterSecondLesson = completeLesson(withBonus, 'css', 'css-css-grid', 40, '2026-06-11');
    expect(afterSecondLesson.xp).toBe(withBonus.xp + 40);
  });

  it('reports daily quests against a fresh day when stored activity is stale', () => {
    const quests = getDailyQuests(baseProgress, '2026-06-12');

    expect(quests).toHaveLength(3);
    expect(quests.every((quest) => quest.current === 0 && !quest.done)).toBe(true);
  });

  it('awards boss-fight XP once without counting it as a lesson', () => {
    const first = completeBossFight(baseProgress, 'python-module-1-boss-fight', 90, '2026-06-11');
    const second = completeBossFight(first, 'python-module-1-boss-fight', 90, '2026-06-11');

    expect(first.xp).toBe(baseProgress.xp + 90);
    expect(first.completedBossFights).toContain('python-module-1-boss-fight');
    expect(first.daily.lessonsCompleted).toBe(0);
    expect(first.daily.xpEarned).toBe(90);
    expect(second.xp).toBe(first.xp);
    expect(second.completedBossFights).toHaveLength(1);
  });
});
