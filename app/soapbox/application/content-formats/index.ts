/**
 * Phase 8D — Content formats module.
 */

// Types
export type {
  PostSourceFormat,
  FormatAuthority,
  ClassifiedContent,
  ParserLimits,
  MfmSupportLevel,
  MfmConstructEntry,
  MarkdownSupportLevel,
  MarkdownProfile,
} from './content-types';
export { DEFAULT_PARSER_LIMITS, MFM_SUPPORT_MATRIX, DEFAULT_MARKDOWN_PROFILE } from './content-types';

// Classifier
export { classifyContent, canAuthorFormat } from './content-classifier';
export type { StatusContentInput, InstanceCapabilities } from './content-classifier';

// Pipeline
export { processContent } from './content-pipeline';
export type { RenderableContent } from './content-pipeline';
