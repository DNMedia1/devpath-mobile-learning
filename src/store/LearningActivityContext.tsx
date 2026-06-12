import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Exercise, LanguageId, LearningActivityState, MistakeEntry, ReviewRating } from '../models/learning';
import { defaultLearningActivityState, localLearningActivityRepository } from '../services/learningActivityRepository';
import { getWeakSkillTags, upsertMistakeEntry } from '../services/learningActivityService';
import type { ExerciseResult } from '../services/exerciseEvaluationService';
import { createReviewCard, getDueReviewCards, updateReviewCard } from '../services/reviewService';

type RecordExerciseResultInput = {
  result: ExerciseResult;
  exercise: Exercise;
  lessonId: string;
  courseId: LanguageId;
  rating: ReviewRating;
};

type LearningActivityContextValue = {
  activity: LearningActivityState;
  dueReviews: LearningActivityState['reviewCards'];
  weakSkillTags: ReturnType<typeof getWeakSkillTags>;
  recordExerciseResult: (input: RecordExerciseResultInput) => void;
  resetLearningActivity: () => void;
};

const LearningActivityContext = createContext<LearningActivityContextValue | null>(null);

export function LearningActivityProvider({ children }: { children: React.ReactNode }) {
  const [activity, setActivity] = useState<LearningActivityState>(() => localLearningActivityRepository.load());

  useEffect(() => {
    localLearningActivityRepository.save(activity);
  }, [activity]);

  const value = useMemo<LearningActivityContextValue>(
    () => ({
      activity,
      dueReviews: getDueReviewCards(activity.reviewCards),
      weakSkillTags: getWeakSkillTags(activity.mistakes),
      recordExerciseResult: ({ result, exercise, lessonId, courseId, rating }) => {
        setActivity((current) => {
          const existingCard = current.reviewCards.find((card) => card.exerciseId === exercise.id) ?? createReviewCard(exercise.id);
          const nextReviewCard = updateReviewCard(existingCard, rating);
          const reviewCards = [
            nextReviewCard,
            ...current.reviewCards.filter((card) => card.exerciseId !== exercise.id)
          ];
          const mistakes = result.correct
            ? current.mistakes
            : upsertMistakeEntry(current.mistakes, toMistakeEntry(result, lessonId, courseId));

          return { mistakes, reviewCards };
        });
      },
      resetLearningActivity: () => setActivity(defaultLearningActivityState)
    }),
    [activity]
  );

  return <LearningActivityContext.Provider value={value}>{children}</LearningActivityContext.Provider>;
}

export function useLearningActivity() {
  const context = useContext(LearningActivityContext);
  if (!context) throw new Error('useLearningActivity must be used inside LearningActivityProvider');
  return context;
}

function toMistakeEntry(result: ExerciseResult, lessonId: string, courseId: LanguageId): MistakeEntry {
  return {
    exerciseId: result.exerciseId,
    lessonId,
    courseId,
    skillTags: result.skillTags,
    selectedAnswer: result.selectedAnswer,
    correctAnswer: result.correctAnswer,
    feedback: result.feedback,
    answeredAt: new Date().toISOString(),
    count: 1
  };
}
