import { describe, expect, it } from 'vitest';
import { evaluateCode } from '@/services/codeFeedbackService';
import type { CodingChallenge } from '@/models/learning';

const challenge: CodingChallenge = {
  prompt: 'Schreibe eine Funktion, die XP addiert.',
  language: 'javascript',
  starterCode: 'function addXp(currentXp, reward) {\n  \n}',
  solution: 'function addXp(currentXp, reward) {\n  return currentXp + reward;\n}',
  requiredConcepts: [
    { id: 'function-name', label: 'Funktionsname addXp', pattern: 'addXp', hint: 'Die Funktion muss addXp heißen.' },
    { id: 'return', label: 'Rückgabe mit return', pattern: 'return', hint: 'Gib das Ergebnis mit return zurück.' },
    { id: 'addition', label: 'Addition der Werte', pattern: 'currentXp + reward', hint: 'Addiere currentXp und reward.' }
  ]
};

describe('codeFeedbackService', () => {
  it('accepts a correct solution', () => {
    const result = evaluateCode('function addXp(currentXp, reward) {\n  return currentXp + reward;\n}', challenge);

    expect(result.status).toBe('correct');
    expect(result.score).toBe(100);
    expect(result.hints).toHaveLength(0);
  });

  it('returns near-miss feedback when one required concept is missing', () => {
    const result = evaluateCode('function addXp(currentXp, reward) {\n  currentXp + reward;\n}', challenge);

    expect(result.status).toBe('near-miss');
    expect(result.hints).toContain('Gib das Ergebnis mit return zurück.');
    expect(result.passedChecks).toBe(2);
  });

  it('detects a syntax-like bracket problem before concept feedback', () => {
    const result = evaluateCode('function addXp(currentXp, reward) {\n  return currentXp + reward;', challenge);

    expect(result.status).toBe('syntax-error');
    expect(result.hints[0]).toContain('schließende Klammer');
  });

  it('reports missing concepts when the answer is far away', () => {
    const result = evaluateCode('console.log("hello")', challenge);

    expect(result.status).toBe('missing-concept');
    expect(result.passedChecks).toBe(0);
    expect(result.hints).toContain('Die Funktion muss addXp heißen.');
  });
});
