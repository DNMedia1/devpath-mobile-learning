import type { ReactNode } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useState } from 'react';
import type { Exercise, ReviewRating } from '../../models/learning';
import { evaluateExerciseAnswer, type ExerciseResult } from '../../services/exerciseEvaluationService';

type CodeCompletionExerciseProps = {
  exercise: Exercise;
  onAnswered: (result: ExerciseResult, rating: ReviewRating) => void;
};

export function CodeCompletionExercise({ exercise, onAnswered }: CodeCompletionExerciseProps) {
  const slots = exercise.codeSlots ?? [];
  const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const selectedTokens = selectedTokenIds.flatMap((id) => {
    const token = exercise.tokens?.find((candidate) => candidate.id === id);
    return token ? [token] : [];
  });
  const selectedAnswers = selectedTokens.map((token) => token.text);
  const isReady = slots.length > 0 && selectedAnswers.length === slots.length;
  const solutionCode = slots.reduce((code, slot) => code.replace(slot.placeholder, slot.answer), exercise.solution ?? exercise.code ?? '');
  const taskCode = renderCodeWithSlots(exercise.code ?? '', slots, selectedAnswers);

  const chooseToken = (tokenId: string) => {
    if (result || selectedTokenIds.includes(tokenId) || selectedTokenIds.length >= slots.length) return;
    setSelectedTokenIds((current) => [...current, tokenId]);
  };

  const reset = () => {
    setSelectedTokenIds([]);
    setResult(null);
  };

  const checkAnswer = () => {
    const answerResult = evaluateExerciseAnswer(exercise, selectedAnswers.join('\n'));
    setResult(answerResult);
    onAnswered(answerResult, answerResult.correct ? 'correct' : 'wrong');
  };

  return (
    <div className="-m-5 flex min-h-[520px] flex-col lg:-m-8">
      <div className="p-5 lg:p-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-black">{exercise.prompt}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Sieh dir erst das Muster an. Tippe danach die Bausteine in der richtigen Reihenfolge in die freien Code-Stellen.</p>
          </div>
          <button
            type="button"
            onClick={reset}
            aria-label="Zurücksetzen"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-muted"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="mt-5">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-muted">Codebeispiel</p>
          <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-ink">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-sky-200">
              <span>Beispiel</span>
              <span>{exercise.difficulty}</span>
            </div>
            <pre className="overflow-x-auto p-4 text-sm leading-7 text-sky-100"><code>{solutionCode}</code></pre>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-muted">Deine Aufgabe</p>
          <pre className="mt-2 overflow-x-auto rounded-2xl border border-white/10 bg-ink p-4 text-sm leading-8 text-sky-100"><code>{taskCode}</code></pre>
        </div>
      </div>

      <div className="mt-auto border-t border-white/10 bg-white/[0.04] p-5 lg:p-8">
        <div className="mx-auto max-w-[620px]">
          <p className="text-center text-xs font-black uppercase tracking-[0.14em] text-muted">Bausteine</p>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            {(exercise.tokens ?? []).map((token) => {
              const used = selectedTokenIds.includes(token.id);
              return (
                <button
                  key={token.id}
                  type="button"
                  disabled={Boolean(result) || used || selectedTokenIds.length >= slots.length}
                  onClick={() => chooseToken(token.id)}
                  className={`min-h-12 min-w-12 rounded-xl border px-4 font-mono text-base font-black shadow-sm transition ${
                    used ? 'border-emerald-300/60 bg-emerald-300/15 text-emerald-100' : 'border-white/15 bg-panel text-slate-100 disabled:opacity-45'
                  }`}
                >
                  {token.text}
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div className="rounded-2xl border border-white/10 bg-ink/70 p-3 text-center text-sm font-bold leading-6 text-muted">
              {selectedAnswers.length > 0 ? selectedAnswers.join(' -> ') : 'Noch kein Baustein gewählt.'}
            </div>
            <button
              type="button"
              disabled={!isReady || Boolean(result)}
              onClick={checkAnswer}
              className="min-h-12 rounded-2xl bg-text px-6 font-extrabold text-ink disabled:bg-slate-500 disabled:text-slate-300"
            >
              Überprüfen
            </button>
          </div>

          {result ? (
            <div className={`mt-5 rounded-2xl border p-4 text-sm leading-6 ${result.correct ? 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100' : 'border-yellow-300/40 bg-yellow-300/10 text-yellow-100'}`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">{result.correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}</div>
                <div>
                  <p className="text-lg font-black">{result.correct ? 'Klasse!' : 'Noch nicht ganz'}</p>
                  <p className="mt-1">{result.feedback}</p>
                  {!result.correct ? (
                    <button type="button" onClick={reset} className="mt-3 min-h-10 rounded-xl border border-white/15 bg-white/10 px-4 text-sm font-extrabold">
                      Nochmal versuchen
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function renderCodeWithSlots(template: string, slots: NonNullable<Exercise['codeSlots']>, answers: string[]): ReactNode[] {
  const nodes: ReactNode[] = [];
  let remaining = template;

  slots.forEach((slot, index) => {
    const position = remaining.indexOf(slot.placeholder);
    if (position === -1) return;

    nodes.push(remaining.slice(0, position));
    nodes.push(
      <span
        key={slot.id}
        aria-label={`Freier Slot ${index + 1}`}
        className={`inline-flex min-h-7 min-w-10 items-center justify-center rounded-md border px-2 align-middle font-black ${
          answers[index] ? 'border-emerald-300/60 bg-emerald-300/15 text-emerald-100' : 'border-sky-300/50 bg-sky-300/10 text-sky-100'
        }`}
      >
        {answers[index] ?? ''}
      </span>
    );
    remaining = remaining.slice(position + slot.placeholder.length);
  });

  nodes.push(remaining);
  return nodes;
}
