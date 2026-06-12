import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Exercise } from '../../models/learning';
import { ExerciseRenderer } from './ExerciseRenderer';

describe('ExerciseRenderer', () => {
  it('renders multiple-choice feedback and reports the answer result', () => {
    const exercise: Exercise = {
      id: 'exercise-1',
      type: 'multiple_choice',
      prompt: 'Welche Option nutzt return?',
      skillTags: ['functions'],
      difficulty: 'basic',
      explanation: 'return gibt Werte zurück.',
      options: [
        { id: 'a', text: 'return value', isCorrect: true, feedback: 'Richtig: return gibt den Wert zurück.' },
        { id: 'b', text: 'print value', isCorrect: false, feedback: 'Nicht ganz: print gibt keinen Wert zurück.' }
      ]
    };
    const onAnswered = vi.fn();

    render(<ExerciseRenderer exercise={exercise} onAnswered={onAnswered} />);
    fireEvent.click(screen.getByRole('button', { name: 'print value' }));

    expect(screen.getByText('Nicht ganz: print gibt keinen Wert zurück.')).toBeInTheDocument();
    expect(onAnswered).toHaveBeenCalledWith(
      expect.objectContaining({ exerciseId: 'exercise-1', correct: false }),
      'wrong'
    );
  });
});
