/**
 * Phase 8B-8 — Trusted resolver contract and attribution domain tests.
 */

import {
  isUrlSafeForResolution,
  normalizeAttributionDomain,
  validateAttributionDomains,
} from '../trusted-resolver-contract';

describe('isUrlSafeForResolution', () => {
  it('accepts valid HTTPS URLs', () => {
    expect(isUrlSafeForResolution('https://example.com/article').safe).toBe(true);
    expect(isUrlSafeForResolution('https://blog.example.org/post/123').safe).toBe(true);
  });

  it('accepts valid HTTP URLs', () => {
    expect(isUrlSafeForResolution('http://example.com/page').safe).toBe(true);
  });

  it('rejects non-HTTP protocols', () => {
    expect(isUrlSafeForResolution('file:///etc/passwd').safe).toBe(false);
    expect(isUrlSafeForResolution('ftp://server.com/file').safe).toBe(false);
    expect(isUrlSafeForResolution('javascript:alert(1)').safe).toBe(false);
  });

  it('rejects URLs with credentials', () => {
    expect(isUrlSafeForResolution('https://user:pass@example.com').safe).toBe(false);
  });

  it('blocks AWS metadata endpoint', () => {
    expect(isUrlSafeForResolution('http://169.254.169.254/latest/meta-data/').safe).toBe(false);
  });

  it('blocks GCP metadata endpoint', () => {
    expect(isUrlSafeForResolution('http://metadata.google.internal/computeMetadata/').safe).toBe(false);
  });

  it('blocks private IP ranges', () => {
    expect(isUrlSafeForResolution('http://10.0.0.1/admin').safe).toBe(false);
    expect(isUrlSafeForResolution('http://172.16.0.1/').safe).toBe(false);
    expect(isUrlSafeForResolution('http://192.168.1.1/').safe).toBe(false);
    expect(isUrlSafeForResolution('http://127.0.0.1/').safe).toBe(false);
  });

  it('blocks localhost', () => {
    expect(isUrlSafeForResolution('http://localhost/admin').safe).toBe(false);
  });

  it('blocks link-local addresses', () => {
    expect(isUrlSafeForResolution('http://169.254.1.1/').safe).toBe(false);
  });

  it('rejects excessively long URLs', () => {
    const longUrl = 'https://example.com/' + 'x'.repeat(5000);
    expect(isUrlSafeForResolution(longUrl).safe).toBe(false);
  });

  it('rejects invalid URLs', () => {
    expect(isUrlSafeForResolution('not-a-url').safe).toBe(false);
    expect(isUrlSafeForResolution('').safe).toBe(false);
  });
});

describe('normalizeAttributionDomain', () => {
  it('normalizes valid domains', () => {
    expect(normalizeAttributionDomain('Example.Com')).toBe('example.com');
    expect(normalizeAttributionDomain('  blog.example.org  ')).toBe('blog.example.org');
  });

  it('rejects full URLs', () => {
    expect(normalizeAttributionDomain('https://example.com')).toBeNull();
    expect(normalizeAttributionDomain('http://example.com/path')).toBeNull();
  });

  it('rejects domains with paths', () => {
    expect(normalizeAttributionDomain('example.com/path')).toBeNull();
  });

  it('rejects domains with ports', () => {
    expect(normalizeAttributionDomain('example.com:8080')).toBeNull();
  });

  it('rejects domains with credentials', () => {
    expect(normalizeAttributionDomain('user@example.com')).toBeNull();
  });

  it('rejects wildcards', () => {
    expect(normalizeAttributionDomain('*.example.com')).toBeNull();
  });

  it('rejects domains with consecutive hyphens', () => {
    expect(normalizeAttributionDomain('bad--domain.com')).toBeNull();
  });

  it('rejects domains starting/ending with hyphen', () => {
    expect(normalizeAttributionDomain('-bad.com')).toBeNull();
    expect(normalizeAttributionDomain('bad-.com')).toBeNull();
  });

  it('rejects empty/null input', () => {
    expect(normalizeAttributionDomain('')).toBeNull();
    expect(normalizeAttributionDomain(null as any)).toBeNull();
  });

  it('rejects excessively long domains', () => {
    expect(normalizeAttributionDomain('a'.repeat(254) + '.com')).toBeNull();
  });

  it('rejects labels over 63 chars', () => {
    expect(normalizeAttributionDomain('a'.repeat(64) + '.com')).toBeNull();
  });
});

describe('validateAttributionDomains', () => {
  it('validates and deduplicates domains', () => {
    const result = validateAttributionDomains([
      'example.com',
      'EXAMPLE.COM', // duplicate after normalization
      'blog.example.org',
      'invalid:port',
    ]);
    expect(result).toEqual(['example.com', 'blog.example.org']);
  });

  it('caps at 50 domains', () => {
    const domains = Array.from({ length: 60 }, (_, i) => `domain${i}.com`);
    const result = validateAttributionDomains(domains);
    expect(result.length).toBeLessThanOrEqual(50);
  });

  it('returns empty for all-invalid input', () => {
    expect(validateAttributionDomains(['not valid', '*.wildcard', ''])).toEqual([]);
  });
});
