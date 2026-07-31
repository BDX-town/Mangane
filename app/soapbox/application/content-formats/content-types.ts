/**
 * Phase 8D — Content format classification and rendering types.
 *
 * Defines the type system for handling multiple post content formats:
 * HTML, plain text, Markdown, and Misskey Flavored Markdown (MFM).
 *
 * Key principles:
 * - Format classification is per-payload, not per-instance
 * - Server software names are advisory only (never select a parser)
 * - All parser output passes through the canonical HTML sanitizer
 * - Unsupported constructs degrade to readable inert content
 * - No network requests from renderers
 */

// ─── Source format classification ────────────────────────────────────────────

/**
 * The authoritative content format for a post's source text.
 */
export type PostSourceFormat =
  | 'html'          // Server-rendered HTML (most common)
  | 'plain-text'    // Plain text (no formatting)
  | 'markdown'      // Standard Markdown
  | 'misskey-mfm'   // Misskey Flavored Markdown
  | 'unknown';      // Cannot be determined

/**
 * How the format classification was determined.
 */
export type FormatAuthority =
  | 'explicit-content-type'  // Server provided content_type field
  | 'documented-contract'    // Known API contract for this field
  | 'inferred-from-html'     // Only HTML available (common case)
  | 'unavailable';           // No classification possible

/**
 * Classified content for a post.
 */
export interface ClassifiedContent {
  /** The format of the source text. */
  readonly format: PostSourceFormat;
  /** How the format was determined. */
  readonly authority: FormatAuthority;
  /** The raw source text (in its original format). */
  readonly sourceText: string | null;
  /** Server-rendered HTML (always available as fallback). */
  readonly renderedHtml: string;
  /** Whether the source text is the authoritative representation. */
  readonly sourceIsAuthoritative: boolean;
}

// ─── Parser limits ───────────────────────────────────────────────────────────

export interface ParserLimits {
  /** Maximum input byte length. */
  readonly maxInputBytes: number;
  /** Maximum nesting depth. */
  readonly maxNestingDepth: number;
  /** Maximum AST node count. */
  readonly maxNodeCount: number;
  /** Maximum generated output length. */
  readonly maxOutputLength: number;
  /** Maximum link count in a single post. */
  readonly maxLinks: number;
  /** Maximum custom emoji references. */
  readonly maxEmojiRefs: number;
  /** Maximum animation/effect nodes. */
  readonly maxEffectNodes: number;
}

export const DEFAULT_PARSER_LIMITS: Readonly<ParserLimits> = Object.freeze({
  maxInputBytes: 100_000,
  maxNestingDepth: 20,
  maxNodeCount: 5_000,
  maxOutputLength: 500_000,
  maxLinks: 200,
  maxEmojiRefs: 100,
  maxEffectNodes: 20,
});

// ─── MFM support matrix ─────────────────────────────────────────────────────

export type MfmSupportLevel = 'supported' | 'safely-degraded' | 'intentionally-unsupported';

/**
 * MFM construct classification.
 * Updated per tested Misskey version.
 */
export interface MfmConstructEntry {
  readonly construct: string;
  readonly level: MfmSupportLevel;
  readonly description: string;
  readonly misskeyVersion: string;
}

/**
 * Initial MFM support matrix.
 * Based on Misskey 2024.x feature set.
 */
