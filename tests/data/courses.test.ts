import { describe, expect, it } from 'vitest';
import { evaluateCode } from '@/services/codeFeedbackService';
import { courses } from '@/data/courses';

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
          expect(lesson.knowledge.length).toBeGreaterThanOrEqual(4);
          for (const knowledgePoint of lesson.knowledge) {
            expect(knowledgePoint.length).toBeGreaterThan(40);
          }
          expect(lesson.codeExample.code.length).toBeGreaterThan(20);
          expect(lesson.quiz).toHaveLength(4);
          expect(lesson.quiz.map((question) => question.prompt)).toEqual(
            expect.arrayContaining([
              expect.stringContaining('Codebeispiel'),
              expect.stringContaining('Fehler'),
              expect.stringContaining('Praxis')
            ])
          );
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

  it('exposes generated exercises for every lesson with skill tags and answer feedback', () => {
    for (const course of courses) {
      for (const module of course.modules) {
        for (const lesson of module.lessons) {
          expect(lesson.exercises.length).toBeGreaterThanOrEqual(12);
          expect(lesson.exercises.map((exercise) => exercise.type)).toEqual(
            expect.arrayContaining([
              'multiple_choice',
              'true_false',
              'fill_blank',
              'code_output',
              'debugging',
              'ordering',
              'code_completion',
              'scenario',
              'mini_project_step'
            ])
          );

          for (const exercise of lesson.exercises) {
            expect(exercise.skillTags.length).toBeGreaterThan(0);
            expect(exercise.explanation.length).toBeGreaterThan(20);

            for (const option of exercise.options ?? []) {
              expect(option.feedback.length).toBeGreaterThan(20);
            }
          }
        }
      }
    }
  });

  it('turns code-completion exercises into tappable token puzzles', () => {
    const allCodeCompletionExercises = courses.flatMap((course) =>
      course.modules.flatMap((module) =>
        module.lessons.flatMap((lesson) => lesson.exercises.filter((exercise) => exercise.type === 'code_completion'))
      )
    );

    expect(allCodeCompletionExercises.length).toBeGreaterThan(0);
    for (const exercise of allCodeCompletionExercises) {
      expect(exercise.code).toContain('__slot_');
      expect(exercise.codeSlots?.length).toBeGreaterThanOrEqual(1);
      expect(exercise.tokens?.length).toBeGreaterThanOrEqual(exercise.codeSlots?.length ?? 0);
      expect(exercise.expectedAnswer).toBe(exercise.codeSlots?.map((slot) => slot.answer).join('\n'));
    }

    const generatedCompletionExercises = allCodeCompletionExercises.filter((exercise) => exercise.id.endsWith('-code-completion'));
    for (const exercise of generatedCompletionExercises) {
      expect(exercise.codeSlots).toHaveLength(1);
    }
  });

  it('uses the Python variables lesson as a richer f-string quality pilot', () => {
    const pythonVariables = courses
      .find((course) => course.id === 'python')
      ?.modules.flatMap((module) => module.lessons)
      .find((lesson) => lesson.id === 'python-variablen-und-typen');

    expect(pythonVariables).toBeDefined();
    expect(pythonVariables?.theory).toContain('f-Strings');
    expect(pythonVariables?.theory).toContain('{name}');
    expect(pythonVariables?.knowledge.length).toBeGreaterThanOrEqual(8);
    expect(pythonVariables?.sourceReferences?.map((source) => source.url)).toEqual(
      expect.arrayContaining([
        'https://docs.python.org/3/tutorial/inputoutput.html#formatted-string-literals',
        'https://docs.python.org/3/reference/lexical_analysis.html#f-strings'
      ])
    );
    expect(pythonVariables?.exercises.length).toBeGreaterThanOrEqual(16);
    expect(pythonVariables?.exercises.some((exercise) => exercise.prompt.includes(':.2f'))).toBe(true);
    const fStringPuzzle = pythonVariables?.exercises.find((exercise) => exercise.id === 'python-variablen-und-typen-fstring-token-puzzle');
    expect(fStringPuzzle?.codeSlots).toEqual([{ id: 'slot-1', placeholder: '__slot_1__', answer: 'f' }]);
    expect(fStringPuzzle?.expectedAnswer).toBe('f');
    expect(fStringPuzzle?.code).toContain('print(__slot_1__"{name} hat {xp} XP")');
  });

  it('generates a boss fight for every module with combined skills', () => {
    for (const course of courses) {
      for (const module of course.modules) {
        expect(module.bossFight.id).toBe(`${module.id}-boss-fight`);
        expect(module.bossFight.exercises.length).toBeGreaterThanOrEqual(3);
        expect(new Set(module.bossFight.skillTags).size).toBeGreaterThanOrEqual(2);
        expect(module.bossFight.xp).toBeGreaterThanOrEqual(80);
        expect(module.bossFight.exercises.map((exercise) => exercise.type)).toEqual(
          expect.arrayContaining(['multiple_choice', 'debugging', 'mini_project_step'])
        );
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
