import {
  LIFECYCLE_KEY,
  activateAccountGeneration,
  advanceSessionGeneration,
  assertSessionGenerationActive,
  captureAccountGeneration,
  captureSessionGeneration,
  completeAccountGenerationPurge,
  isAccountGenerationActive,
  needsAccountPurge,
  resetPersistenceLifecycleMemory,
  revokeAccountGeneration,
  StaleSessionGenerationError,
} from '../lifecycle';

const accountUrl = 'https://social.example/users/alice';

describe('persistence lifecycle generations', () => {
  beforeEach(() => {
    localStorage.removeItem(LIFECYCLE_KEY);
    resetPersistenceLifecycleMemory();
  });

  it('fences a captured account generation before purge cleanup begins', () => {
    activateAccountGeneration(accountUrl);
    const captured = captureAccountGeneration(accountUrl);

    const revocation = revokeAccountGeneration(accountUrl);

    expect(revocation.persisted).toBe(true);
    expect(revocation.generation).toBe(captured.generation + 1);
    expect(isAccountGenerationActive(captured)).toBe(false);
    expect(needsAccountPurge(accountUrl, revocation.generation)).toBe(true);
  });

  it('makes revocation and completion idempotent', () => {
    const first = revokeAccountGeneration(accountUrl);
    const second = revokeAccountGeneration(accountUrl);

    expect(second.generation).toBe(first.generation);
    expect(completeAccountGenerationPurge(accountUrl)).toBe(true);
    expect(completeAccountGenerationPurge(accountUrl)).toBe(true);
    expect(needsAccountPurge(accountUrl, first.generation)).toBe(false);
  });

  it('fails closed and recovers from a corrupt lifecycle record', () => {
    localStorage.setItem(LIFECYCLE_KEY, '{not-json');

    expect(captureAccountGeneration(accountUrl)).toEqual({ accountUrl, generation: 0 });
    expect(localStorage.getItem(LIFECYCLE_KEY)).toBeNull();
  });

  it('rejects results captured before a session transition', () => {
    const generation = captureSessionGeneration();
    advanceSessionGeneration();

    expect(() => assertSessionGenerationActive(generation)).toThrow(StaleSessionGenerationError);
  });

  it('keeps fencing active when storage quota prevents lifecycle persistence', () => {
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(key => {
      if (key === LIFECYCLE_KEY) throw new DOMException('quota exceeded', 'QuotaExceededError');
    });

    try {
      expect(revokeAccountGeneration(accountUrl).persisted).toBe(false);
    } finally {
      setItem.mockRestore();
    }
  });
});
