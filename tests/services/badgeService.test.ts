import { describe, expect, it } from 'vitest';
import { getBadgeStates, getNewlyEarnedBadges } from '@/services/badgeService';
import { courses } from '@/data/courses';
import type { UserProgress } from '@/models/learning';

const emptyProgress: UserProgress = {
  displayName: 'Dominik',
  avatarTone: 'blue',
  xp: 0,
  streak: 1,
  bestStreak: 1,
  quizCorrectTotal: 0,
  lastActiveDate: '2026-06-11',
  completedLessons: {},
  completedBossFights: [],
  quizMistakes: [],
  dailyGoal: 2,
  daily: { date: '2026-06-11', lessonsCompleted: 0, quizCorrect: 0, xpEarned: 0, bonusAwarded: false },
  theme: 'dark'
};

const earnedIds = (progress: UserProgress) =>
  getBadgeStates(progress)
    .filter((state) => state.earned)
    .map((state) => state.badge.id);

describe('badgeService', () => {
  it('starts without earned badges', () => {
    expect(earnedIds(emptyProgress)).toHaveLength(0);
  });

  it('awards the first-lesson badge and reports it as newly earned', () => {
    const after: UserProgress = { ...emptyProgress, completedLessons: { python: ['python-variablen-und-typen'] } };

    expect(earnedIds(after)).toContain('first-lesson');
    expect(getNewlyEarnedBadges(emptyProgress, after).map((badge) => badge.id)).toEqual(['first-lesson']);
  });

  it('awards streak badges based on the best streak', () => {
    const after: UserProgress = { ...emptyProgress, bestStreak: 7 };
    const ids = earnedIds(after);

    expect(ids).toContain('streak-3');
    expect(ids).toContain('streak-7');
    expect(ids).not.toContain('streak-14');
  });

  it('awards the course badge when every lesson of a course is completed', () => {
    const html = courses.find((course) => course.id === 'html')!;
    const allHtmlLessons = html.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id));
    const after: UserProgress = { ...emptyProgress, completedLessons: { html: allHtmlLessons } };

    expect(earnedIds(after)).toContain('course-complete');
  });

  it('awards level and quiz badges from xp and correct answers', () => {
    const after: UserProgress = { ...emptyProgress, xp: 500, quizCorrectTotal: 25 };
    const ids = earnedIds(after);

    expect(ids).toContain('level-5');
    expect(ids).toContain('quiz-25');
    expect(ids).not.toContain('level-10');
  });
});
