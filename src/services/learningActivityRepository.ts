import type { LearningActivityState } from '../models/learning';

const STORAGE_KEY = 'devpath-learning-activity-v1';

export const defaultLearningActivityState: LearningActivityState = {
  mistakes: [],
  reviewCards: []
};

export interface LearningActivityRepository {
  load: () => LearningActivityState;
  save: (state: LearningActivityState) => void;
}

export const localLearningActivityRepository: LearningActivityRepository = {
  load: loadLearningActivityState,
  save: saveLearningActivityState
};

export function loadLearningActivityState(): LearningActivityState {
  if (typeof localStorage === 'undefined') return defaultLearningActivityState;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultLearningActivityState;

  try {
    const stored = JSON.parse(raw) as Partial<LearningActivityState>;
    return {
      mistakes: stored.mistakes ?? [],
      reviewCards: stored.reviewCards ?? []
    };
  } catch {
    return defaultLearningActivityState;
  }
}

export function saveLearningActivityState(state: LearningActivityState) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function createMemoryLearningActivityRepository(initialState: LearningActivityState = defaultLearningActivityState): LearningActivityRepository {
  let currentState = initialState;

  return {
    load: () => currentState,
    save: (state) => {
      currentState = state;
    }
  };
}
