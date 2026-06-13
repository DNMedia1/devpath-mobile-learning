import { describe, expect, it } from 'vitest';
import { executeSqlSandboxQuery, getSqlSandbox } from './sqlSandboxService';

describe('sql sandbox service', () => {
  it('provides seeded learning tables for the local SQL lab', () => {
    const sandbox = getSqlSandbox();

    expect(sandbox.tables.map((table) => table.name)).toEqual(['profiles', 'lessons', 'lesson_progress']);
    expect(sandbox.tables.find((table) => table.name === 'lesson_progress')?.columns.map((column) => column.name)).toEqual([
      'user_id',
      'lesson_id',
      'completed_at',
      'xp'
    ]);
  });

  it('executes filtered and sorted SELECT queries against seed data', () => {
    const result = executeSqlSandboxQuery(
      getSqlSandbox(),
      "select lesson_id, completed_at from lesson_progress where user_id = 'user_123' order by completed_at desc limit 2;"
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.columns).toEqual(['lesson_id', 'completed_at']);
    expect(result.rows).toEqual([
      { lesson_id: 'sql-joins', completed_at: '2026-06-12T09:20:00.000Z' },
      { lesson_id: 'sql-select', completed_at: '2026-06-10T08:15:00.000Z' }
    ]);
  });

  it('supports simple joins with qualified column names', () => {
    const result = executeSqlSandboxQuery(
      getSqlSandbox(),
      [
        'select profiles.name, lessons.title',
        'from lesson_progress',
        'join profiles on lesson_progress.user_id = profiles.id',
        'join lessons on lesson_progress.lesson_id = lessons.id',
        "where lessons.course_id = 'sql'",
        'order by lesson_progress.completed_at asc;'
      ].join('\n')
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.columns).toEqual(['profiles.name', 'lessons.title']);
    expect(result.rows).toEqual([
      { 'profiles.name': 'Dominik', 'lessons.title': 'SELECT Grundlagen' },
      { 'profiles.name': 'Dominik', 'lessons.title': 'JOINs verstehen' },
      { 'profiles.name': 'Mara', 'lessons.title': 'JOINs verstehen' }
    ]);
  });

  it('keeps unsupported statements inside the learning boundary', () => {
    const result = executeSqlSandboxQuery(getSqlSandbox(), 'delete from lesson_progress;');

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error).toContain('SELECT');
    expect(result.hint).toContain('Testdaten');
  });
});
