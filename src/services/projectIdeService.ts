import type { LanguageId, PracticeProject } from '../models/learning';

export type IdeLanguageId = 'python' | 'csharp' | 'java' | 'html' | 'css' | 'javascript' | 'typescript' | 'tsx' | 'bash' | 'sql' | 'json' | 'text';

export interface ProjectIdeCompletion {
  label: string;
  type: 'keyword' | 'function' | 'class' | 'variable' | 'snippet' | 'property';
  detail: string;
  apply?: string;
}

export interface ProjectIdeFile {
  id: string;
  fileName: string;
  language: IdeLanguageId;
  displayLanguage: string;
  starterCode: string;
}

export interface ProjectIdeConfig {
  language: IdeLanguageId;
  displayLanguage: string;
  fileName: string;
  starterCode: string;
  completions: ProjectIdeCompletion[];
  files: ProjectIdeFile[];
  defaultFileId: string;
}

export interface ProjectRequirementItem {
  id: string;
  label: string;
}

export interface ProjectWorkspaceState {
  activeFileId: string;
  files: Record<string, string>;
  completedRequirementIds: string[];
  updatedAt: string;
}

const WORKSPACE_STORAGE_PREFIX = 'devpath-project-workspace';

const completionByCourse: Record<LanguageId, ProjectIdeCompletion[]> = {
  python: [
    completion('def', 'keyword', 'Function definition', 'def function_name():\n    pass'),
    completion('return', 'keyword', 'Return a value'),
    completion('Path', 'class', 'pathlib file helper', 'Path("tasks.json")'),
    completion('json.loads', 'function', 'Parse JSON text'),
    completion('json.dumps', 'function', 'Serialize JSON'),
    completion('argparse.ArgumentParser', 'class', 'CLI parser')
  ],
  csharp: [
    completion('class', 'keyword', 'Class declaration', 'public class LessonProgress\n{\n}'),
    completion('record', 'keyword', 'Immutable data model'),
    completion('List<T>', 'class', 'Generic list'),
    completion('Console.WriteLine', 'function', 'Write to console'),
    completion('async Task', 'snippet', 'Async method'),
    completion('return', 'keyword', 'Return a value')
  ],
  java: [
    completion('class', 'keyword', 'Class declaration', 'public class LessonProgress {\n}'),
    completion('record', 'keyword', 'Compact data carrier'),
    completion('List.of', 'function', 'Create immutable list'),
    completion('private final', 'snippet', 'Immutable field'),
    completion('return', 'keyword', 'Return a value'),
    completion('System.out.println', 'function', 'Print output')
  ],
  html: [
    completion('main', 'snippet', 'Main landmark', '<main>\n  \n</main>'),
    completion('section', 'snippet', 'Page section', '<section>\n  \n</section>'),
    completion('article', 'snippet', 'Standalone content', '<article>\n  \n</article>'),
    completion('label', 'snippet', 'Form label', '<label for="field">Label</label>'),
    completion('input', 'snippet', 'Input field', '<input id="field" name="field" />'),
    completion('button', 'snippet', 'Action button', '<button type="button">Continue</button>')
  ],
  css: [
    completion('display: grid', 'property', 'Grid layout'),
    completion('display: flex', 'property', 'Flex layout'),
    completion('gap', 'property', 'Spacing between children'),
    completion('minmax', 'function', 'Responsive grid size'),
    completion('@media', 'snippet', 'Responsive breakpoint', '@media (min-width: 720px) {\n  \n}'),
    completion('transition', 'property', 'Motion transition')
  ],
  javascript: [
    completion('const', 'keyword', 'Block-scoped constant'),
    completion('function', 'keyword', 'Function declaration', 'function name() {\n  return null;\n}'),
    completion('fetch', 'function', 'HTTP request'),
    completion('async', 'keyword', 'Async function marker'),
    completion('await', 'keyword', 'Wait for promise'),
    completion('addEventListener', 'function', 'DOM event listener')
  ],
  typescript: [
    completion('type', 'keyword', 'Type alias', 'type Model = {\n  id: string;\n};'),
    completion('interface', 'keyword', 'Object contract', 'interface Model {\n  id: string;\n}'),
    completion('readonly', 'keyword', 'Immutable property'),
    completion('unknown', 'keyword', 'Validated external value'),
    completion('Promise', 'class', 'Async result type'),
    completion('Result<T>', 'snippet', 'Success or failure union', 'type Result<T> = { ok: true; data: T } | { ok: false; error: string };')
  ],
  react: [
    completion('useState', 'function', 'React state hook', 'const [value, setValue] = useState("");'),
    completion('useEffect', 'function', 'React effect hook', 'useEffect(() => {\n  \n}, []);'),
    completion('useMemo', 'function', 'Memoized derived value'),
    completion('props', 'variable', 'Component inputs'),
    completion('className', 'property', 'React CSS class prop'),
    completion('onClick', 'property', 'Click handler prop')
  ],
  git: [
    completion('git status', 'function', 'Inspect working tree'),
    completion('git add', 'function', 'Stage files'),
    completion('git commit', 'function', 'Create commit', 'git commit -m "feat: describe change"'),
    completion('git switch', 'function', 'Switch branch'),
    completion('git merge', 'function', 'Merge branch'),
    completion('git push', 'function', 'Push commits')
  ],
  sql: [
    completion('select', 'keyword', 'Read rows', 'select column_name\nfrom table_name;'),
    completion('from', 'keyword', 'Choose table'),
    completion('where', 'keyword', 'Filter rows'),
    completion('join', 'keyword', 'Combine related tables', 'join table_name on first_table.id = table_name.first_table_id'),
    completion('group by', 'keyword', 'Group rows for aggregates'),
    completion('order by', 'keyword', 'Sort rows'),
    completion('limit', 'keyword', 'Limit result rows'),
    completion('count(*)', 'function', 'Count rows in a group'),
    completion('create table', 'snippet', 'Create table', 'create table table_name (\n  id uuid primary key\n);'),
    completion('insert into', 'keyword', 'Insert rows')
  ],
  backend: [
    completion('app.get', 'function', 'GET route', 'app.get("/health", (_request, response) => {\n  response.json({ status: "ok" });\n});'),
    completion('app.post', 'function', 'POST route'),
    completion('z.object', 'function', 'Zod schema'),
    completion('request.body', 'property', 'Request payload'),
    completion('response.status', 'function', 'HTTP status'),
    completion('logger.info', 'function', 'Structured log')
  ],
  automation: [
    completion('trigger', 'property', 'Automation trigger'),
    completion('action', 'property', 'Automation action'),
    completion('parameters', 'property', 'Tool parameters'),
    completion('requiresApproval', 'property', 'Human approval gate'),
    completion('onError', 'property', 'Error handling path'),
    completion('redact', 'property', 'Sensitive field masking')
  ]
};

