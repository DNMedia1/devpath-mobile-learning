import { Check, ChevronLeft, ChevronRight, Code2, Flame, Lightbulb, PartyPopper } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ExerciseRenderer } from '../components/exercises/ExerciseRenderer';
import { Header } from '../components/Header';
import { ProgressBar } from '../components/ProgressBar';
import { getLesson, courses } from '../data/courses';
import type { BadgeDefinition, DailyQuest } from '../models/learning';
import { loadOpenRouterApiKey, requestCodeHint, saveOpenRouterApiKey } from '../services/aiHintService';
import { getNewlyEarnedBadges } from '../services/badgeService';
import { evaluateCode, type CodeFeedback } from '../services/codeFeedbackService';
import { calculateLevel, completeLesson as computeLessonCompletion, getDailyQuests } from '../services/progressService';
import { useLearningActivity } from '../store/LearningActivityContext';
import { useProgress } from '../store/ProgressContext';
import { formatDayCount, isFillBlankAnswerCorrect, isLessonCompleted } from '../utils/learning';

type FinishResult = {
  xpGained: number;
  levelBefore: number;
  level: number;
  levelProgress: number;
  streak: number;
  bonusAwarded: boolean;
  newBadges: BadgeDefinition[];
  quests: DailyQuest[];
};

const lessonSteps = ['Theorie', 'Code', 'Lücke', 'Quiz', 'Coden', 'Aufgabe'];
const confettiPieces = [
  { left: '8%', delay: '0ms', color: '#ffd94d' },
  { left: '22%', delay: '120ms', color: '#50a7ff' },
  { left: '36%', delay: '40ms', color: '#86efac' },
  { left: '50%', delay: '180ms', color: '#b47cff' },
  { left: '64%', delay: '80ms', color: '#ff8a3d' },
  { left: '78%', delay: '220ms', color: '#7dd3fc' },
  { left: '90%', delay: '140ms', color: '#ffe45c' }
];

