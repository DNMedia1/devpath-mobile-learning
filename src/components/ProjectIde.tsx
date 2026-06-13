import { autocompletion, type CompletionContext, type CompletionResult } from '@codemirror/autocomplete';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { type Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { AlertTriangle, CheckCircle2, Code2, Database, FileCode2, ListChecks, Play, RotateCcw, Sparkles, Table2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { PracticeProject } from '../models/learning';
import {
  getProjectFileCompletionSource,
  getProjectIdeConfig,
  getProjectRequirementItems,
  loadProjectWorkspace,
  saveProjectWorkspace,
  setProjectWorkspaceActiveFile,
  toggleProjectRequirement,
  updateProjectWorkspaceFile,
  type IdeLanguageId,
  type ProjectIdeCompletion
} from '../services/projectIdeService';
import { executeSqlSandboxQuery, getSqlSandbox, type SqlSandbox, type SqlSandboxExecutionResult, type SqlSandboxValue } from '../services/sqlSandboxService';

interface ProjectIdeProps {
  project: PracticeProject;
}

export function ProjectIde({ project }: ProjectIdeProps) {
  const config = useMemo(() => getProjectIdeConfig(project), [project]);
  const requirementItems = useMemo(() => getProjectRequirementItems(project), [project]);
  const [workspace, setWorkspace] = useState(() => loadProjectWorkspace(project));
  const activeFile = config.files.find((file) => file.id === workspace.activeFileId) ?? config.files[0];
  const activeCode = workspace.files[activeFile.id] ?? activeFile.starterCode;
  const activeCompletions = useMemo(() => getProjectFileCompletionSource(project, activeFile), [activeFile, project]);
  const completedRequirementCount = requirementItems.filter((requirement) => workspace.completedRequirementIds.includes(requirement.id)).length;
  const sqlSandbox = useMemo(() => project.courseId === 'sql' ? getSqlSandbox() : null, [project.courseId]);
  const [sqlResult, setSqlResult] = useState<SqlSandboxExecutionResult | null>(null);

  useEffect(() => {
    setWorkspace(loadProjectWorkspace(project));
  }, [project]);

  useEffect(() => {
    saveProjectWorkspace(project.id, workspace);
  }, [project.id, workspace]);

  useEffect(() => {
    setSqlResult(null);
  }, [activeFile.id, project.id]);

  const updateActiveCode = (code: string) => {
    setWorkspace((current) => updateProjectWorkspaceFile(current, activeFile.id, code));
  };

  const resetActiveFile = () => {
    setWorkspace((current) => updateProjectWorkspaceFile(current, activeFile.id, activeFile.starterCode));
  };

  const runSqlQuery = () => {
    if (!sqlSandbox) return;
    setSqlResult(executeSqlSandboxQuery(sqlSandbox, activeCode));
  };

  return (
    <section className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-[#08111d]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] p-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/10 text-sky-100">
            <Code2 size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-muted">{activeFile.displayLanguage}</p>
            <h3 className="truncate text-sm font-black text-text">{activeFile.fileName}</h3>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {sqlSandbox && activeFile.language === 'sql' ? (
            <button
              type="button"
              onClick={runSqlQuery}
              className="inline-flex min-h-10 items-center gap-2 rounded-2xl bg-emerald-400 px-3 text-xs font-black text-slate-950 transition hover:bg-emerald-300"
            >
              <Play size={16} />
              Query ausführen
            </button>
          ) : null}
          <button
            type="button"
            onClick={resetActiveFile}
            className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 text-xs font-black text-slate-200 transition hover:bg-white/10"
          >
            <RotateCcw size={16} />
            Datei zurücksetzen
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-white/10 bg-white/[0.02] p-2">
        {config.files.map((file) => (
          <button
            key={file.id}
            type="button"
            onClick={() => setWorkspace((current) => setProjectWorkspaceActiveFile(current, file.id))}
            className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-2xl border px-3 text-xs font-black transition ${
              activeFile.id === file.id
                ? 'border-sky-300/60 bg-sky-300/15 text-sky-100'
                : 'border-white/10 bg-white/5 text-muted hover:bg-white/10'
            }`}
          >
            <FileCode2 size={15} />
            {file.fileName}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <CodeMirrorEditor code={activeCode} language={activeFile.language} completions={activeCompletions} onChange={updateActiveCode} />
          {sqlSandbox && activeFile.language === 'sql' ? (
            <SqlSandboxPanel sandbox={sqlSandbox} result={sqlResult} onRun={runSqlQuery} />
          ) : null}
        </div>
        <aside className="border-t border-white/10 bg-white/[0.03] p-4 lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ListChecks size={18} className="text-sky-200" />
              <h3 className="text-sm font-black">Aufgaben</h3>
            </div>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-black text-muted">
              {completedRequirementCount}/{requirementItems.length}
            </span>
          </div>

          <div className="mt-3 grid gap-2">
            {requirementItems.map((requirement) => {
              const done = workspace.completedRequirementIds.includes(requirement.id);
              return (
                <button
                  key={requirement.id}
                  type="button"
                  onClick={() => setWorkspace((current) => toggleProjectRequirement(current, requirement.id))}
                  className={`flex min-h-12 items-start gap-2 rounded-2xl border p-3 text-left text-sm leading-5 transition ${
                    done ? 'border-emerald-300/50 bg-emerald-300/10 text-emerald-100' : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <CheckCircle2 size={17} className={`mt-0.5 shrink-0 ${done ? 'text-emerald-200' : 'text-muted'}`} />
                  <span>{requirement.label}</span>
                </button>
              );
            })}
          </div>

          <details className="mt-4 border-t border-white/10 pt-4">
            <summary className="cursor-pointer text-sm font-black">Hinweise</summary>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
              {project.hints.map((hint) => <li key={hint}>{hint}</li>)}
            </ul>
          </details>
          <details className="mt-4 border-t border-white/10 pt-4">
            <summary className="cursor-pointer text-sm font-black">Lösungsnotizen anzeigen</summary>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
              {project.solutionNotes.map((note) => <li key={note}>{note}</li>)}
            </ul>
          </details>
        </aside>
      </div>

      <div className="flex flex-wrap items-start gap-2 border-t border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-muted">
        <Sparkles size={16} className="mt-0.5 shrink-0 text-sky-200" />
        <span>
          Autocomplete ist auf {activeFile.displayLanguage} begrenzt. Drücke <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-slate-200">Ctrl</kbd> +{' '}
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-slate-200">Space</kbd> oder beginne zu tippen.
        </span>
      </div>
    </section>
  );
}

function SqlSandboxPanel({
  sandbox,
  result,
  onRun
}: {
  sandbox: SqlSandbox;
  result: SqlSandboxExecutionResult | null;
  onRun: () => void;
}) {
  return (
    <div className="border-t border-white/10 bg-[#0b1624] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Database size={18} className="text-emerald-200" />
            <h3 className="text-sm font-black text-text">Lokale Testdatenbank</h3>
          </div>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
            Schreibe SELECT-Abfragen gegen echte Seed-Daten. Die Daten bleiben lokal im Browser und werden bei jedem Lauf neu aus der Übungsdatenbank gelesen.
          </p>
        </div>
        <button
          type="button"
          onClick={onRun}
          className="inline-flex min-h-10 items-center gap-2 rounded-2xl bg-emerald-400 px-3 text-xs font-black text-slate-950 transition hover:bg-emerald-300"
        >
          <Play size={16} />
          Ausführen
        </button>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <SqlSchemaBrowser sandbox={sandbox} />
        <SqlResultView result={result} />
      </div>
    </div>
  );
}

function SqlSchemaBrowser({ sandbox }: { sandbox: SqlSandbox }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center gap-2">
        <Table2 size={17} className="text-sky-200" />
        <h4 className="text-xs font-black uppercase tracking-[0.14em] text-muted">Schema</h4>
      </div>
      <div className="mt-3 grid gap-3">
        {sandbox.tables.map((table) => (
          <details key={table.name} className="rounded-2xl border border-white/10 bg-[#08111d] p-3" open={table.name === 'lesson_progress'}>
            <summary className="cursor-pointer text-sm font-black text-slate-100">
              {table.name}
              <span className="ml-2 text-xs font-bold text-muted">{table.rows.length} Zeilen</span>
            </summary>
            <p className="mt-2 text-xs leading-5 text-muted">{table.description}</p>
            <dl className="mt-3 grid gap-2">
              {table.columns.map((column) => (
                <div key={column.name} className="grid gap-1 rounded-xl bg-white/[0.04] p-2">
                  <dt className="font-mono text-xs font-black text-sky-100">
                    {column.name}
                    <span className="ml-2 font-sans text-[11px] uppercase tracking-[0.12em] text-muted">{column.type}</span>
                  </dt>
                  <dd className="text-xs leading-5 text-muted">{column.description}</dd>
                </div>
              ))}
            </dl>
          </details>
        ))}
      </div>
    </div>
  );
}

function SqlResultView({ result }: { result: SqlSandboxExecutionResult | null }) {
  if (!result) {
    return (
      <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-5 text-center">
        <div>
          <Database size={30} className="mx-auto text-muted" />
          <h4 className="mt-3 text-sm font-black text-slate-100">Noch keine Query ausgeführt</h4>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted">
            Starte mit der Query in der aktiven Datei oder probiere <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs text-sky-100">select * from profiles;</code>
          </p>
        </div>
      </div>
    );
  }

  if (!result.ok) {
    return (
      <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-200" />
          <div>
            <h4 className="text-sm font-black text-amber-100">Query nicht ausgeführt</h4>
            <p className="mt-2 text-sm leading-6 text-amber-50/90">{result.error}</p>
            <p className="mt-3 rounded-2xl bg-black/15 p-3 text-sm leading-6 text-amber-50/80">{result.hint}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 p-3">
        <div>
          <h4 className="text-sm font-black text-slate-100">Ergebnis</h4>
          <p className="mt-1 text-xs text-muted">{result.message}</p>
        </div>
        <span className="rounded-full bg-emerald-300/10 px-2.5 py-1 text-xs font-black text-emerald-100">{result.rowCount} Zeilen</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr>
              {result.columns.map((column) => (
                <th key={column} className="border-b border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-xs font-black text-sky-100">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.length === 0 ? (
              <tr>
                <td className="px-3 py-5 text-center text-sm text-muted" colSpan={Math.max(result.columns.length, 1)}>
                  Keine Zeilen gefunden.
                </td>
              </tr>
            ) : (
              result.rows.map((row, rowIndex) => (
                <tr key={`sql-result-${rowIndex}`} className="odd:bg-white/[0.02]">
                  {result.columns.map((column) => (
                    <td key={`${rowIndex}-${column}`} className="border-b border-white/5 px-3 py-2 font-mono text-xs text-slate-100">
                      {formatSqlValue(row[column])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatSqlValue(value: SqlSandboxValue | undefined): string {
  if (value === undefined || value === null) return 'NULL';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
}

function CodeMirrorEditor({
  code,
  language,
  completions,
  onChange
}: {
  code: string;
  language: IdeLanguageId;
  completions: ProjectIdeCompletion[];
  onChange: (code: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const codeRef = useRef(code);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    if (!containerRef.current) return;

    const view = new EditorView({
      doc: codeRef.current,
      parent: containerRef.current,
      extensions: [
        basicSetup,
        editorTheme,
        EditorView.lineWrapping,
        ...languageExtensions(language),
        autocompletion({ override: [buildCompletionSource(completions)] }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) onChangeRef.current(update.state.doc.toString());
        })
      ]
    });

    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [completions, language]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const current = view.state.doc.toString();
    if (current === code) return;

    view.dispatch({
      changes: { from: 0, to: current.length, insert: code }
    });
  }, [code]);

  return <div ref={containerRef} className="project-ide-editor" />;
}

function buildCompletionSource(completions: ProjectIdeCompletion[]) {
  return (context: CompletionContext): CompletionResult | null => {
    const word = context.matchBefore(/[\w.-]+/);
    if (!context.explicit && (!word || word.from === word.to)) return null;

    return {
      from: word?.from ?? context.pos,
      options: completions.map((completion) => ({
        label: completion.label,
        type: completion.type,
        detail: completion.detail,
        apply: completion.apply ?? completion.label
      }))
    };
  };
}

function languageExtensions(language: IdeLanguageId): Extension[] {
  if (language === 'python') return [python()];
  if (language === 'java') return [java()];
  if (language === 'html') return [html()];
  if (language === 'css') return [css()];
  if (language === 'sql') return [sql()];
  if (language === 'javascript') return [javascript()];
  if (language === 'typescript') return [javascript({ typescript: true })];
  if (language === 'tsx') return [javascript({ jsx: true, typescript: true })];
  return [];
}

const editorTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: '#08111d',
      color: '#e7eefb',
      fontSize: '14px'
    },
    '.cm-scroller': {
      fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
      minHeight: '260px'
    },
    '.cm-content': {
      padding: '16px',
      caretColor: '#93c5fd'
    },
    '.cm-line': {
      lineHeight: '1.7'
    },
    '.cm-gutters': {
      backgroundColor: '#0b1624',
      color: '#64748b',
      border: 'none'
    },
    '.cm-activeLineGutter, .cm-activeLine': {
      backgroundColor: 'rgba(148, 163, 184, 0.08)'
    },
    '.cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: 'rgba(96, 165, 250, 0.32) !important'
    },
    '.cm-tooltip': {
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '16px',
      overflow: 'hidden',
      backgroundColor: '#101a27',
      color: '#e7eefb',
      boxShadow: '0 20px 70px rgba(0, 0, 0, 0.35)'
    },
    '.cm-tooltip-autocomplete ul': {
      fontFamily: 'Manrope, ui-sans-serif, system-ui, sans-serif'
    },
    '.cm-tooltip-autocomplete ul li[aria-selected]': {
      backgroundColor: 'rgba(96, 165, 250, 0.2)',
      color: '#ffffff'
    }
  },
  { dark: true }
);