const ideFilesByCourse: Record<LanguageId, ProjectIdeFile[]> = {
  python: [
    projectFile('main', 'main.py', 'python', 'Python', 'from pathlib import Path\nimport json\n\nDATA_FILE = Path("tasks.json")\n\n\ndef load_tasks():\n    if not DATA_FILE.exists():\n        return []\n    return json.loads(DATA_FILE.read_text(encoding="utf-8"))\n\n\ndef main():\n    print("Start project")\n\n\nif __name__ == "__main__":\n    main()\n'),
    projectFile('tasks', 'tasks.json', 'json', 'JSON', '[\n  {\n    "title": "Learn Python",\n    "done": false\n  }\n]\n')
  ],
  csharp: [
    projectFile('program', 'Program.cs', 'csharp', 'C#', 'public class Program\n{\n    public static void Main()\n    {\n        Console.WriteLine("Start project");\n    }\n}\n'),
    projectFile('progress-service', 'ProgressService.cs', 'csharp', 'C#', 'public class ProgressService\n{\n    public int AwardXp(int currentXp, int reward)\n    {\n        return currentXp + reward;\n    }\n}\n')
  ],
  java: [
    projectFile('main', 'Main.java', 'java', 'Java', 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Start project");\n    }\n}\n'),
    projectFile('badge-service', 'BadgeService.java', 'java', 'Java', 'import java.util.Set;\n\npublic class BadgeService {\n    public boolean hasStarterBadge(Set<String> completedLessons) {\n        return completedLessons.size() >= 3;\n    }\n}\n')
  ],
  html: [
    projectFile('index', 'index.html', 'html', 'HTML', '<header>\n  <nav aria-label="Primary">\n    <a href="#courses">Courses</a>\n  </nav>\n</header>\n<main>\n  <section id="courses">\n    <h1>Project</h1>\n  </section>\n</main>\n<footer>Keep learning.</footer>\n'),
    projectFile('styles', 'styles.css', 'css', 'CSS', 'body {\n  font-family: system-ui, sans-serif;\n  line-height: 1.5;\n}\n\nmain {\n  display: grid;\n  gap: 1rem;\n}\n')
  ],
  css: [
    projectFile('index', 'index.html', 'html', 'HTML', '<main class="project-grid">\n  <article class="card">First card</article>\n  <article class="card">Second card</article>\n</main>\n'),
    projectFile('styles', 'styles.css', 'css', 'CSS', '.project-grid {\n  display: grid;\n  gap: 1rem;\n}\n\n.card {\n  min-height: 120px;\n}\n')
  ],
  javascript: [
    projectFile('main', 'main.js', 'javascript', 'JavaScript', 'import { questions } from "./questions.js";\n\nfunction renderQuiz() {\n  console.log(questions.length);\n}\n\nrenderQuiz();\n'),
    projectFile('questions', 'questions.js', 'javascript', 'JavaScript', 'export const questions = [\n  {\n    prompt: "What does const mean?",\n    options: ["mutable", "block scoped", "global"],\n    correctIndex: 1\n  }\n];\n')
  ],
  typescript: [
    projectFile('domain', 'domain.ts', 'typescript', 'TypeScript', 'export type LessonStatus = "open" | "done";\n\nexport interface Lesson {\n  id: string;\n  title: string;\n  status: LessonStatus;\n}\n'),
    projectFile('api-result', 'apiResult.ts', 'typescript', 'TypeScript', 'export type ApiResult<T> =\n  | { ok: true; data: T }\n  | { ok: false; error: string };\n')
  ],
  react: [
    projectFile('app', 'ProjectApp.tsx', 'tsx', 'React TSX', 'import { useState } from "react";\n\ntype ProjectAppProps = {\n  title: string;\n};\n\nexport function ProjectApp({ title }: ProjectAppProps) {\n  const [selectedAnswer, setSelectedAnswer] = useState("");\n  return <section><h1>{title}</h1><p>{selectedAnswer}</p></section>;\n}\n'),
    projectFile('styles', 'styles.css', 'css', 'CSS', '.lesson-dashboard {\n  display: grid;\n  gap: 1rem;\n}\n')
  ],
  git: [
    projectFile('workflow', 'workflow.sh', 'bash', 'Git Shell', 'git status\n# Add your workflow commands here\n'),
    projectFile('pr-description', 'PR_DESCRIPTION.txt', 'text', 'Text', 'Summary:\n- \n\nTests:\n- \n\nRisk:\n- \n')
  ],
  sql: [
    projectFile('queries', 'queries.sql', 'sql', 'SQL', "select lesson_id, completed_at\nfrom lesson_progress\nwhere user_id = 'user_123'\norder by completed_at desc;\n"),
    projectFile('schema', 'schema.sql', 'sql', 'SQL', 'create table lesson_progress (\n  user_id uuid not null,\n  lesson_id text not null,\n  completed_at timestamptz not null,\n  primary key (user_id, lesson_id)\n);\n'),
    projectFile('dashboard-query', 'dashboard_query.sql', 'sql', 'SQL', "select profiles.name, lessons.title\nfrom lesson_progress\njoin profiles on lesson_progress.user_id = profiles.id\njoin lessons on lesson_progress.lesson_id = lessons.id\nwhere lessons.course_id = 'sql'\norder by lesson_progress.completed_at asc;\n")
  ],
  backend: [
    projectFile('api', 'api.ts', 'typescript', 'Backend TypeScript', 'app.post("/lessons/:lessonId/complete", (request, response) => {\n  response.status(204).send();\n});\n'),
    projectFile('schema', 'schema.ts', 'typescript', 'Zod Schema', 'const completionSchema = z.object({\n  userId: z.string().uuid(),\n  lessonId: z.string().min(1)\n});\n'),
    projectFile('repository', 'repository.ts', 'typescript', 'Repository', 'export interface ProgressRepository {\n  completeLesson(userId: string, lessonId: string): Promise<void>;\n}\n')
  ],
  automation: [
    projectFile('workflow', 'workflow.json', 'json', 'Automation JSON', '{\n  "trigger": "new_event",\n  "action": "create_task",\n  "requiresApproval": true\n}\n'),
    projectFile('prompt', 'agent-prompt.txt', 'text', 'Prompt', 'You summarize the ticket and prepare a task draft.\nNever send messages without human approval.\n')
  ]
};

export function getProjectIdeConfig(project: PracticeProject): ProjectIdeConfig {
  const files = ideFilesByCourse[project.courseId];
  const primaryFile = files[0];

  return {
    language: primaryFile.language,
    displayLanguage: primaryFile.displayLanguage,
    fileName: primaryFile.fileName,
    starterCode: primaryFile.starterCode,
    completions: getProjectLanguageCompletionSource(project),
    files,
    defaultFileId: primaryFile.id
  };
}

export function getProjectLanguageCompletionSource(project: PracticeProject): ProjectIdeCompletion[] {
  return completionByCourse[project.courseId];
}

export function getProjectFileCompletionSource(project: PracticeProject, file: ProjectIdeFile): ProjectIdeCompletion[] {
  if (file.language === 'css') return completionByCourse.css;
  if (file.language === 'html') return completionByCourse.html;
  if (file.language === 'sql') return completionByCourse.sql;
  if (file.language === 'python') return completionByCourse.python;
  if (file.language === 'java') return completionByCourse.java;
  if (file.language === 'javascript') return completionByCourse.javascript;
  if (file.language === 'tsx') return completionByCourse.react;
  if (file.language === 'typescript') return project.courseId === 'backend' ? completionByCourse.backend : completionByCourse.typescript;
  if (file.language === 'bash') return completionByCourse.git;
  if (file.language === 'json') return project.courseId === 'automation' ? completionByCourse.automation : completionByCourse.javascript;
  return getProjectLanguageCompletionSource(project);
}

export function getProjectRequirementItems(project: PracticeProject): ProjectRequirementItem[] {
  return project.requirements.map((requirement, index) => ({
    id: `${project.id}-requirement-${index + 1}`,
    label: requirement
  }));
}

export function createProjectWorkspace(project: PracticeProject, updatedAt = new Date().toISOString()): ProjectWorkspaceState {
  const config = getProjectIdeConfig(project);
  return {
    activeFileId: config.defaultFileId,
    files: Object.fromEntries(config.files.map((file) => [file.id, file.starterCode])),
    completedRequirementIds: [],
    updatedAt
  };
}

export function loadProjectWorkspace(project: PracticeProject): ProjectWorkspaceState {
  const initialWorkspace = createProjectWorkspace(project);
  if (typeof localStorage === 'undefined') return initialWorkspace;

  try {
    const raw = localStorage.getItem(getProjectWorkspaceStorageKey(project.id));
    if (!raw) return initialWorkspace;

    const parsed = JSON.parse(raw) as Partial<ProjectWorkspaceState>;
    return normalizeProjectWorkspace(project, parsed, initialWorkspace);
  } catch {
    return initialWorkspace;
  }
}

export function saveProjectWorkspace(projectId: string, workspace: ProjectWorkspaceState) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(getProjectWorkspaceStorageKey(projectId), JSON.stringify(workspace));
}

