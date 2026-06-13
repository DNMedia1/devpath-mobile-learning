import { describe, expect, it } from 'vitest';
import type { Exercise } from '@/models/learning';
import { evaluateExerciseAnswer } from '@/services/exerciseEvaluationService';

describe('exerciseEvaluationService', () => {
  it('returns option feedback for a wrong multiple-choice answer', () => {
    const exercise: Exercise = {
      id: 'exercise-functions',
      type: 'multiple_choice',
      prompt: 'Was gibt eine Funktion zurück?',
      skillTags: ['functions'],
      difficulty: 'basic',
      explanation: 'Funktionen sollten Ergebnisse über return sichtbar machen.',
      options: [
        { id: 'a', text: 'return', isCorrect: true, feedback: 'Richtig: return gibt ein Ergebnis an den Aufrufer zurück.' },
        { id: 'b', text: 'print only', isCorrect: false, feedback: 'Nicht ganz: print zeigt etwas an, liefert aber keinen Wert an den Aufrufer zurück.' }
      ]
    };

    expect(evaluateExerciseAnswer(exercise, 'b')).toMatchObject({
      exerciseId: 'exercise-functions',
      correct: false,
      selectedAnswer: 'print only',
      correctAnswer: 'return',
      feedback: 'Nicht ganz: print zeigt etwas an, liefert aber keinen Wert an den Aufrufer zurück.',
      skillTags: ['functions']
    });
  });

  it('accepts normalized short text answers', () => {
    const exercise: Exercise = {
      id: 'exercise-fill-blank',
      type: 'fill_blank',
      prompt: 'Welches Keyword gibt einen Wert zurück?',
      skillTags: ['functions'],
      difficulty: 'basic',
      expectedAnswer: 'return',
      acceptedAnswers: ['return'],
      explanation: 'return gibt den Wert an den Aufrufer zurück.'
    };

    expect(evaluateExerciseAnswer(exercise, ' RETURN ').correct).toBe(true);
  });

  it('evaluates ordered code-token answers', () => {
    const exercise: Exercise = {
      id: 'exercise-code-token',
      type: 'code_completion',
      prompt: 'Setze die Bausteine ein.',
      skillTags: ['variables'],
      difficulty: 'basic',
      code: 'print(__slot_1__"{__slot_2__}")',
      codeSlots: [
        { id: 'slot-1', placeholder: '__slot_1__', answer: 'f' },
        { id: 'slot-2', placeholder: '__slot_2__', answer: 'name' }
      ],
      expectedAnswer: 'f\nname',
      explanation: 'Das f aktiviert den f-String, danach wird die Variable name eingesetzt.'
    };

    expect(evaluateExerciseAnswer(exercise, 'f\nname')).toMatchObject({
      correct: true,
      correctAnswer: 'f\nname',
      feedback: 'Das f aktiviert den f-String, danach wird die Variable name eingesetzt.'
    });
    expect(evaluateExerciseAnswer(exercise, 'name\nf')).toMatchObject({
      correct: false,
      correctAnswer: 'f\nname'
    });
  });
});
