import { redactDiagnosticValue } from '../diagnostics';

const serialized = (value: unknown): string => JSON.stringify(redactDiagnosticValue(value));

describe('diagnostic redaction', () => {
  it('redacts nested credentials, private content, URLs, and aliases', () => {
    const secret = 'forbidden-secret-value';
    const output = serialized({
      Authorization: `Bearer ${secret}`,
      nested: [{ access_token: secret, clientSecret: secret, password: secret, draft: secret, url: `https://example.com/callback?code=${secret}#${secret}` }],
    });
    expect(output).not.toContain(secret);
    expect(output).toContain('[REDACTED]');
  });

  it('redacts error details, identity, model content, and Unicode-confusable keys', () => {
    const secret = 'forbidden-secret-value';
    const error = new Error(`password: ${secret}`);
    Object.assign(error, {
      accοunt: secret,
      deviceId: secret,
      prompt: secret,
      response: { content: secret },
    });

    expect(serialized(error)).not.toContain(secret);
  });

  it('does not invoke getters or toJSON hooks and survives cycles', () => {
    let invoked = false;
    const hostile: Record<string, unknown> = {};
    Object.defineProperty(hostile, 'payload', { enumerable: true, get: () => {
      invoked = true; return 'forbidden-secret-value';
    } });
    hostile.toJSON = () => {
      invoked = true; return 'forbidden-secret-value';
    };
    hostile.self = hostile;

    const output = serialized(hostile);
    expect(invoked).toBe(false);
    expect(output).not.toContain('forbidden-secret-value');
    expect(output).toContain('[CIRCULAR]');
  });

  it('bounds depth, width, and oversized strings', () => {
    const wide = Object.fromEntries(Array.from({ length: 100 }, (_, index) => [`field${index}`, 'x'.repeat(5_000)]));
    const output = serialized({ one: { two: { three: { four: { five: { six: wide } } } } } });
    expect(output.length).toBeLessThan(20_000);
    expect(output).toContain('[TRUNCATED]');
  });
});