export function updateProjectWorkspaceFile(
  workspace: ProjectWorkspaceState,
  fileId: string,
  code: string,
  updatedAt = new Date().toISOString()
): ProjectWorkspaceState {
  return {
    ...workspace,
    files: {
      ...workspace.files,
      [fileId]: code
    },
    updatedAt
  };
}

export function setProjectWorkspaceActiveFile(
  workspace: ProjectWorkspaceState,
  fileId: string,
  updatedAt = new Date().toISOString()
): ProjectWorkspaceState {
  return {
    ...workspace,
    activeFileId: fileId,
    updatedAt
  };
}

export function toggleProjectRequirement(
  workspace: ProjectWorkspaceState,
  requirementId: string,
  updatedAt = new Date().toISOString()
): ProjectWorkspaceState {
  const completed = workspace.completedRequirementIds.includes(requirementId);
  return {
    ...workspace,
    completedRequirementIds: completed
      ? workspace.completedRequirementIds.filter((id) => id !== requirementId)
      : [...workspace.completedRequirementIds, requirementId],
    updatedAt
  };
}

function normalizeProjectWorkspace(
  project: PracticeProject,
  parsed: Partial<ProjectWorkspaceState>,
  initialWorkspace: ProjectWorkspaceState
): ProjectWorkspaceState {
  const config = getProjectIdeConfig(project);
  const validFileIds = new Set(config.files.map((file) => file.id));
  const requirementIds = new Set(getProjectRequirementItems(project).map((requirement) => requirement.id));
  const parsedFiles = parsed.files && typeof parsed.files === 'object' ? parsed.files : {};
  const files = Object.fromEntries(
    config.files.map((file) => [
      file.id,
      typeof parsedFiles[file.id] === 'string' ? parsedFiles[file.id] : initialWorkspace.files[file.id]
    ])
  );
  const activeFileId = typeof parsed.activeFileId === 'string' && validFileIds.has(parsed.activeFileId)
    ? parsed.activeFileId
    : initialWorkspace.activeFileId;

  return {
    activeFileId,
    files,
    completedRequirementIds: (parsed.completedRequirementIds ?? []).filter((id) => requirementIds.has(id)),
    updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : initialWorkspace.updatedAt
  };
}

function getProjectWorkspaceStorageKey(projectId: string) {
  return `${WORKSPACE_STORAGE_PREFIX}:${projectId}`;
}

function projectFile(
  id: string,
  fileName: string,
  language: IdeLanguageId,
  displayLanguage: string,
  starterCode: string
): ProjectIdeFile {
  return { id, fileName, language, displayLanguage, starterCode };
}

function completion(label: string, type: ProjectIdeCompletion['type'], detail: string, apply?: string): ProjectIdeCompletion {
  return { label, type, detail, apply };
}
