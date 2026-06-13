import { describe, expect, it } from 'vitest';
import type { MistakeEntry, SkillTag } from '@/models/learning';
import { getWeakSkillTags, upsertMistakeEntry } from '@/services/learningActivityService';

describe('learningActivityService', () => {
  it('aggregates weak skill tags from mistakes', () => {
    const mistakes = [
      mistake('exercise-a', ['functions']),
      mistake('exercise-b', ['functions', 'debugging']),
      mistake('exercise-c', ['debugging'])
    ];

    expect(getWeakSkillTags(mistakes)).toEqual([
      { skillTag: 'debugging', count: 2 },
      { skillTag: 'functions', count: 2 }
    ]);
  });

  it('updates an existing mistake instead of duplicating it', () => {
    const first = mistake('exercise-a', ['functions']);
    const next = upsertMistakeEntry([first], {
      ...first,
      selectedAnswer: 'print',
      answeredAt: '2026-06-12T11:00:00.000Z',
      count: 1
    });

    expect(next).toHaveLength(1);
    expect(next[0]).toMatchObject({
      exerciseId: 'exercise-a',
      selectedAnswer: 'print',
      count: 2
    });
  });
});

function mistake(exerciseId: string, skillTags: SkillTag[]): MistakeEntry {
  return {
    exerciseId,
    lessonId: 'lesson-1',
    courseId: 'python',
    skillTags,
    selectedAnswer: 'wrong',
    correctAnswer: 'right',
    feedback: 'Das ist eine gezielte Erklärung zur falschen Antwort.',
    answeredAt: '2026-06-12T10:00:00.000Z',
    count: 1
  };
}
