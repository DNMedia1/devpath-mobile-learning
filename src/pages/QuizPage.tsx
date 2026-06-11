import { RotateCcw, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { allLessons } from '../data/courses';
import { Difficulty } from '../models/learning';
import { useProgress } from '../store/ProgressContext';

const difficulties: Difficulty[] = ['basic', 'intermediate', 'advanced'];
const difficultyLabels: Record<Difficulty, string> = {
  basic: 'Basis',
  intermediate: 'Mittel',
  advanced: 'Fortgeschritten'
};

export function QuizPage() {
  const { submitQuiz, progress } = useProgress();
  const [difficulty, setDifficulty] = useState<Difficulty>('basic');
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; total: number; percentage: number } | null>(null);
  const questions = useMemo(() => {
    const pool = allLessons.flatMap((lesson) => lesson.quiz).filter((question) => question.difficulty === difficulty || difficulty === 'advanced');
    const missed = pool.filter((question) => progress.quizMistakes.includes(question.id));
    return [...missed, ...pool.filter((question) => !missed.includes(question))].slice(0, 6);
  }, [difficulty, progress.quizMistakes]);
  const answeredCount = questions.filter((question) => selected[question.id]).length;
  const allAnswered = questions.length > 0 && answeredCount === questions.length;

  const submit = () => {
    const graded = submitQuiz(questions.map((question) => ({ questionId: question.id, correctOptionId: question.correctOptionId, selectedOptionId: selected[question.id] ?? '' })));
    setResult({ score: graded.score, total: graded.total, percentage: graded.percentage });
  };

  const resultTone = result
    ? result.percentage >= 80
      ? { frame: 'border-emerald-300/40 bg-emerald-300/10', label: 'Stark! Das sitzt.' }
      : result.percentage >= 50
        ? { frame: 'border-sky-300/40 bg-sky-300/10', label: 'Gut dabei. Wiederhole die falschen Fragen direkt.' }
        : { frame: 'border-orange-300/40 bg-orange-300/10', label: 'Kein Stress: Falsche Fragen kommen beim nächsten Lauf zuerst.' }
    : null;

  return (
    <div>
      <Header title="Quizmodus" subtitle="Übe gemischte Fragen oder wiederhole Konzepte, die noch nicht sitzen." />
      <div className="mb-3 grid grid-cols-3 gap-2">
        {difficulties.map((item) => (
          <button key={item} onClick={() => { setDifficulty(item); setSelected({}); setResult(null); }} className={`h-11 rounded-2xl text-xs font-extrabold ${difficulty === item ? 'bg-text text-ink' : 'bg-panel text-muted'}`}>
            {difficultyLabels[item]}
          </button>
        ))}
      </div>
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-panel/70 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-muted">
        <span>{difficultyLabels[difficulty]}</span>
        <span>{answeredCount}/{questions.length} beantwortet</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {questions.map((question, index) => {
          const isRepeat = progress.quizMistakes.includes(question.id);
          return (
            <section key={question.id} className="rounded-3xl border border-white/10 bg-panel p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Frage {index + 1}/{questions.length}</p>
                {isRepeat ? (
                  <span className="shrink-0 rounded-full border border-yellow-300/40 bg-yellow-300/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-yellow-100">
                    Wiederholung
                  </span>
                ) : null}
              </div>
              <h2 className="mt-2 break-words font-extrabold leading-7">{question.prompt}</h2>
              <div className="mt-4 space-y-2">
                {question.options.map((option) => {
                  const locked = Boolean(result);
                  const isSelected = selected[question.id] === option.id;
                  const isCorrect = locked && option.id === question.correctOptionId;
                  const isWrongPick = locked && isSelected && !isCorrect;
                  return (
                    <button
                      key={option.id}
                      disabled={locked}
                      onClick={() => setSelected((current) => ({ ...current, [question.id]: option.id }))}
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
              {result ? <p className="mt-3 text-sm leading-6 text-muted">{question.explanation}</p> : null}
            </section>
          );
        })}
      </div>

      {result && resultTone ? (
        <div className={`mt-5 rounded-3xl border p-6 text-center ${resultTone.frame}`}>
          <p className="text-5xl font-black">{result.percentage}%</p>
          <p className="mt-2 font-extrabold">{result.score}/{result.total} richtig · +{result.score * 12} XP</p>
          <p className="mt-1 text-sm leading-6 text-muted">{resultTone.label}</p>
          <button onClick={() => { setSelected({}); setResult(null); }} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 font-bold">
            <RotateCcw size={17} /> Erneut versuchen
          </button>
        </div>
      ) : (
        <>
          <button disabled={!allAnswered} onClick={submit} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-text font-extrabold text-ink disabled:opacity-40">
            <Sparkles size={18} /> Antworten prüfen
          </button>
          {!allAnswered ? <p className="mt-2 text-center text-xs font-bold text-muted">Beantworte alle Fragen, um auszuwerten.</p> : null}
        </>
      )}
    </div>
  );
}
