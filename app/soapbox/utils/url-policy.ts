export type UrlPurpose = 'navigation' | 'media' | 'redirect';

export type UrlClassification =
  | 'blocked'
  | 'external-http'
  | 'external-mail'
  | 'external-telephone'
  | 'same-origin'
  | 'same-origin-relative';

const MAX_URL_LENGTH = 8_192;

const containsControlOrWhitespace = (value: string): boolean => {
  return /\s/.test(value) || [...value].some(character => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127;
  });
};

const getBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return 'https://localhost';
};

const hasExplicitScheme = (value: string): boolean => /^[a-z][a-z\d+.-]*:/i.test(value);

/**
 * Classify a destination before it reaches a browser navigation or resource
 * attribute. This is a destination policy, not an HTML sanitizer.
 */
export const classifyUrl = (
  value: unknown,
  purpose: UrlPurpose = 'navigation',
  baseUrl: string = getBaseUrl(),
): UrlClassification => {
  if (typeof value !== 'string' || value.length === 0 || value.length > MAX_URL_LENGTH) {
    return 'blocked';
  }

  const candidate = value.trim();
  if (candidate.length === 0 || containsControlOrWhitespace(candidate)) {
    return 'blocked';
  }

  if (purpose === 'redirect' && (candidate.startsWith('//') || hasExplicitScheme(candidate))) {
    return 'blocked';
  }

  try {
    const base = new URL(baseUrl);
    const parsed = new URL(candidate, base);

    if (purpose === 'redirect') {
      return parsed.origin === base.origin ? 'same-origin-relative' : 'blocked';
    }

    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      if (!hasExplicitScheme(candidate) && !candidate.startsWith('//')) {
        return 'same-origin-relative';
      }

      return parsed.origin === base.origin ? 'same-origin' : 'external-http';
    }

    if (purpose === 'navigation' && parsed.protocol === 'mailto:') return 'external-mail';
    if (purpose === 'navigation' && parsed.protocol === 'tel:') return 'external-telephone';

    return 'blocked';
  } catch {
    return 'blocked';
  }
};

export const sanitizeUrl = (
  value: unknown,
  purpose: UrlPurpose = 'navigation',
  baseUrl: string = getBaseUrl(),
): string | null => {
  return classifyUrl(value, purpose, baseUrl) === 'blocked' ? null : String(value).trim();
};

/** Return a local route suitable for React Router, otherwise fail closed. */
export const sanitizeRedirectPath = (value: unknown): string => {
  const safe = sanitizeUrl(value, 'redirect');
  if (!safe) return '/';

  try {
    const parsed = new URL(safe, getBaseUrl());
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return '/';
  }
};
