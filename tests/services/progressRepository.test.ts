import { beforeEach, describe, expect, it } from 'vitest';
import { defaultProgress } from '@/services/progressService';
import { createMemoryProgressRepository, localProgressRepository } from '@/services/progressRepository';

describe('progressRepository', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads default progress when local storage is empty', () => {
    expect(localProgressRepository.load().displayName).toBe(defaultProgress.displayName);
  });

  it('round-trips progress through the local repository', () => {
    const progress = { ...defaultProgress, displayName: 'Dominik', xp: 240 };

    localProgressRepository.save(progress);

    expect(localProgressRepository.load()).toMatchObject({ displayName: 'Dominik', xp: 240 });
  });

  it('keeps progress in memory for test and future remote adapters', () => {
    const repository = createMemoryProgressRepository({ ...defaultProgress, xp: 10 });

    repository.save({ ...defaultProgress, xp: 120 });

    expect(repository.load().xp).toBe(120);
  });
});
