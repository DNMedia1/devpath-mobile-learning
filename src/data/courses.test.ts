import { describe, expect, it } from 'vitest';
import { evaluateCode } from '../services/codeFeedbackService';
import { courses } from './courses';

describe('course content', () => {
  it('contains complete language and automation tracks', () => {
    expect(courses).toHaveLength(7);
    expect(courses.find((course) => course.id === 'python')?.modules.flatMap((module) => module.lessons)).toHaveLength(39);

    for (const course of courses) {
      expect(course.modules.length).toBeGreaterThanOrEqual(3);
      for (const module of course.modules) {
        expect(module.lessons.length).toBeGreaterThanOrEqual(3);
        for (const lesson of module.lessons) {
          expect(lesson.theory.length).toBeGreaterThan(80);
          expect(lesson.codeExample.code.length).toBeGreaterThan(20);
          expect(lesson.quiz).toHaveLength(2);
          expect(lesson.practice.prompt.length).toBeGreaterThan(30);
          expect(lesson.codingChallenge?.starterCode.length).toBeGreaterThan(10);
          expect(lesson.codingChallenge?.requiredConcepts.length).toBeGreaterThanOrEqual(3);
          expect(evaluateCode(lesson.codingChallenge!.solution, lesson.codingChallenge!).status).toBe('correct');
        }
      }
    }
  });
});
