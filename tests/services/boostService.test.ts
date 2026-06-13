import { beforeEach, describe, expect, it } from 'vitest';
import { getAvailableBoosts, getEarnedBoosts, getSpentBoosts, spendBoost } from '@/services/boostService';
import type { UserProgress } from '@/models/learning';

function progressWithCompleted(count: number): Pick<UserProgress, 'completedLessons'> {
  return { completedLessons: { python: Array.from({ length: count }, (_, index) => `lesson-${index}`) } };
}

describe('boostService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('earns one boost per three completed lessons', () => {
    expect(getEarnedBoosts(progressWithCompleted(0))).toBe(0);
    expect(getEarnedBoosts(progressWithCompleted(2))).toBe(0);
    expect(getEarnedBoosts(progressWithCompleted(3))).toBe(1);
    expect(getEarnedBoosts(progressWithCompleted(7))).toBe(2);
  });

  it('counts lessons across courses', () => {
    const progress: Pick<UserProgress, 'completedLessons'> = {
      completedLessons: { python: ['a', 'b'], css: ['c'], git: ['d', 'e', 'f'] }
    };
    expect(getEarnedBoosts(progress)).toBe(2);
  });

  it('spending boosts reduces availability and persists', () => {
    const progress = progressWithCompleted(6);
    expect(getAvailableBoosts(progress)).toBe(2);
    spendBoost();
    expect(getSpentBoosts()).toBe(1);
    expect(getAvailableBoosts(progress)).toBe(1);
    spendBoost();
    spendBoost();
    expect(getAvailableBoosts(progress)).toBe(0);
  });

  it('treats broken storage values as zero spent', () => {
    localStorage.setItem('devpath-boosts-spent', 'kaputt');
    expect(getSpentBoosts()).toBe(0);
  });
});
