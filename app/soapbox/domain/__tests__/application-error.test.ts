import {
  ApplicationError,
  normalizeTransportError,
  parseRetryAfterMs,
} from '../application-error';

describe('application error model', () => {
  it.each([
    [{ response: { status: 401 } }, 'unauthenticated', false],
    [{ response: { status: 403 } }, 'forbidden', false],
    [{ response: { status: 503 } }, 'transient', true],
    [{ code: 'ERR_CANCELED' }, 'cancelled', false],
    [{ message: 'Network Error' }, 'transient', true],
  ])('classifies transport failures without copying remote response content', (input, kind, retryable) => {
    const error = normalizeTransportError(input);
    expect(error).toMatchObject({ kind, retryable });
    expect(JSON.stringify(error)).not.toContain('response');
  });

  it('distinguishes offline failures and bounds retry-after delays', () => {
    expect(normalizeTransportError({ message: 'Network Error' }, { online: false }).kind).toBe('offline');
    expect(parseRetryAfterMs('999999', 0)).toBe(15 * 60 * 1000);
    expect(parseRetryAfterMs('Thu, 01 Jan 1970 00:00:05 GMT', 1000)).toBe(4000);
  });

  it('preserves an already-normalized application error', () => {
    const original = new ApplicationError({ kind: 'protocol', message: 'Invalid response.' });
    expect(normalizeTransportError(original)).toBe(original);
  });
});
