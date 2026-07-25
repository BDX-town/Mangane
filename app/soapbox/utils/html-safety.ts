import DOMPurify from 'dompurify';

import { sanitizeUrl } from './url-policy';

export type HtmlSafetyPolicy = 'rich-text' | 'inline-text';

const FORBIDDEN_TAGS = [
  'base',
  'embed',
  'form',
  'iframe',
  'link',
  'math',
  'meta',
  'object',
  'script',
  'style',
  'svg',
  'template',
];

const FORBIDDEN_ATTRIBUTES = [
  'form',
  'formaction',
  'http-equiv',
  'ping',
  'srcdoc',
  'srcset',
  'style',
  'xlink:href',
  'xmlns',
];

let hooksInstalled = false;

const installHooks = (): void => {
  if (hooksInstalled) return;
  hooksInstalled = true;

  DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
    const name = data.attrName.toLowerCase();

    if (name === 'href' || name === 'src') {
      const purpose = name === 'src' ? 'media' : 'navigation';
      const safeValue = sanitizeUrl(data.attrValue, purpose);

      if (safeValue) {
        data.attrValue = safeValue;
      } else {
        data.keepAttr = false;
      }
    }
  });

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node instanceof HTMLAnchorElement) {
      node.setAttribute('rel', 'nofollow noopener noreferrer ugc');
      node.setAttribute('target', '_blank');
    }
  });
};

/**
 * Sanitize untrusted or administrator-authored HTML at the application
 * boundary. Transformation helpers such as emojify and
 * stripCompatibilityFeatures are deliberately not security boundaries.
 */
export const sanitizeHtml = (
  value: unknown,
  policy: HtmlSafetyPolicy = 'rich-text',
): string => {
  if (typeof value !== 'string' || value.length === 0) return '';

  installHooks();

  return DOMPurify.sanitize(value, {
    FORBID_TAGS: FORBIDDEN_TAGS,
    FORBID_ATTR: FORBIDDEN_ATTRIBUTES,
    ALLOW_ARIA_ATTR: true,
    ALLOW_DATA_ATTR: policy === 'rich-text',
    ...(policy === 'inline-text'
      ? { ALLOWED_TAGS: ['a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'code', 'del', 'em', 'i', 'img', 'mark', 's', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u'] }
      : { USE_PROFILES: { html: true } }),
  });
};

export const safeHtml = (
  value: unknown,
  policy: HtmlSafetyPolicy = 'rich-text',
): { __html: string } => ({
  __html: sanitizeHtml(value, policy),
});