export const MFM_SUPPORT_MATRIX: ReadonlyArray<MfmConstructEntry> = Object.freeze([
  // Supported — rendered with equivalent semantics
  { construct: 'bold', level: 'supported', description: 'Bold text (**text** or <b>)', misskeyVersion: '13+' },
  { construct: 'italic', level: 'supported', description: 'Italic text (*text* or <i>)', misskeyVersion: '13+' },
  { construct: 'strikethrough', level: 'supported', description: 'Strikethrough (~~text~~)', misskeyVersion: '13+' },
  { construct: 'inline-code', level: 'supported', description: 'Inline code (`code`)', misskeyVersion: '13+' },
  { construct: 'code-block', level: 'supported', description: 'Code block (```)', misskeyVersion: '13+' },
  { construct: 'quote', level: 'supported', description: 'Block quote (>)', misskeyVersion: '13+' },
  { construct: 'center', level: 'supported', description: 'Center alignment ($[center ...])', misskeyVersion: '13+' },
  { construct: 'small', level: 'supported', description: 'Small text ($[small ...])', misskeyVersion: '13+' },
  { construct: 'link', level: 'supported', description: 'Links [text](url)', misskeyVersion: '13+' },
  { construct: 'mention', level: 'supported', description: '@user@host mentions', misskeyVersion: '13+' },
  { construct: 'hashtag', level: 'supported', description: '#hashtag', misskeyVersion: '13+' },
  { construct: 'emoji', level: 'supported', description: 'Custom emoji :name:', misskeyVersion: '13+' },
  { construct: 'plain', level: 'supported', description: 'Plain text escape (<plain>)', misskeyVersion: '13+' },
  { construct: 'search', level: 'supported', description: 'Search block ([keyword search])', misskeyVersion: '13+' },

  // Safely degraded — content readable, decorative behavior omitted
  { construct: 'font', level: 'safely-degraded', description: 'Font changes ($[font.serif ...])', misskeyVersion: '13+' },
  { construct: 'color', level: 'safely-degraded', description: 'Foreground color ($[fg.color=... ...])', misskeyVersion: '13+' },
  { construct: 'bg-color', level: 'safely-degraded', description: 'Background color ($[bg.color=... ...])', misskeyVersion: '13+' },
  { construct: 'border', level: 'safely-degraded', description: 'Border ($[border.color=... ...])', misskeyVersion: '2024+' },
  { construct: 'blur', level: 'safely-degraded', description: 'Blur effect ($[blur ...])', misskeyVersion: '13+' },
  { construct: 'rotate', level: 'safely-degraded', description: 'Rotation ($[rotate.deg=... ...])', misskeyVersion: '13+' },
  { construct: 'position', level: 'safely-degraded', description: 'Position offset ($[position ...])', misskeyVersion: '13+' },
  { construct: 'scale', level: 'safely-degraded', description: 'Scale transform ($[scale ...])', misskeyVersion: '13+' },
  { construct: 'flip', level: 'safely-degraded', description: 'Flip ($[flip ...])', misskeyVersion: '13+' },

  // Intentionally unsupported — security/accessibility/performance risk
  { construct: 'spin', level: 'intentionally-unsupported', description: 'Continuous spin animation', misskeyVersion: '13+' },
  { construct: 'shake', level: 'intentionally-unsupported', description: 'Shake animation', misskeyVersion: '13+' },
  { construct: 'jump', level: 'intentionally-unsupported', description: 'Jump animation', misskeyVersion: '13+' },
  { construct: 'bounce', level: 'intentionally-unsupported', description: 'Bounce animation', misskeyVersion: '13+' },
  { construct: 'twitch', level: 'intentionally-unsupported', description: 'Twitch animation', misskeyVersion: '2024+' },
  { construct: 'rainbow', level: 'intentionally-unsupported', description: 'Rainbow color animation', misskeyVersion: '13+' },
  { construct: 'sparkle', level: 'intentionally-unsupported', description: 'Sparkle effect', misskeyVersion: '2024+' },
]);

// ─── Markdown support profile ────────────────────────────────────────────────

export type MarkdownSupportLevel = 'supported' | 'limited' | 'disabled';

export interface MarkdownProfile {
  readonly paragraphs: MarkdownSupportLevel;
  readonly emphasis: MarkdownSupportLevel;
  readonly strongEmphasis: MarkdownSupportLevel;
  readonly strikethrough: MarkdownSupportLevel;
  readonly orderedLists: MarkdownSupportLevel;
  readonly unorderedLists: MarkdownSupportLevel;
  readonly blockquotes: MarkdownSupportLevel;
  readonly inlineCode: MarkdownSupportLevel;
  readonly fencedCode: MarkdownSupportLevel;
  readonly links: MarkdownSupportLevel;
  readonly autolinks: MarkdownSupportLevel;
  readonly headings: MarkdownSupportLevel;
  readonly escapedDelimiters: MarkdownSupportLevel;
  readonly tables: MarkdownSupportLevel;
  readonly rawHtml: MarkdownSupportLevel;
}

export const DEFAULT_MARKDOWN_PROFILE: Readonly<MarkdownProfile> = Object.freeze({
  paragraphs: 'supported',
  emphasis: 'supported',
  strongEmphasis: 'supported',
  strikethrough: 'supported',
  orderedLists: 'supported',
  unorderedLists: 'supported',
  blockquotes: 'supported',
  inlineCode: 'supported',
  fencedCode: 'supported',
  links: 'supported',
  autolinks: 'supported',
  headings: 'limited',  // Only h1-h3 for post content
  escapedDelimiters: 'supported',
  tables: 'limited',    // Rendered but may overflow on narrow screens
  rawHtml: 'disabled',  // Always passed through sanitizer
});
