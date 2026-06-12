import { courses } from '../data/courses';
import type { BadgeDefinition, BadgeState, UserProgress } from '../models/learning';
import { calculateLevel } from './progressService';

type BadgeRule = BadgeDefinition & { isEarned: (progress: UserProgress) => boolean };

const countCompletedLessons = (progress: UserProgress) =>
  Object.values(progress.completedLessons).reduce((sum, ids) => sum + (ids?.length ?? 0), 0);

const countTouchedCourses = (progress: UserProgress) =>
  Object.values(progress.completedLessons).filter((ids) => (ids?.length ?? 0) > 0).length;

const hasCompletedAnyCourse = (progress: UserProgress) =>
  courses.some((course) => {
    const total = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
    return total > 0 && (progress.completedLessons[course.id]?.length ?? 0) >= total;
  });

const badgeRules: BadgeRule[] = [
  { id: 'first-lesson', title: 'Erste Schritte', description: 'Schließe deine erste Lektion ab.', icon: '🌱', isEarned: (p) => countCompletedLessons(p) >= 1 },
  { id: 'lessons-10', title: 'Dranbleiber', description: 'Schließe 10 Lektionen ab.', icon: '📚', isEarned: (p) => countCompletedLessons(p) >= 10 },
  { id: 'lessons-25', title: 'Lernmaschine', description: 'Schließe 25 Lektionen ab.', icon: '🚀', isEarned: (p) => countCompletedLessons(p) >= 25 },
  { id: 'lessons-50', title: 'Marathon', description: 'Schließe 50 Lektionen ab.', icon: '🏗️', isEarned: (p) => countCompletedLessons(p) >= 50 },
  { id: 'streak-3', title: 'Warmgelaufen', description: 'Lerne an 3 Tagen in Folge.', icon: '🔥', isEarned: (p) => p.bestStreak >= 3 },
  { id: 'streak-7', title: 'Eine Woche Fokus', description: 'Lerne an 7 Tagen in Folge.', icon: '⚡', isEarned: (p) => p.bestStreak >= 7 },
  { id: 'streak-14', title: 'Nicht zu stoppen', description: 'Lerne an 14 Tagen in Folge.', icon: '🌋', isEarned: (p) => p.bestStreak >= 14 },
  { id: 'level-5', title: 'Level 5', description: 'Erreiche Level 5.', icon: '⭐', isEarned: (p) => calculateLevel(p.xp).level >= 5 },
  { id: 'level-10', title: 'Level 10', description: 'Erreiche Level 10.', icon: '🏆', isEarned: (p) => calculateLevel(p.xp).level >= 10 },
  { id: 'quiz-25', title: 'Quiz-Profi', description: 'Beantworte 25 Quizfragen richtig.', icon: '🧠', isEarned: (p) => p.quizCorrectTotal >= 25 },
  { id: 'course-complete', title: 'Kurs gemeistert', description: 'Schließe einen kompletten Kurs ab.', icon: '🎓', isEarned: hasCompletedAnyCourse },
  { id: 'explorer', title: 'Sprachen-Scout', description: 'Schließe Lektionen in 4 verschiedenen Kursen ab.', icon: '🧭', isEarned: (p) => countTouchedCourses(p) >= 4 }
];

export const badgeDefinitions: BadgeDefinition[] = badgeRules.map(({ id, title, description, icon }) => ({ id, title, description, icon }));

export function getBadgeStates(progress: UserProgress): BadgeState[] {
  return badgeRules.map((rule) => ({
    badge: { id: rule.id, title: rule.title, description: rule.description, icon: rule.icon },
    earned: rule.isEarned(progress)
  }));
}

export function getNewlyEarnedBadges(before: UserProgress, after: UserProgress): BadgeDefinition[] {
  return badgeRules
    .filter((rule) => !rule.isEarned(before) && rule.isEarned(after))
    .map(({ id, title, description, icon }) => ({ id, title, description, icon }));
}
