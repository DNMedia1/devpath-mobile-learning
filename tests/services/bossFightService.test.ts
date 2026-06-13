import { describe, expect, it } from 'vitest';
import type { BossFight } from '@/models/learning';
import { getBossFightScore, isBossFightPassed } from '@/services/bossFightService';

const bossFight: BossFight = {
  id: 'python-module-1-boss-fight',
  title: 'Boss-Fight: Grundlagen',
  description: 'Kombiniert Variablen, Kontrollfluss und Debugging.',
  skillTags: ['variables', 'debugging', 'clean-code'],
  xp: 90,
  exercises: [
    { id: 'ex-1', type: 'multiple_choice', prompt: 'A', skillTags: ['variables'], difficulty: 'basic', explanation: 'A' },
    { id: 'ex-2', type: 'debugging', prompt: 'B', skillTags: ['debugging'], difficulty: 'basic', explanation: 'B' },
    { id: 'ex-3', type: 'mini_project_step', prompt: 'C', skillTags: ['clean-code'], difficulty: 'basic', explanation: 'C' }
  ]
};

describe('bossFightService', () => {
  it('scores answered boss-fight exercises', () => {
    expect(getBossFightScore(bossFight, { 'ex-1': true, 'ex-2': false })).toEqual({
      correct: 1,
      answered: 2,
      total: 3,
      percent: 33
    });
  });

  it('passes only when every exercise has been answered', () => {
    expect(isBossFightPassed(bossFight, { 'ex-1': true, 'ex-2': true })).toBe(false);
    expect(isBossFightPassed(bossFight, { 'ex-1': true, 'ex-2': false, 'ex-3': true })).toBe(true);
  });
});
