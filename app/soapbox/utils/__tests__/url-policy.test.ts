import { classifyUrl, sanitizeRedirectPath, sanitizeUrl } from '../url-policy';

describe('URL destination policy', () => {
  const baseUrl = 'https://social.example';

  it.each([
    ['https://remote.example/path', 'external-http'],
    ['http://remote.example/path', 'external-http'],
    ['https://social.example/path', 'same-origin'],
    ['/local?query=1#hash', 'same-origin-relative'],
    ['mailto:user@example.com', 'external-mail'],
    ['tel:+15551234567', 'external-telephone'],
  ] as const)('classifies %s as %s', (value, expected) => {
    expect(classifyUrl(value, 'navigation', baseUrl)).toBe(expected);
  });

  it.each([
    'javascript:alert(1)',
    'vbscript:msgbox(1)',
    'data:text/html,<script>alert(1)</script>',
    'blob:https://social.example/id',
    'java\nscript:alert(1)',
    'https://remote.example/a b',
    '',
  ])('blocks dangerous or ambiguous destination %s', value => {
    expect(sanitizeUrl(value, 'navigation', baseUrl)).toBeNull();
  });

  it('only permits same-origin relative post-auth redirects', () => {
    expect(classifyUrl('/settings?tab=profile', 'redirect', baseUrl)).toBe('same-origin-relative');
    expect(sanitizeRedirectPath('/settings?tab=profile')).toBe('/settings?tab=profile');
    expect(sanitizeRedirectPath('//evil.example/path')).toBe('/');
    expect(sanitizeRedirectPath('https://evil.example/path')).toBe('/');
    expect(sanitizeRedirectPath('javascript:alert(1)')).toBe('/');
  });

  it('bounds destination length and rejects non-strings', () => {
    expect(sanitizeUrl('https://example.com/' + 'x'.repeat(8_192), 'navigation', baseUrl)).toBeNull();
    expect(sanitizeUrl({ toString: () => 'https://example.com' }, 'navigation', baseUrl)).toBeNull();
  });
});
