import { useState } from 'react';
import type { Exercise, ReviewRating } from '../../models/learning';
import { evaluateExerciseAnswer, type ExerciseResult } from '../../services/exerciseEvaluationService';

type MultipleChoiceExerciseProps = {
  exercise: Exercise;
  onAnswered: (result: ExerciseResult, rating: ReviewRating) => void;
};

export function MultipleChoiceExercise({ exercise, onAnswered }: MultipleChoiceExerciseProps) {
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const selectedAnswer = result?.selectedAnswer;

  return (
    <div>
      <h2 className="font-extrabold">{exercise.prompt}</h2>
      <div className="mt-3 space-y-2">
        {(exercise.options ?? []).map((option) => {
          const isSelected = selectedAnswer === option.text;
          const isCorrect = result && option.isCorrect;
          const isWrongPick = result && isSelected && !option.isCorrect;

          return (
            <button
              key={option.id}
              type="button"
              disabled={Boolean(result)}
              onClick={() => {
                const answerResult = evaluateExerciseAnswer(exercise, option.id);
                setResult(answerResult);
                onAnswered(answerResult, answerResult.correct ? 'correct' : 'wrong');
              }}
              className={`w-full rounded-2xl border p-3 text-left text-sm font-bold leading-6 transition ${
                isCorrect
                  ? 'border-emerald-300/60 bg-emerald-300/10 text-emerald-100'
                  : isWrongPick
                    ? 'border-red-300/60 bg-red-300/10 text-red-100'
                    : isSelected
                      ? 'border-sky-300/60 bg-sky-300/10 text-sky-100'
                      : 'border-white/10 bg-white/5 text-slate-200'
              }`}
            >
              {option.text}
            </button>
          );
        })}
      </div>
      {result ? <p className="mt-3 text-sm leading-6 text-muted">{result.feedback}</p> : null}
    </div>
  );
}
