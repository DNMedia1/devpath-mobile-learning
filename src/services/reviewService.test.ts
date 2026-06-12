import { describe, expect, it } from 'vitest';
import { createReviewCard, getDueReviewCards, updateReviewCard } from './reviewService';

describe('reviewService', () => {
  it.each([
    ['wrong', 10 * 60 * 1000, 0, 1, 0],
    ['hard', 1 * 86_400_000, 1, 0, 1],
    ['correct', 3 * 86_400_000, 3, 0, 1],
    ['easy', 7 * 86_400_000, 7, 0, 1]
  ] as const)('schedules %s answers correctly', (rating, offsetMs, intervalDays, wrongCount, correctStreak) => {
    const now = '2026-06-12T10:00:00.000Z';
    const card = updateReviewCard(createReviewCard('exercise-1', now), rating, now);

    expect(new Date(card.nextReviewAt).getTime()).toBe(new Date(now).getTime() + offsetMs);
    expect(card.intervalDays).toBe(intervalDays);
    expect(card.wrongCount).toBe(wrongCount);
    expect(card.correctStreak).toBe(correctStreak);
  });

  it('returns only cards that are due for review', () => {
    const now = '2026-06-12T10:00:00.000Z';
    const due = { ...createReviewCard('due', now), nextReviewAt: '2026-06-12T09:59:00.000Z' };
    const later = { ...createReviewCard('later', now), nextReviewAt: '2026-06-12T10:01:00.000Z' };

    expect(getDueReviewCards([later, due], now).map((card) => card.exerciseId)).toEqual(['due']);
  });
});
