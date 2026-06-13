import { describe, expect, it } from 'vitest';
import { projects } from '@/data/projects';
import {
  createProjectWorkspace,
  getProjectFileCompletionSource,
  getProjectIdeConfig,
  getProjectLanguageCompletionSource,
  getProjectRequirementItems,
  loadProjectWorkspace,
  saveProjectWorkspace,
  toggleProjectRequirement,
  updateProjectWorkspaceFile
} from '@/services/projectIdeService';

describe('project IDE configuration', () => {
  it('provides a language-specific IDE config for every practice project', () => {
    for (const project of projects) {
      const config = getProjectIdeConfig(project);

      expect(config.displayLanguage.length).toBeGreaterThan(1);
      expect(config.fileName).toContain('.');
      expect(config.starterCode.length).toBeGreaterThan(10);
      expect(config.files.length).toBeGreaterThanOrEqual(1);
      expect(config.files[0].id).toBe(config.defaultFileId);
      expect(config.completions.length).toBeGreaterThanOrEqual(6);
    }
  });

  it('creates project-specific file workspaces for multi-file exercises', () => {
    const htmlProject = projects.find((project) => project.id === 'html-landing-page')!;
    const reactProject = projects.find((project) => project.id === 'react-lesson-dashboard')!;
    const backendProject = projects.find((project) => project.id === 'backend-progress-api')!;
    const pythonProject = projects.find((project) => project.id === 'python-todo-cli')!;

    expect(getProjectIdeConfig(htmlProject).files.map((file) => file.fileName)).toEqual(['index.html', 'styles.css']);
    expect(getProjectIdeConfig(reactProject).files.map((file) => file.fileName)).toEqual(['ProjectApp.tsx', 'styles.css']);
    expect(getProjectIdeConfig(backendProject).files.map((file) => file.fileName)).toEqual(['api.ts', 'schema.ts', 'repository.ts']);
    expect(getProjectIdeConfig(pythonProject).files.map((file) => file.fileName)).toEqual(['main.py', 'tasks.json']);
  });

  it('keeps autocomplete suggestions scoped to the project language', () => {
    const sqlProject = projects.find((project) => project.courseId === 'sql')!;
    const reactProject = projects.find((project) => project.courseId === 'react')!;
    const htmlProject = projects.find((project) => project.courseId === 'html')!;

    const sqlLabels = getProjectLanguageCompletionSource(sqlProject).map((completion) => completion.label);
    const reactLabels = getProjectLanguageCompletionSource(reactProject).map((completion) => completion.label);
    const cssFile = getProjectIdeConfig(htmlProject).files.find((file) => file.fileName === 'styles.css')!;
    const cssLabels = getProjectFileCompletionSource(htmlProject, cssFile).map((completion) => completion.label);

    expect(sqlLabels).toContain('select');
    expect(sqlLabels).not.toContain('useState');
    expect(reactLabels).toContain('useState');
    expect(reactLabels).not.toContain('select');
    expect(cssLabels).toContain('display: grid');
    expect(cssLabels).not.toContain('main');
  });

  it('persists active file, code changes and completed requirements locally', () => {
    localStorage.clear();
    const project = projects.find((candidate) => candidate.id === 'python-todo-cli')!;
    const config = getProjectIdeConfig(project);
    const tasksFile = config.files.find((file) => file.fileName === 'tasks.json')!;
    const firstRequirement = getProjectRequirementItems(project)[0];
    const initialWorkspace = createProjectWorkspace(project, '2026-06-13T10:00:00.000Z');

    const withCode = updateProjectWorkspaceFile(
      { ...initialWorkspace, activeFileId: tasksFile.id },
      tasksFile.id,
      '[{"title":"Learn Python","done":false}]',
      '2026-06-13T10:01:00.000Z'
    );
    const withRequirement = toggleProjectRequirement(withCode, firstRequirement.id, '2026-06-13T10:02:00.000Z');
    saveProjectWorkspace(project.id, withRequirement);

    const loaded = loadProjectWorkspace(project);
    expect(loaded.activeFileId).toBe(tasksFile.id);
    expect(loaded.files[tasksFile.id]).toContain('Learn Python');
    expect(loaded.completedRequirementIds).toEqual([firstRequirement.id]);
    expect(loaded.updatedAt).toBe('2026-06-13T10:02:00.000Z');
  });
});
