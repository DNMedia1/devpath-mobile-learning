import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import type { TodayLearningRecommendation } from '@/services/recommendationService';
import { TodayLearningCard } from '@/components/TodayLearningCard';

const recommendation: TodayLearningRecommendation = {
  dueReviewCount: 2,
  nextLessonId: 'python-kontrollfluss',
  nextLessonTitle: 'Kontrollfluss',
  nextCourseTitle: 'Python',
  nextModuleTitle: 'Grundlagen',
  miniChallengeExerciseId: 'python-kontrollfluss-code-completion',
  miniChallengeTitle: 'Code-Bausteine einsetzen',
  miniChallengeLessonId: 'python-kontrollfluss',
  dailyGoalCurrent: 1,
  dailyGoalTarget: 2,
  dailyGoalPercent: 50,
  primaryAction: 'review',
  primaryActionLabel: 'Fehler wiederholen'
};

describe('TodayLearningCard', () => {
  it('shows today learning priorities and links to the primary action', () => {
    render(
      <MemoryRouter>
        <TodayLearningCard recommendation={recommendation} />
      </MemoryRouter>
    );

    expect(screen.getByText('Heute lernen')).toBeInTheDocument();
    expect(screen.getByText('2 fällig')).toBeInTheDocument();
    expect(screen.getByText('Kontrollfluss')).toBeInTheDocument();
    expect(screen.getByText('Code-Bausteine einsetzen')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Fehler wiederholen/i })).toHaveAttribute('href', '/mistakes');
  });
});
