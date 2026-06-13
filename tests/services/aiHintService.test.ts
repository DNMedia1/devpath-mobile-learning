import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AI_HINT_LEVELS, clearOpenRouterApiKey, loadOpenRouterApiKey, requestCodeHint, saveOpenRouterApiKey } from '@/services/aiHintService';

describe('aiHintService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it('stores the OpenRouter API key only in local browser storage', () => {
    saveOpenRouterApiKey('sk-or-test');

    expect(loadOpenRouterApiKey()).toBe('sk-or-test');

    clearOpenRouterApiKey();
    expect(loadOpenRouterApiKey()).toBe('');
  });

  it('requests a hint without asking for a complete solution', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Prüfe zuerst, ob deine Funktion wirklich einen Wert zurückgibt.' } }]
      })
    });
    vi.stubGlobal('fetch', fetchMock);

    const hint = await requestCodeHint({
      apiKey: 'sk-or-test',
      courseTitle: 'Python',
      lessonTitle: 'Funktionen',
      language: 'python',
      challengePrompt: 'Schreibe eine Funktion, die den Durchschnitt zurückgibt.',
      code: 'def average(values):\n    sum(values) / len(values)',
      localFeedback: 'Ein return-Baustein fehlt noch.',
      hintLevel: 'nudge'
    });

    expect(hint).toContain('Funktion');
    const [, request] = fetchMock.mock.calls[0];
    const body = JSON.parse(request.body);
    expect(request.headers.Authorization).toBe('Bearer sk-or-test');
    expect(body.messages[0].content).toContain('keine vollständige Lösung');
    expect(body.messages[0].content).toContain('keinen vollständigen Codeblock');
    expect(body.messages[1].content).toContain('Ein return-Baustein fehlt noch.');
    expect(body.messages[1].content).toContain('Hilfestufe: Kleiner Hinweis');
    expect(body.messages[1].content).toContain('Formuliere nur einen knappen Anstoß');
    expect(body.max_tokens).toBeLessThanOrEqual(220);
  });

  it('uses different prompts and token budgets for each hint level', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Hinweistext' } }]
      })
    });
    vi.stubGlobal('fetch', fetchMock);

    for (const hintLevel of AI_HINT_LEVELS.map((level) => level.id)) {
      await requestCodeHint({
        apiKey: 'sk-or-test',
        courseTitle: 'React',
        lessonTitle: 'State',
        language: 'tsx',
        challengePrompt: 'Baue einen Button mit State.',
        code: 'const [count, setCount] = useState(0);',
        localFeedback: '',
        hintLevel
      });
    }

    const requestBodies = fetchMock.mock.calls.map(([, request]) => JSON.parse(request.body));
    expect(requestBodies.map((body) => body.max_tokens)).toEqual([120, 180, 220]);
    expect(requestBodies[0].messages[1].content).toContain('Hilfestufe: Kleiner Hinweis');
    expect(requestBodies[1].messages[1].content).toContain('Hilfestufe: Konkreter Denkansatz');
    expect(requestBodies[2].messages[1].content).toContain('Hilfestufe: Fehlerstelle erklären');
    expect(requestBodies[2].messages[1].content).toContain('Erkläre, welche konkrete Stelle wahrscheinlich falsch ist');
  });

  it('returns a helpful configuration error when no key is available', async () => {
    await expect(
      requestCodeHint({
        apiKey: '',
        courseTitle: 'Python',
        lessonTitle: 'Funktionen',
        language: 'python',
        challengePrompt: 'Schreibe eine Funktion.',
        code: '',
        localFeedback: '',
        hintLevel: 'nudge'
      })
    ).rejects.toThrow('OpenRouter API-Key fehlt');
  });
});
