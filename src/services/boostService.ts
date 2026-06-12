import type { UserProgress } from '../models/learning';

const SPENT_KEY = 'devpath-boosts-spent';

export const LESSONS_PER_BOOST = 3;

export function countCompletedLessons(progress: Pick<UserProgress, 'completedLessons'>): number {
  return Object.values(progress.completedLessons).reduce((sum, ids) => sum + (ids?.length ?? 0), 0);
}

export function getEarnedBoosts(progress: Pick<UserProgress, 'completedLessons'>): number {
  return Math.floor(countCompletedLessons(progress) / LESSONS_PER_BOOST);
}

export function getSpentBoosts(): number {
  const raw = Number.parseInt(localStorage.getItem(SPENT_KEY) ?? '0', 10);
  return Number.isFinite(raw) && raw > 0 ? raw : 0;
}

export function spendBoost(): number {
  const next = getSpentBoosts() + 1;
  localStorage.setItem(SPENT_KEY, String(next));
  return next;
}

export function getAvailableBoosts(progress: Pick<UserProgress, 'completedLessons'>): number {
  return Math.max(0, getEarnedBoosts(progress) - getSpentBoosts());
}
