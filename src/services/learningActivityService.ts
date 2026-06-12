import type { MistakeEntry, SkillTag } from '../models/learning';

export interface WeakSkillTag {
  skillTag: SkillTag;
  count: number;
}

export function getWeakSkillTags(mistakes: MistakeEntry[]): WeakSkillTag[] {
  const counts = new Map<SkillTag, number>();

  for (const mistake of mistakes) {
    for (const tag of mistake.skillTags) {
      counts.set(tag, (counts.get(tag) ?? 0) + mistake.count);
    }
  }

  return [...counts.entries()]
    .map(([skillTag, count]) => ({ skillTag, count }))
    .sort((first, second) => second.count - first.count || first.skillTag.localeCompare(second.skillTag));
}

export function upsertMistakeEntry(mistakes: MistakeEntry[], entry: MistakeEntry): MistakeEntry[] {
  const existing = mistakes.find((mistake) => mistake.exerciseId === entry.exerciseId);
  if (!existing) return [entry, ...mistakes];

  return mistakes.map((mistake) =>
    mistake.exerciseId === entry.exerciseId
      ? {
          ...mistake,
          skillTags: entry.skillTags,
          selectedAnswer: entry.selectedAnswer,
          correctAnswer: entry.correctAnswer,
          feedback: entry.feedback,
          answeredAt: entry.answeredAt,
          count: mistake.count + 1
        }
      : mistake
  );
}