export function LessonPage() {
  const { lessonId } = useParams();
  const lesson = getLesson(lessonId ?? '');
  const course = courses.find((item) => item.modules.some((module) => module.lessons.some((candidate) => candidate.id === lesson?.id)));
  const { complete, progress } = useProgress();
  const { recordExerciseResult } = useLearningActivity();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answeredExercises, setAnsweredExercises] = useState<Record<string, boolean>>({});
  const [codeDrafts, setCodeDrafts] = useState<Record<string, string>>({});
  const [codeFeedback, setCodeFeedback] = useState<Record<string, CodeFeedback>>({});
  const [blankInputs, setBlankInputs] = useState<Record<string, string>>({});
  const [blankResults, setBlankResults] = useState<Record<string, 'correct' | 'wrong'>>({});
  const [blankAttempts, setBlankAttempts] = useState<Record<string, number>>({});
  const [openRouterKey, setOpenRouterKey] = useState(() => loadOpenRouterApiKey());
  const [aiHint, setAiHint] = useState('');
  const [aiHintError, setAiHintError] = useState('');
  const [aiHintLoading, setAiHintLoading] = useState(false);
  const [finishResult, setFinishResult] = useState<FinishResult | null>(null);
  const completed = lesson && course ? isLessonCompleted(progress, course.id, lesson.id) : false;

  if (!lesson || !course) return <Header title="Lektion nicht gefunden" subtitle="Gehe zu einem Kurs und wähle eine andere Lektion." />;
  const quizExercises = lesson.exercises.filter((exercise) => exercise.type === 'multiple_choice' || exercise.type === 'true_false' || exercise.type === 'scenario');
  const quizComplete = quizExercises.every((exercise) => answeredExercises[exercise.id]);
  const codeValue = lesson.codingChallenge ? (codeDrafts[lesson.id] ?? lesson.codingChallenge.starterCode) : '';
  const feedback = codeFeedback[lesson.id];
  const codingComplete = !lesson.codingChallenge || feedback?.status === 'correct' || completed;
  const blankValue = blankInputs[lesson.id] ?? '';
  const blankState = blankResults[lesson.id];
  const blankComplete = blankState === 'correct' || completed;
  const courseLessons = course.modules.flatMap((module) => module.lessons);
  const nextLesson = courseLessons[courseLessons.findIndex((item) => item.id === lesson.id) + 1];
  const stepProgress = ((step + 1) / lessonSteps.length) * 100;

  const finish = () => {
    if (completed) {
      navigate(`/courses/${course.id}`);
      return;
    }
    const after = computeLessonCompletion(progress, course.id, lesson.id, lesson.xp);
    const levelAfter = calculateLevel(after.xp);
    setFinishResult({
      xpGained: after.xp - progress.xp,
      levelBefore: calculateLevel(progress.xp).level,
      level: levelAfter.level,
      levelProgress: levelAfter.progress,
      streak: after.streak,
      bonusAwarded: after.daily.bonusAwarded && !progress.daily.bonusAwarded,
      newBadges: getNewlyEarnedBadges(progress, after),
      quests: getDailyQuests(after)
    });
    complete(course.id, lesson.id, lesson.xp);
  };

  const checkCode = () => {
    if (!lesson.codingChallenge) return;
    setCodeFeedback((current) => ({
      ...current,
      [lesson.id]: evaluateCode(codeValue, lesson.codingChallenge!)
    }));
  };

  const saveAiKey = () => {
    saveOpenRouterApiKey(openRouterKey);
    setOpenRouterKey(loadOpenRouterApiKey());
    setAiHintError('');
  };

  const askAiForHint = async () => {
    if (!lesson.codingChallenge) return;
    setAiHintLoading(true);
    setAiHintError('');
    setAiHint('');
    try {
      const hint = await requestCodeHint({
        apiKey: openRouterKey,
        courseTitle: course.title,
        lessonTitle: lesson.title,
        language: lesson.codingChallenge.language,
        challengePrompt: lesson.codingChallenge.prompt,
        code: codeValue,
        localFeedback: feedback ? `${feedback.title}: ${feedback.message} ${feedback.hints.join(' ')}` : ''
      });
      setAiHint(hint);
    } catch (error) {
      setAiHintError(error instanceof Error ? error.message : 'KI-Hilfe konnte nicht geladen werden.');
    } finally {
      setAiHintLoading(false);
    }
  };

  const checkBlank = () => {
    const correct = isFillBlankAnswerCorrect(blankValue, lesson.fillBlank.answer);
    setBlankResults((current) => ({ ...current, [lesson.id]: correct ? 'correct' : 'wrong' }));
    if (!correct) setBlankAttempts((current) => ({ ...current, [lesson.id]: (current[lesson.id] ?? 0) + 1 }));
  };

  const revealBlank = () => {
    setBlankInputs((current) => ({ ...current, [lesson.id]: lesson.fillBlank.answer }));
    setBlankResults((current) => ({ ...current, [lesson.id]: 'correct' }));
  };

  const goToNextLesson = () => {
    setFinishResult(null);
    setStep(0);
    if (nextLesson) {
      navigate(`/lessons/${nextLesson.id}`);
    } else {
      navigate(`/courses/${course.id}`);
    }
  };

  return (
    <div>
      <Header title={lesson.title} subtitle={`${course.title} · ${lesson.estimatedMinutes} min · ${lesson.xp} XP`} />
      <div className="mb-4 flex gap-2">
        <Link to={`/courses/${course.id}`} className="flex min-h-10 items-center justify-center rounded-2xl border border-white/10 bg-panel px-4 text-sm font-extrabold text-muted">
          Kurs
        </Link>
        <Link to="/" className="flex min-h-10 items-center justify-center rounded-2xl border border-white/10 bg-panel px-4 text-sm font-extrabold text-muted">
          Start
        </Link>
      </div>
      <div className="mb-4 grid grid-cols-6 gap-1.5 lg:hidden">
        {lessonSteps.map((label, index) => (
          <button key={label} onClick={() => setStep(index)} className={`h-10 rounded-xl px-1 text-[11px] font-extrabold ${step === index ? 'bg-text text-ink' : 'bg-panel text-muted'}`}>
            {label}
          </button>
        ))}
      </div>
      <div className="mb-4 rounded-2xl border border-white/10 bg-panel/70 p-3">
        <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-muted">
          <span>{lessonSteps[step]}</span>
          <span>{step + 1}/{lessonSteps.length}</span>
        </div>
        <ProgressBar value={stepProgress} accent={course.accent} />
      </div>

      <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
        <aside className="hidden lg:block">
          <div className="sticky top-8 rounded-3xl border border-white/10 bg-panel/90 p-5 shadow-glow">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-muted">Lektionsschritte</p>
            <div className="mt-4 grid gap-2">
              {lessonSteps.map((label, index) => (
                <button
                  key={label}
                  onClick={() => setStep(index)}
                  className={`flex min-h-11 items-center justify-between rounded-2xl px-3 text-left text-sm font-extrabold ${
                    step === index ? 'bg-text text-ink' : index < step ? 'bg-emerald-300/10 text-emerald-100' : 'bg-white/5 text-muted'
                  }`}
                >
                  <span>{label}</span>
                  <span className="text-xs">{index + 1}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-extrabold">Zum Abschließen</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                <li>{blankComplete ? '✓' : '·'} Lücke lösen</li>
                <li>{quizComplete ? '✓' : '·'} Quiz beantworten</li>
                <li>{codingComplete ? '✓' : '·'} Code-Check bestehen</li>
              </ul>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
      <section className="rounded-3xl border border-white/10 bg-panel p-5 shadow-glow lg:p-7">
        {step === 0 ? (
          <div>
            <h2 className="text-xl font-black">Verstehe die Idee</h2>
            <p className="mt-4 text-base leading-8 text-slate-200">{lesson.theory}</p>
            <div className="mt-5 grid gap-3">
              {lesson.knowledge.map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-muted">Wissen {index + 1}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div>
            <h2 className="text-xl font-black">Lies den Code</h2>
            <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-ink p-4 text-sm leading-6 text-sky-100"><code>{lesson.codeExample.code}</code></pre>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <h2 className="text-xl font-black">Fülle die Lücke</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{lesson.fillBlank.instruction}</p>
            <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-ink p-4 text-sm leading-6 text-sky-100"><code>{lesson.fillBlank.code}</code></pre>
            <input
              value={blankValue}
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              placeholder="____"
              onChange={(event) => {
                setBlankInputs((current) => ({ ...current, [lesson.id]: event.target.value }));
                setBlankResults((current) => {
                  const next = { ...current };
                  delete next[lesson.id];
                  return next;
                });
              }}
              className={`mt-4 min-h-12 w-full rounded-2xl border bg-ink px-4 font-mono text-sm outline-none ${
                blankState === 'correct' ? 'border-emerald-300/60' : blankState === 'wrong' ? 'border-red-300/60' : 'border-white/10 focus:border-sky-300'
              }`}
            />
            <button onClick={checkBlank} className="mt-3 min-h-12 w-full rounded-2xl bg-text font-extrabold text-ink">
              Antwort prüfen
            </button>
            {blankState === 'correct' ? (
              <p className="mt-3 rounded-2xl border border-emerald-300/40 bg-emerald-300/10 p-4 text-sm font-bold leading-6 text-emerald-100">
                Richtig! Genau dieser Baustein macht das Beispiel vollständig.
              </p>
            ) : null}
            {blankState === 'wrong' ? (
              <div className="mt-3 rounded-2xl border border-yellow-300/40 bg-yellow-300/10 p-4">
                <p className="text-sm leading-6 text-yellow-100">Noch nicht ganz. {lesson.fillBlank.hint}</p>
                {(blankAttempts[lesson.id] ?? 0) >= 2 ? (
                  <button onClick={revealBlank} className="mt-3 min-h-10 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-bold">
                    Lösung anzeigen
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-5">
            {quizExercises.map((exercise) => (
              <ExerciseRenderer
                key={exercise.id}
                exercise={exercise}
                onAnswered={(result, rating) => {
                  setAnsweredExercises((current) => ({ ...current, [exercise.id]: true }));
                  recordExerciseResult({ result, exercise, lessonId: lesson.id, courseId: course.id, rating });
                }}
              />
            ))}
          </div>
        ) : null}

        {step === 4 ? (
          <div>
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-300/10 text-sky-100">
                <Code2 size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black">Schreibe selbst Code</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {lesson.codingChallenge?.prompt ?? 'Für diese Lektion ist noch keine Coding-Challenge hinterlegt.'}
                </p>
              </div>
            </div>

            {lesson.codingChallenge ? (
              <>
                <textarea
                  value={codeValue}
                  spellCheck={false}
                  onChange={(event) => {
                    setCodeDrafts((current) => ({ ...current, [lesson.id]: event.target.value }));
                    setCodeFeedback((current) => {
                      const next = { ...current };
                      delete next[lesson.id];
                      return next;
                    });
                  }}
                  className="mt-4 min-h-[220px] w-full resize-y rounded-2xl border border-white/10 bg-ink p-4 font-mono text-sm leading-6 text-sky-100 outline-none focus:border-sky-300"
                />
                <button onClick={checkCode} className="mt-4 min-h-12 w-full rounded-2xl bg-text px-4 font-extrabold text-ink">
                  Code prüfen
                </button>
                {feedback ? (
                  <div className={`mt-4 rounded-2xl border p-4 ${feedback.status === 'correct' ? 'border-emerald-300/40 bg-emerald-300/10' : feedback.status === 'syntax-error' ? 'border-red-300/40 bg-red-300/10' : 'border-yellow-300/40 bg-yellow-300/10'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-extrabold">{feedback.title}</h3>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">{feedback.score}%</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{feedback.message}</p>
                    {feedback.hints.length > 0 ? (
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                        {feedback.hints.map((hint) => <li key={hint}>• {hint}</li>)}
                      </ul>
                    ) : null}
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-muted">{feedback.passedChecks}/{feedback.totalChecks} Checks bestanden</p>
                  </div>
                ) : null}
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-yellow-300/10 text-yellow-100">
                      <Lightbulb size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold">KI-Hilfe</h3>
                      <p className="mt-1 text-sm leading-6 text-muted">OpenRouter gibt nur Hinweise zur nächsten Idee, keine komplette Lösung.</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
                    <input
                      value={openRouterKey}
                      type="password"
                      autoComplete="off"
                      placeholder="OpenRouter API-Key lokal speichern"
                      onChange={(event) => setOpenRouterKey(event.target.value)}
                      className="min-h-11 rounded-2xl border border-white/10 bg-ink px-4 text-sm outline-none focus:border-yellow-200"
                    />
                    <button onClick={saveAiKey} className="min-h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-extrabold">
                      Key speichern
                    </button>
                  </div>
                  <button onClick={askAiForHint} disabled={aiHintLoading} className="mt-3 min-h-12 w-full rounded-2xl bg-yellow-200 px-4 font-extrabold text-ink disabled:opacity-50">
                    {aiHintLoading ? 'KI denkt nach...' : 'Hinweis anfordern'}
                  </button>
                  {aiHint ? <p className="mt-3 whitespace-pre-line rounded-2xl border border-yellow-300/30 bg-yellow-300/10 p-4 text-sm leading-6 text-yellow-50">{aiHint}</p> : null}
                  {aiHintError ? <p className="mt-3 rounded-2xl border border-red-300/40 bg-red-300/10 p-4 text-sm leading-6 text-red-100">{aiHintError}</p> : null}
                  <p className="mt-3 text-xs leading-5 text-muted">Der Key wird nur in diesem Browser gespeichert. Für eine öffentliche Deployment-Version sollte später ein Backend-Proxy verwendet werden.</p>
                </div>
              </>
            ) : null}
          </div>
        ) : null}

        {step === 5 ? (
          <div>
            <h2 className="text-xl font-black">Praxisaufgabe</h2>
            <p className="mt-3 text-base leading-7 text-slate-200">{lesson.practice.prompt}</p>
            <ul className="mt-4 space-y-2">
              {lesson.practice.checklist.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted"><Check size={17} className="mt-0.5 shrink-0 text-emerald-300" /> {item}</li>
              ))}
            </ul>
            <p className="mt-4 rounded-2xl bg-white/5 p-4 text-sm leading-6 text-sky-100">Hinweis: {lesson.practice.hint}</p>
          </div>
        ) : null}
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-panel font-extrabold disabled:opacity-40">
          <ChevronLeft size={18} /> Zurück
        </button>
        {step < lessonSteps.length - 1 ? (
          <button onClick={() => setStep((current) => Math.min(lessonSteps.length - 1, current + 1))} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-text font-extrabold text-ink">
            Weiter <ChevronRight size={18} />
          </button>
        ) : (
          <button disabled={(!quizComplete || !codingComplete || !blankComplete) && !completed} onClick={finish} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-300 font-extrabold text-ink disabled:opacity-40">
            {completed ? 'Erledigt' : 'Abschließen'}
          </button>
        )}
      </div>
      <Link to={`/courses/${course.id}`} className="mt-4 block text-center text-sm font-bold text-muted">Zurück zu {course.title}</Link>
        </div>
      </div>

      {finishResult ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/85 backdrop-blur-sm">
          <div className="success-card relative w-full max-w-[480px] overflow-hidden rounded-t-[28px] border border-white/10 bg-panel p-6 pb-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32" aria-hidden>
              {confettiPieces.map((piece) => (
                <span
                  key={piece.left}
                  className="confetti-piece absolute top-2 h-2.5 w-2.5 rounded-sm"
                  style={{ left: piece.left, background: piece.color, animationDelay: piece.delay }}
                />
              ))}
            </div>
            <div className="success-pop mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-emerald-300/15 text-emerald-200">
              <PartyPopper size={30} />
            </div>
            <h2 className="mt-4 text-center text-2xl font-black">Lektion abgeschlossen!</h2>
            <p className="mt-2 text-center text-lg font-black text-emerald-200">
              +{finishResult.xpGained} XP{finishResult.bonusAwarded ? ' inkl. Tagesbonus' : ''}
            </p>
            {finishResult.level > finishResult.levelBefore ? (
              <p className="mt-1 text-center text-sm font-extrabold text-yellow-200">Level Up! Du bist jetzt Level {finishResult.level}.</p>
            ) : null}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-bold text-muted">
                <span>Level {finishResult.level}</span>
                <span className="inline-flex items-center gap-1"><Flame size={14} className="text-orange-300" /> {formatDayCount(finishResult.streak)} Streak</span>
              </div>
              <div className="mt-2"><ProgressBar value={finishResult.levelProgress} accent="#86efac" /></div>
            </div>
            {finishResult.newBadges.length > 0 ? (
              <div className="mt-5 rounded-2xl border border-yellow-300/30 bg-yellow-300/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-yellow-100">Neues Badge</p>
                <div className="mt-2 space-y-1">
                  {finishResult.newBadges.map((badge) => (
                    <p key={badge.id} className="text-sm font-extrabold">{badge.icon} {badge.title} <span className="font-bold text-muted">— {badge.description}</span></p>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="mt-5 space-y-2">
              {finishResult.quests.map((quest) => (
                <div key={quest.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className={`font-bold ${quest.done ? 'text-emerald-200' : 'text-muted'}`}>{quest.done ? '✓' : '·'} {quest.title}</span>
                  <span className="shrink-0 text-xs font-black text-muted">{Math.min(quest.current, quest.target)}/{quest.target}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3">
              <button onClick={goToNextLesson} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-text font-extrabold text-ink">
                {nextLesson ? 'Nächste Lektion' : 'Zurück zum Kurs'} <ChevronRight size={18} />
              </button>
              <button onClick={() => { setFinishResult(null); navigate(`/courses/${course.id}`); }} className="min-h-12 rounded-2xl border border-white/10 bg-white/5 font-extrabold">
                Zur Kursübersicht
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
