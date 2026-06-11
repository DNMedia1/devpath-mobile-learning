import { describe, expect, it } from 'vitest';
import { evaluateCode } from '../services/codeFeedbackService';
import { courses } from './courses';

describe('course content', () => {
  it('contains complete language and automation tracks', () => {
    expect(courses).toHaveLength(12);
    expect(courses.find((course) => course.id === 'python')?.modules.flatMap((module) => module.lessons)).toHaveLength(39);

    expect(courses.map((course) => course.id)).toEqual(
      expect.arrayContaining(['typescript', 'react', 'git', 'sql', 'backend'])
    );

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

  it('generates a valid fill-blank task for every lesson', () => {
    for (const course of courses) {
      for (const module of course.modules) {
        for (const lesson of module.lessons) {
          expect(lesson.fillBlank.code).toContain('____');
          expect(lesson.fillBlank.answer.trim().length).toBeGreaterThan(0);
          expect(lesson.fillBlank.instruction.length).toBeGreaterThan(20);
          expect(lesson.fillBlank.hint.length).toBeGreaterThan(10);
        }
      }
    }
  });

  it('builds three-option quiz questions with varied correct positions', () => {
    const allQuestions = courses.flatMap((course) =>
      course.modules.flatMap((module) => module.lessons.flatMap((lesson) => lesson.quiz))
    );

    for (const question of allQuestions) {
      expect(question.options).toHaveLength(3);
      expect(question.options.map((option) => option.id)).toContain(question.correctOptionId);
    }

    const correctPositions = new Set(allQuestions.map((question) => question.correctOptionId));
    expect(correctPositions.size).toBeGreaterThan(1);
  });
});
