export type LanguageId =
  | 'python'
  | 'csharp'
  | 'java'
  | 'html'
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'react'
  | 'git'
  | 'sql'
  | 'backend'
  | 'automation';
export type Difficulty = 'basic' | 'intermediate' | 'advanced';
export type ThemeMode = 'dark' | 'light';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  difficulty: Difficulty;
}

export interface CodeExample {
  language: string;
  code: string;
}

export interface PracticeTask {
  prompt: string;
  checklist: string[];
  hint: string;
}

export interface CodingConceptCheck {
  id: string;
  label: string;
  pattern: string;
  hint: string;
}

export interface CodingChallenge {
  prompt: string;
  language: string;
  starterCode: string;
  solution: string;
  requiredConcepts: CodingConceptCheck[];
}

export interface FillBlankTask {
  instruction: string;
  code: string;
  answer: string;
  hint: string;
}

export interface Lesson {
  id: string;
  title: string;
  estimatedMinutes: number;
  xp: number;
  theory: string;
  knowledge: string[];
  codeExample: CodeExample;
  fillBlank: FillBlankTask;
  quiz: QuizQuestion[];
  practice: PracticeTask;
  codingChallenge?: CodingChallenge;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: LanguageId;
  title: string;
  shortName: string;
  description: string;
  accent: string;
  gradient: string;
  icon: string;
  modules: CourseModule[];
}

export interface PracticeProject {
  id: string;
  courseId: LanguageId;
  title: string;
  difficulty: Difficulty;
  duration: string;
  summary: string;
  requirements: string[];
  hints: string[];
  solutionNotes: string[];
}

export interface DailyActivity {
  date: string;
  lessonsCompleted: number;
  quizCorrect: number;
  xpEarned: number;
  bonusAwarded: boolean;
}

export interface UserProgress {
  displayName: string;
  avatarTone: string;
  xp: number;
  streak: number;
  bestStreak: number;
  quizCorrectTotal: number;
  lastActiveDate: string;
  completedLessons: Partial<Record<LanguageId, string[]>>;
  quizMistakes: string[];
  dailyGoal: number;
  daily: DailyActivity;
  theme: ThemeMode;
}

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface BadgeState {
  badge: BadgeDefinition;
  earned: boolean;
}

export interface DailyQuest {
  id: string;
  title: string;
  target: number;
  current: number;
  done: boolean;
}

export interface LevelInfo {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progress: number;
}

export interface QuizAnswer {
  questionId: string;
  correctOptionId: string;
  selectedOptionId: string;
}
