import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Exercise } from '@/models/learning';
import { ExerciseRenderer } from '@/components/exercises/ExerciseRenderer';

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

  it('lets learners tap code tokens into blanks before checking the answer', () => {
    const exercise: Exercise = {
      id: 'exercise-f-string',
      type: 'code_completion',
      prompt: 'Setze die fehlenden Bausteine in den Python-Code ein.',
      skillTags: ['variables'],
      difficulty: 'basic',
      code: 'name = "Mina"\nprint(__slot_1__"{__slot_2__} lernt Python")',
      solution: 'name = "Mina"\nprint(f"{name} lernt Python")',
      codeSlots: [
        { id: 'slot-1', placeholder: '__slot_1__', answer: 'f' },
        { id: 'slot-2', placeholder: '__slot_2__', answer: 'name' }
      ],
      tokens: [
        { id: 'token-name', text: 'name', feedback: 'name ist die Variable, deren Wert eingesetzt wird.' },
        { id: 'token-f', text: 'f', feedback: 'Das f vor dem String aktiviert den f-String.' },
        { id: 'token-str', text: 'str', feedback: 'str wandelt Werte um, aktiviert aber keinen f-String.' }
      ],
      expectedAnswer: 'f\nname',
      explanation: 'Das f aktiviert den f-String, und {name} setzt den Wert der Variable ein.'
    };
    const onAnswered = vi.fn();

    const { container } = render(<ExerciseRenderer exercise={exercise} onAnswered={onAnswered} />);
    expect(container.textContent).not.toContain('print(f"{name} lernt Python")');
    expect(screen.getByText('Deine Aufgabe')).toBeInTheDocument();
    expect(screen.getByLabelText('Freier Slot 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Überprüfen' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'f' }));
    fireEvent.click(screen.getByRole('button', { name: 'name' }));
    fireEvent.click(screen.getByRole('button', { name: 'Überprüfen' }));

    expect(screen.getByText(/Das f aktiviert den f-String/)).toBeInTheDocument();
    expect(onAnswered).toHaveBeenCalledWith(
      expect.objectContaining({ exerciseId: 'exercise-f-string', correct: true, selectedAnswer: 'f\nname' }),
      'correct'
    );
  });

  it('allows a wrong token order and then a retry', () => {
    const exercise: Exercise = {
      id: 'exercise-html-tag',
      type: 'code_completion',
      prompt: 'Vervollständige das HTML-Tag.',
      skillTags: ['clean-code'],
      difficulty: 'basic',
      code: '__slot_1__button__slot_2__',
      solution: '<button>',
      codeSlots: [
        { id: 'slot-1', placeholder: '__slot_1__', answer: '<' },
        { id: 'slot-2', placeholder: '__slot_2__', answer: '>' }
      ],
      tokens: [
        { id: 'token-open', text: '<', feedback: 'Die öffnende spitze Klammer startet ein HTML-Tag.' },
        { id: 'token-close', text: '>', feedback: 'Die schließende spitze Klammer beendet den Tag-Namen.' },
        { id: 'token-brace', text: '{', feedback: 'Geschweifte Klammern gehören nicht zu HTML-Tags.' }
      ],
      expectedAnswer: '<\n>',
      explanation: 'HTML-Tags nutzen spitze Klammern: <button>.'
    };
    const onAnswered = vi.fn();

    render(<ExerciseRenderer exercise={exercise} onAnswered={onAnswered} />);
    fireEvent.click(screen.getByRole('button', { name: '>' }));
    fireEvent.click(screen.getByRole('button', { name: '<' }));
    fireEvent.click(screen.getByRole('button', { name: 'Überprüfen' }));

    expect(screen.getByText(/Noch nicht ganz/)).toBeInTheDocument();
    expect(onAnswered).toHaveBeenLastCalledWith(expect.objectContaining({ correct: false, selectedAnswer: '>\n<' }), 'wrong');

    fireEvent.click(screen.getByRole('button', { name: 'Nochmal versuchen' }));
    fireEvent.click(screen.getByRole('button', { name: '<' }));
    fireEvent.click(screen.getByRole('button', { name: '>' }));
    fireEvent.click(screen.getByRole('button', { name: 'Überprüfen' }));

    expect(screen.getByText(/Klasse/)).toBeInTheDocument();
    expect(onAnswered).toHaveBeenLastCalledWith(expect.objectContaining({ correct: true, selectedAnswer: '<\n>' }), 'correct');
  });
});
