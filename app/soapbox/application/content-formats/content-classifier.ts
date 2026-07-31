/**
 * Phase 8D — Content format classifier.
 *
 * Classifies each individual payload using evidence tied to that payload.
 * NEVER classifies based on server software name alone.
 *
 * Classification order (from spec):
 * 1. Explicit source/content-type metadata on the payload field
 * 2. Documented endpoint contract for the response field
 * 3. Server-rendered HTML (most common fallback)
 * 4. Plain-text fallback
 *
 * Security:
 * - Never infers MFM by scanning text for MFM-like delimiters
 * - Server software names are advisory diagnostics only
 * - Classification failure defaults to HTML (fail safe, not open)
 */

import type { ClassifiedContent, PostSourceFormat } from './content-types';

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Classify the content format of a status from API data.
 *
 * @param status - Raw API status data
 * @returns Classified content with format, authority, and source text
 */
export function classifyContent(status: StatusContentInput): ClassifiedContent {
  // 1. Explicit content_type field (highest authority)
  if (status.content_type) {
    const format = mapContentType(status.content_type);
    if (format !== 'unknown') {
      return {
        format,
        authority: 'explicit-content-type',
        sourceText: status.text || status.source?.text || null,
        renderedHtml: status.content || '',
        sourceIsAuthoritative: !!(status.text || status.source?.text),
      };
    }
  }

  // 2. Source field with explicit format (Mastodon edit source, Misskey source)
  if (status.source?.content_type) {
    const format = mapContentType(status.source.content_type);
    if (format !== 'unknown') {
      return {
        format,
        authority: 'documented-contract',
        sourceText: status.source.text || null,
        renderedHtml: status.content || '',
        sourceIsAuthoritative: !!status.source.text,
      };
    }
  }

  // 3. Misskey-specific: text field alongside content (direct Misskey API)
  if (status.text && status.content && hasMisskeyIndicators(status)) {
    return {
      format: 'misskey-mfm',
      authority: 'documented-contract',
      sourceText: status.text,
      renderedHtml: status.content,
      sourceIsAuthoritative: true,
    };
  }

  // 4. Pleroma/Akkoma content_type in status metadata
  if (status.pleroma?.content_type) {
    const format = mapContentType(status.pleroma.content_type);
    if (format !== 'unknown') {
      return {
        format,
        authority: 'explicit-content-type',
        sourceText: status.pleroma?.source || null,
        renderedHtml: status.content || '',
        sourceIsAuthoritative: !!status.pleroma?.source,
      };
    }
  }

  // 5. Default: server-rendered HTML
  if (status.content) {
    return {
      format: 'html',
      authority: 'inferred-from-html',
      sourceText: null,
      renderedHtml: status.content,
      sourceIsAuthoritative: false,
    };
  }

  // 6. Plain text fallback
  return {
    format: 'plain-text',
    authority: 'unavailable',
    sourceText: status.text || null,
    renderedHtml: '',
    sourceIsAuthoritative: !!status.text,
  };
}

/**
 * Check if a server supports a specific content format for authoring.
 * Based on instance capabilities, NOT software name.
 */
export function canAuthorFormat(
  format: PostSourceFormat,
  instanceCapabilities: InstanceCapabilities,
): boolean {
  switch (format) {
    case 'markdown':
      return instanceCapabilities.markdownAuthoring === true;
    case 'misskey-mfm':
      return instanceCapabilities.mfmAuthoring === true;
    case 'html':
      return instanceCapabilities.htmlAuthoring === true;
    case 'plain-text':
      return true; // Always available
    default:
      return false;
  }
}

// ─── Input types ─────────────────────────────────────────────────────────────

export interface StatusContentInput {
  content?: string;
  text?: string;
  content_type?: string;
  source?: {
    text?: string;
    content_type?: string;
  };
  pleroma?: {
    content_type?: string;
    source?: string;
  };
  // Misskey-specific indicators
  visibility?: string;
  localOnly?: boolean;
  reactionAcceptance?: string;
}

export interface InstanceCapabilities {
  markdownAuthoring?: boolean;
  mfmAuthoring?: boolean;
  htmlAuthoring?: boolean;
  richText?: boolean;
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function mapContentType(contentType: string): PostSourceFormat {
  const normalized = contentType.toLowerCase().trim();
  switch (normalized) {
    case 'text/plain':
      return 'plain-text';
    case 'text/markdown':
    case 'text/x-markdown':
      return 'markdown';
    case 'text/x.misskeymarkdown':
    case 'text/x-misskeymarkdown':
    case 'text/mfm':
      return 'misskey-mfm';
    case 'text/html':
      return 'html';
    case 'text/bbcode':
      return 'html'; // BBCode is rendered to HTML by server
    default:
      return 'unknown';
  }
}

/**
 * Check for Misskey-specific payload indicators.
 * Used only when text AND content are both present (direct Misskey API).
 * NEVER scans text content for MFM-like delimiters.
 */
function hasMisskeyIndicators(status: StatusContentInput): boolean {
  // Misskey-specific fields that don't exist in Mastodon/Pleroma
  if (status.reactionAcceptance !== undefined) return true;
  if (status.localOnly !== undefined) return true;
  // Visibility values unique to Misskey
  if (status.visibility === 'specified' || status.visibility === 'home') return true;
  return false;
}
