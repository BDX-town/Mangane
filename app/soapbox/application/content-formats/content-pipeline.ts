/**
 * Phase 8D — Content rendering pipeline.
 *
 * The canonical processing pipeline for all post content formats:
 *
 * server payload → classifier → parser (when authoritative) →
 * safe intermediate → canonical HTML sanitizer → accessible renderer
 *
 * NO component may bypass the sanitizer by treating parser output as trusted.
 *
 * Security:
 * - All parser output is sanitized before rendering
 * - Parser limits enforced (nesting, node count, output size)
 * - No network requests from parsers or renderers
 * - No script execution
 * - URL policy applied to all links
 * - Reduced motion enforced for any visual effects
 */

import { classifyContent } from './content-classifier';
import { DEFAULT_PARSER_LIMITS } from './content-types';

import type { StatusContentInput } from './content-classifier';
import type { ClassifiedContent, ParserLimits } from './content-types';

// ─── Pipeline output ─────────────────────────────────────────────────────────

export interface RenderableContent {
  /** The safe HTML output ready for dangerouslySetInnerHTML. */
  readonly safeHtml: string;
  /** The content format that was processed. */
  readonly processedFormat: string;
  /** Whether the source was authoritative (vs server-rendered fallback). */
  readonly fromAuthoritativeSource: boolean;
  /** Any constructs that were safely degraded. */
  readonly degradedConstructs: ReadonlyArray<string>;
  /** Whether reduced-motion mode should suppress effects. */
  readonly hasMotionEffects: boolean;
}

// ─── Pipeline execution ──────────────────────────────────────────────────────

/**
 * Process a status through the full content pipeline.
 * Returns safe, sanitized HTML ready for rendering.
 *
 * @param status - Raw API status data
 * @param sanitize - The sanitization function (injected to avoid circular deps)
 * @param limits - Parser limits (defaults to standard)
 */
export function processContent(
  status: StatusContentInput,
  sanitize: (html: string) => string,
  limits: ParserLimits = DEFAULT_PARSER_LIMITS,
): RenderableContent {
  // Step 1: Classify the content format
  const classified = classifyContent(status);

  // Step 2: Parse source text if authoritative and format is known
  let processedHtml: string;
  let degradedConstructs: string[] = [];
  let hasMotionEffects = false;

  if (classified.sourceIsAuthoritative && classified.sourceText) {
    const parseResult = parseSourceText(classified, limits);
    processedHtml = parseResult.html;
    degradedConstructs = parseResult.degraded;
    hasMotionEffects = parseResult.hasMotion;
  } else {
    // Use server-rendered HTML as-is (most common path)
    processedHtml = classified.renderedHtml;
  }

  // Step 3: Enforce output size limit
  if (processedHtml.length > limits.maxOutputLength) {
    processedHtml = processedHtml.slice(0, limits.maxOutputLength) + '…';
  }

  // Step 4: ALWAYS sanitize (even server-rendered HTML)
  const safeHtml = sanitize(processedHtml);

  return {
    safeHtml,
    processedFormat: classified.format,
    fromAuthoritativeSource: classified.sourceIsAuthoritative,
    degradedConstructs,
    hasMotionEffects,
  };
}

// ─── Format-specific parsing ─────────────────────────────────────────────────

interface ParseResult {
  html: string;
  degraded: string[];
  hasMotion: boolean;
}

function parseSourceText(
  classified: ClassifiedContent,
  limits: ParserLimits,
): ParseResult {
  const source = classified.sourceText || '';

  // Enforce input size limit
  if (source.length > limits.maxInputBytes) {
    return {
      html: escapeHtml(source.slice(0, limits.maxInputBytes)) + '…',
      degraded: ['input-truncated'],
      hasMotion: false,
    };
  }

  switch (classified.format) {
    case 'markdown':
      return parseMarkdown(source, limits);
    case 'misskey-mfm':
      return parseMfm(source, limits);
    case 'plain-text':
      return { html: escapeHtml(source), degraded: [], hasMotion: false };
    default:
      // Unknown format — use rendered HTML
      return { html: classified.renderedHtml, degraded: [], hasMotion: false };
  }
}

