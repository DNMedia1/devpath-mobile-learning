import type { ReviewCard, ReviewRating } from '../models/learning';

const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;
const MINUTE_MS = 60 * 1000;
const DAY_MS = 86_400_000;

const reviewSchedules: Record<ReviewRating, { intervalDays: number; offsetMs: number; easeDelta: number }> = {
  wrong: { intervalDays: 0, offsetMs: 10 * MINUTE_MS, easeDelta: -0.2 },
  hard: { intervalDays: 1, offsetMs: DAY_MS, easeDelta: -0.05 },
  correct: { intervalDays: 3, offsetMs: 3 * DAY_MS, easeDelta: 0 },
  easy: { intervalDays: 7, offsetMs: 7 * DAY_MS, easeDelta: 0.15 }
};

export function createReviewCard(exerciseId: string, now = new Date().toISOString()): ReviewCard {
  return {
    exerciseId,
    nextReviewAt: now,
    intervalDays: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    wrongCount: 0,
    correctStreak: 0,
    lastAnsweredAt: now
  };
}

export function updateReviewCard(card: ReviewCard, rating: ReviewRating, now = new Date().toISOString()): ReviewCard {
  const schedule = reviewSchedules[rating];
  const nextReviewAt = new Date(new Date(now).getTime() + schedule.offsetMs).toISOString();

  return {
    ...card,
    nextReviewAt,
    intervalDays: schedule.intervalDays,
    easeFactor: Math.max(MIN_EASE_FACTOR, Number((card.easeFactor + schedule.easeDelta).toFixed(2))),
    wrongCount: rating === 'wrong' ? card.wrongCount + 1 : card.wrongCount,
    correctStreak: rating === 'wrong' ? 0 : card.correctStreak + 1,
    lastAnsweredAt: now
  };
}

export function getDueReviewCards(cards: ReviewCard[], now = new Date().toISOString()): ReviewCard[] {
  const nowTime = new Date(now).getTime();
  return cards
    .filter((card) => new Date(card.nextReviewAt).getTime() <= nowTime)
    .sort((first, second) => new Date(first.nextReviewAt).getTime() - new Date(second.nextReviewAt).getTime());
}
