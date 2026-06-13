import { describe, expect, it } from 'vitest';
import { courses } from '@/data/courses';
import type { UserProgress } from '@/models/learning';
import { createReviewCard } from '@/services/reviewService';
import { getTodayLearningRecommendation } from '@/services/recommendationService';

const freshProgress: UserProgress = {
  displayName: 'Dominik',
  avatarTone: 'blue',
  xp: 0,
  streak: 1,
  bestStreak: 1,
  quizCorrectTotal: 0,
  lastActiveDate: '2026-06-13',
  completedLessons: {},
  completedBossFights: [],
  quizMistakes: [],
  dailyGoal: 2,
  daily: { date: '2026-06-13', lessonsCompleted: 0, quizCorrect: 0, xpEarned: 0, bonusAwarded: false },
  theme: 'dark'
};

describe('recommendationService', () => {
  it('prefers due reviews before the next lesson', () => {
    const dueReview = {
      ...createReviewCard('python-variablen-und-typen-q1', '2026-06-13T10:00:00.000Z'),
      nextReviewAt: '2026-06-13T10:00:00.000Z'
    };

    const recommendation = getTodayLearningRecommendation({
      courses,
      progress: freshProgress,
      dueReviews: [dueReview],
      now: '2026-06-13T10:05:00.000Z'
    });

    expect(recommendation.dueReviewCount).toBe(1);
    expect(recommendation.primaryAction).toBe('review');
    expect(recommendation.primaryActionLabel).toBe('Fehler wiederholen');
  });

  it('recommends the next unfinished lesson with a mini code challenge', () => {
    const recommendation = getTodayLearningRecommendation({
      courses,
      progress: {
        ...freshProgress,
        completedLessons: { python: ['python-variablen-und-typen'] }
      },
      dueReviews: [],
      now: '2026-06-13T10:05:00.000Z'
    });

    expect(recommendation.primaryAction).toBe('lesson');
    expect(recommendation.nextLessonId).toBe('python-kontrollfluss');
    expect(recommendation.nextLessonTitle).toBe('Kontrollfluss');
    expect(recommendation.miniChallengeExerciseId.length).toBeGreaterThan(0);
    expect(recommendation.miniChallengeTitle).toMatch(/Challenge|Code|Baustein|Projekt/i);
  });

  it('switches to a challenge focus when the daily lesson goal is already done', () => {
    const recommendation = getTodayLearningRecommendation({
      courses,
      progress: {
        ...freshProgress,
        daily: { date: '2026-06-13', lessonsCompleted: 2, quizCorrect: 4, xpEarned: 70, bonusAwarded: false }
      },
      dueReviews: [],
      now: '2026-06-13T10:05:00.000Z'
    });

    expect(recommendation.primaryAction).toBe('challenge');
    expect(recommendation.primaryActionLabel).toBe('Mini-Challenge öffnen');
  });
});