/**
 * Parse standard Markdown to HTML.
 * Uses a safe subset — no raw HTML passthrough.
 *
 * NOTE: This is a bounded subset parser. A full CommonMark parser
 * (e.g., markdown-it) should be integrated when the feature is enabled.
 * For now, this handles the common constructs safely.
 */
function parseMarkdown(source: string, limits: ParserLimits): ParseResult {
  let html = escapeHtml(source);
  const degraded: string[] = [];

  // Track depth to prevent nesting attacks
  let nodeCount = 0;

  // Bold: **text** or __text__
  html = html.replace(/\*\*(.+?)\*\*|__(.+?)__/g, (_, g1, g2) => {
    nodeCount++;
    if (nodeCount > limits.maxNodeCount) return g1 || g2;
    return `<strong>${g1 || g2}</strong>`;
  });

  // Italic: *text* or _text_
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)|(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, (_, g1, g2) => {
    nodeCount++;
    if (nodeCount > limits.maxNodeCount) return g1 || g2;
    return `<em>${g1 || g2}</em>`;
  });

  // Strikethrough: ~~text~~
  html = html.replace(/~~(.+?)~~/g, (_, content) => {
    nodeCount++;
    if (nodeCount > limits.maxNodeCount) return content;
    return `<del>${content}</del>`;
  });

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, (_, content) => {
    nodeCount++;
    if (nodeCount > limits.maxNodeCount) return content;
    return `<code>${content}</code>`;
  });

  // Code blocks: ```...```
  html = html.replace(/```([^`]*?)```/gs, (_, content) => {
    nodeCount++;
    if (nodeCount > limits.maxNodeCount) return content;
    return `<pre><code>${content.trim()}</code></pre>`;
  });

  // Block quotes: > text
  html = html.replace(/^&gt; (.+)$/gm, (_, content) => {
    nodeCount++;
    if (nodeCount > limits.maxNodeCount) return content;
    return `<blockquote>${content}</blockquote>`;
  });

  // Line breaks
  html = html.replace(/\n/g, '<br>');

  return { html, degraded, hasMotion: false };
}

/**
 * Parse MFM source text to HTML.
 * Supports the constructs in the support matrix.
 * Unsupported/dangerous constructs are safely degraded.
 */
function parseMfm(source: string, limits: ParserLimits): ParseResult {
  let html = escapeHtml(source);
  const degraded: string[] = [];
  let hasMotion = false;
  let nodeCount = 0;

  // MFM function syntax: $[functionName.params content]
  html = html.replace(/\$\[(\w+)(?:\.([^\s\]]*))?\s+([^\]]*)\]/g, (match, fn, params, content) => {
    nodeCount++;
    if (nodeCount > limits.maxNodeCount) return content;

    switch (fn) {
      // Supported
      case 'center':
        return `<div style="text-align:center">${content}</div>`;
      case 'small':
        return `<small>${content}</small>`;

      // Safely degraded (remove decorative, keep content)
      case 'font':
      case 'fg':
      case 'bg':
      case 'border':
      case 'blur':
      case 'rotate':
      case 'position':
      case 'scale':
      case 'flip':
        degraded.push(fn);
        return content; // Content preserved, decoration stripped

      // Intentionally unsupported (motion/animation)
      case 'spin':
      case 'shake':
      case 'jump':
      case 'bounce':
      case 'twitch':
      case 'rainbow':
      case 'sparkle':
        degraded.push(fn);
        hasMotion = true;
        return content; // Content preserved, animation stripped

      default:
        degraded.push(fn);
        return content;
    }
  });

  // Bold: **text**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic: *text* or <i>text</i>
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

  // Strikethrough: ~~text~~
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Code block: ```...```
  html = html.replace(/```([^`]*?)```/gs, (_, c) => `<pre><code>${c.trim()}</code></pre>`);

  // Quote: > text
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

  // Search: [keyword search]
  html = html.replace(/\[(.+?) search\]/g, (_, query) => {
    const safeQuery = query.slice(0, 100);
    return `<span class="mfm-search">${safeQuery}</span>`;
  });

  // Line breaks
  html = html.replace(/\n/g, '<br>');

  return { html, degraded: [...new Set(degraded)], hasMotion };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
