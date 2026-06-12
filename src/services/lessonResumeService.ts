const STORAGE_KEY = 'devpath-lesson-page';

function readMap(): Record<string, number> {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as Record<string, number>;
  } catch {
    // ignore broken storage and start fresh
  }
  return {};
}

function writeMap(map: Record<string, number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function loadLessonPage(lessonId: string): number {
  const value = readMap()[lessonId];
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

export function saveLessonPage(lessonId: string, pageIndex: number) {
  writeMap({ ...readMap(), [lessonId]: pageIndex });
}

export function clearLessonPage(lessonId: string) {
  const map = readMap();
  delete map[lessonId];
  writeMap(map);
}
