import type { Exercise, SkillTag } from '../models/learning';

export interface ExerciseResult {
  exerciseId: string;
  correct: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  feedback: string;
  skillTags: SkillTag[];
}

export function evaluateExerciseAnswer(exercise: Exercise, answer: string): ExerciseResult {
  if (exercise.options?.length) {
    return evaluateOptionAnswer(exercise, answer);
  }

  return evaluateTextAnswer(exercise, answer);
}

function evaluateOptionAnswer(exercise: Exercise, answer: string): ExerciseResult {
  const selected = exercise.options?.find((option) => option.id === answer || option.text === answer);
  const correct = exercise.options?.find((option) => option.isCorrect);

  return {
    exerciseId: exercise.id,
    correct: Boolean(selected?.isCorrect),
    selectedAnswer: selected?.text ?? answer,
    correctAnswer: correct?.text ?? exercise.expectedAnswer ?? '',
    feedback: selected?.feedback ?? exercise.explanation,
    skillTags: exercise.skillTags
  };
}

function evaluateTextAnswer(exercise: Exercise, answer: string): ExerciseResult {
  const normalizedAnswer = normalizeAnswer(answer);
  const acceptedAnswers = [exercise.expectedAnswer ?? '', ...(exercise.acceptedAnswers ?? [])]
    .map(normalizeAnswer)
    .filter(Boolean);
  const correct = normalizedAnswer.length > 0 && acceptedAnswers.includes(normalizedAnswer);

  return {
    exerciseId: exercise.id,
    correct,
    selectedAnswer: answer,
    correctAnswer: exercise.expectedAnswer ?? '',
    feedback: correct ? exercise.explanation : `Noch nicht. Erwartet war: ${exercise.expectedAnswer ?? 'eine passende Antwort'}.`,
    skillTags: exercise.skillTags
  };
}

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase().replace(/^["'`]+|["'`;]+$/g, '');
}
