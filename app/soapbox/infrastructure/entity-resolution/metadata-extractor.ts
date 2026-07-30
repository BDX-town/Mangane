/**
 * Phase 8B-3 — Structured linked-page metadata extraction.
 *
 * Normalizes creator/author metadata from multiple structured data formats:
 * - fediverse:creator meta tag
 * - Schema.org JSON-LD (author/creator/publisher)
 * - rel=author links
 * - Open Graph article:author
 * - oEmbed author_name / author_url
 * - Dublin Core creator
 * - Conventional meta[name=author]
 *
 * This module does NOT:
 * - Fetch arbitrary HTML (that requires a trusted resolver)
 * - Execute JavaScript
 * - Follow redirects beyond the initial URL
 * - Store raw HTML
 * - Send private data to external services
 *
 * It DOES:
 * - Accept pre-fetched metadata (from server preview cards or CORS fetch)
 * - Parse structured data formats into normalized AuthorMetadata
 * - Assign proof tiers based on data quality
 * - Create entity bindings through the entity repository
 *
 * Security:
 * - All URLs validated (http(s) only, no credentials)
 * - String inputs bounded to prevent abuse
 * - No script execution or HTML rendering
 * - fediverse:creator handles validated for format
 */

import {
  createEntity,
  findEntityByProvider,
  addProviderReference,
  storeCreatorAttribution,
  storeEvidence,
} from './entity-repository';

import type {
  CanonicalEntityId,
  CreatorAttributionProof,
  EntityProvider,
  LinkCreatorAttribution,
} from 'soapbox/domain/entity-resolution';

// ─── Input types ─────────────────────────────────────────────────────────────

/**
 * Pre-processed metadata from a linked page.
 * This is the input to the extraction pipeline — NOT raw HTML.
 * Typically sourced from:
 * - Server-provided preview card enrichment
 * - Direct CORS-permitted JSON-LD fetch
 * - oEmbed endpoint response
 */
export interface PageMetadata {
  /** The canonical URL of the page. */
  readonly canonicalUrl: string;
  /** fediverse:creator value (e.g., "@user@instance.social") */
  readonly fediverseCreator?: string | null;
  /** Schema.org JSON-LD author data */
  readonly schemaOrgAuthors?: ReadonlyArray<SchemaOrgPerson>;
  /** rel=author URL */
  readonly relAuthorUrl?: string | null;
  /** Open Graph article:author */
  readonly ogAuthor?: string | null;
  /** oEmbed author_name */
  readonly oembedAuthorName?: string | null;
  /** oEmbed author_url */
  readonly oembedAuthorUrl?: string | null;
  /** Dublin Core creator */
  readonly dcCreator?: string | null;
  /** meta[name=author] content */
  readonly metaAuthor?: string | null;
  /** Publication domain for authorization checking */
  readonly publicationDomain?: string | null;
}

export interface SchemaOrgPerson {
  readonly name?: string;
  readonly url?: string;
  readonly sameAs?: ReadonlyArray<string>;
  readonly type?: string; // "Person" or "Organization"
}

// ─── Output types ────────────────────────────────────────────────────────────

export interface ExtractedAuthor {
  readonly name: string;
  readonly url?: string;
  readonly fediverseHandle?: string;
  readonly proof: CreatorAttributionProof;
  readonly provider: EntityProvider;
  readonly confidence: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_NAME_LENGTH = 500;
const MAX_URL_LENGTH = 2048;
const ATTRIBUTION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// Fediverse handle format: @user@domain or user@domain
const FEDIVERSE_HANDLE_REGEX = /^@?([a-zA-Z0-9_]+)@([a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Extract creator attributions from structured page metadata.
 * Returns extracted authors in priority order.
 *
 * Priority (highest to lowest):
 * 1. fediverse:creator (if valid handle format)
 * 2. Schema.org JSON-LD author with social profile
 * 3. Schema.org JSON-LD author
 * 4. rel=author
 * 5. Open Graph article:author
 * 6. oEmbed author
 * 7. Dublin Core creator
 * 8. meta[name=author]
 */
export function extractAuthors(metadata: PageMetadata): ReadonlyArray<ExtractedAuthor> {
  const authors: ExtractedAuthor[] = [];
  const seenNames = new Set<string>();

  // 1. fediverse:creator (highest structured confidence)
  if (metadata.fediverseCreator) {
    const author = extractFediverseCreator(metadata.fediverseCreator);
    if (author && !seenNames.has(normalizeDedup(author.name))) {
      seenNames.add(normalizeDedup(author.name));
      authors.push(author);
    }
  }

  // 2. Schema.org JSON-LD authors
  if (metadata.schemaOrgAuthors) {
    for (const schema of metadata.schemaOrgAuthors) {
      const author = extractSchemaOrgAuthor(schema);
      if (author && !seenNames.has(normalizeDedup(author.name))) {
        seenNames.add(normalizeDedup(author.name));
        authors.push(author);
      }
    }
  }

  // 3. rel=author
  if (metadata.relAuthorUrl && authors.length === 0) {
    const url = validateUrl(metadata.relAuthorUrl);
    if (url) {
      authors.push({
        name: extractNameFromUrl(url),
        url,
        proof: 'metadata-author',
        provider: 'rel-author',
        confidence: 0.4,
      });
    }
  }

  // 4. Open Graph article:author
  if (metadata.ogAuthor && authors.length === 0) {
    const author = extractOgAuthor(metadata.ogAuthor);
    if (author) authors.push(author);
  }

  // 5. oEmbed
  if ((metadata.oembedAuthorName || metadata.oembedAuthorUrl) && authors.length === 0) {
    const author = extractOembedAuthor(metadata.oembedAuthorName, metadata.oembedAuthorUrl);
    if (author) authors.push(author);
  }

  // 6. Dublin Core
  if (metadata.dcCreator && authors.length === 0) {
    const name = boundString(metadata.dcCreator);
    if (name) {
      authors.push({
        name,
        proof: 'metadata-author',
        provider: 'dublin-core',
        confidence: 0.3,
      });
    }
  }

  // 7. meta[name=author]
  if (metadata.metaAuthor && authors.length === 0) {
    const name = boundString(metadata.metaAuthor);
    if (name) {
      authors.push({
        name,
        proof: 'metadata-author',
        provider: 'schema-org',
        confidence: 0.25,
      });
    }
  }

  return authors;
}

/**
 * Process extracted authors into creator attributions and entity records.
 * Bridges between metadata extraction and the entity store.
 */
export function processExtractedAuthors(
  accountScope: string,
  canonicalResourceUrl: string,
  authors: ReadonlyArray<ExtractedAuthor>,
): string[] {
  if (!accountScope || !canonicalResourceUrl || authors.length === 0) return [];

  const validUrl = validateUrl(canonicalResourceUrl);
  if (!validUrl) return [];

  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + ATTRIBUTION_TTL_MS).toISOString();
  const keys: string[] = [];

  for (let i = 0; i < authors.length; i++) {
    const author = authors[i];
    const entityId = resolveAuthorEntity(author);

    const evidenceId = `ev-meta-${Date.now()}-${i}`;
    storeEvidence({
      evidenceId,
      kind: author.url ? 'url-match' : 'label-match',
      provider: author.provider,
      description: `Metadata extraction: ${author.name} via ${author.provider}`,
      observedAt: now,
      weight: author.confidence,
    });

    const attributionKey = `attr-meta-${accountScope.slice(-16)}-${validUrl.slice(-24)}-${i}`;

    const attribution: LinkCreatorAttribution = {
      schemaVersion: 2,
      attributionKey,
      accountScope,
      canonicalResourceUrl: validUrl,
      creatorEntityId: entityId,
      creatorRole: 'author',
      ordinal: i,
      proof: author.proof,
      canonicalAccountUri: author.url,
      evidenceIds: [evidenceId],
      observedAt: now,
      expiresAt,
    };

    storeCreatorAttribution(attribution);
    keys.push(attributionKey);
  }

  return keys;
}

// ─── Extractors ──────────────────────────────────────────────────────────────

function extractFediverseCreator(value: string): ExtractedAuthor | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const match = FEDIVERSE_HANDLE_REGEX.exec(trimmed);
  if (!match) return null;

  const [, username, domain] = match;
  // Validate domain doesn't contain dangerous characters
  if (domain.includes('..') || domain.startsWith('-') || domain.endsWith('-')) return null;

  return {
    name: `@${username}@${domain}`,
    url: `https://${domain}/@${username}`,
    fediverseHandle: `@${username}@${domain}`,
    proof: 'structured-author-with-social-profile',
    provider: 'fediverse-creator',
    confidence: 0.8,
  };
}

function extractSchemaOrgAuthor(schema: SchemaOrgPerson): ExtractedAuthor | null {
  const name = boundString(schema.name);
  if (!name) return null;

  let url: string | undefined;
  let hasSocialProfile = false;

  if (schema.url) {
    url = validateUrl(schema.url);
  }

  // Check sameAs for social profiles
  if (schema.sameAs) {
    for (const sameAsUrl of schema.sameAs) {
      const valid = validateUrl(sameAsUrl);
      if (valid && isSocialProfileUrl(valid)) {
        url = valid;
        hasSocialProfile = true;
        break;
      }
    }
  }

  const proof: CreatorAttributionProof = hasSocialProfile
    ? 'structured-author-with-social-profile'
    : 'structured-author';

  return {
    name,
    url,
    proof,
    provider: 'schema-org',
    confidence: hasSocialProfile ? 0.7 : 0.5,
  };
}

function extractOgAuthor(value: string): ExtractedAuthor | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  // OG author can be a URL or a name
  const url = validateUrl(trimmed);
  if (url) {
    return {
      name: extractNameFromUrl(url),
      url,
      proof: 'metadata-author',
      provider: 'open-graph',
      confidence: 0.4,
    };
  }

  const name = boundString(trimmed);
  if (name) {
    return {
      name,
      proof: 'metadata-author',
      provider: 'open-graph',
      confidence: 0.35,
    };
  }

  return null;
}

function extractOembedAuthor(
  name: string | null | undefined,
  url: string | null | undefined,
): ExtractedAuthor | null {
  const boundedName = boundString(name);
  const validUrl = url ? validateUrl(url) : undefined;

  if (!boundedName && !validUrl) return null;

  return {
    name: boundedName || extractNameFromUrl(validUrl!),
    url: validUrl,
    proof: 'metadata-author',
    provider: 'oembed',
    confidence: 0.4,
  };
}

// ─── Entity resolution ───────────────────────────────────────────────────────

function resolveAuthorEntity(author: ExtractedAuthor): CanonicalEntityId {
  // Try to find by URL (provider reference)
  if (author.url) {
    const existing = findEntityByProvider('activitypub', author.url)
      || findEntityByProvider('rel-author', author.url);
    if (existing) return existing.entityId;
  }

  // Create new entity
  const entityId = createEntity({
    kind: 'person',
    preferredLabel: author.name,
    homepageUrl: author.url,
  });

  // Add provider reference if URL available
  if (author.url) {
    addProviderReference(entityId, {
      provider: author.provider,
      providerId: author.url,
      canonicalUri: author.url,
      observedAt: new Date().toISOString(),
      evidenceIds: [],
    });
  }

  return entityId;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function validateUrl(url: string): string | undefined {
  if (!url || url.length > MAX_URL_LENGTH) return undefined;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return undefined;
    if (parsed.username || parsed.password) return undefined;
    return parsed.href;
  } catch {
    return undefined;
  }
}

function boundString(value: string | null | undefined): string {
  if (!value) return '';
  return value.trim().slice(0, MAX_NAME_LENGTH);
}

function normalizeDedup(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, ' ');
}

function extractNameFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Try to get a readable name from the path
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart && lastPart.length > 1 && lastPart.length < 100) {
      return decodeURIComponent(lastPart).replace(/[_-]/g, ' ');
    }
    return parsed.hostname;
  } catch {
    return 'Unknown';
  }
}

function isSocialProfileUrl(url: string): boolean {
  const socialDomains = [
    'mastodon.social', 'twitter.com', 'x.com', 'github.com',
    'linkedin.com', 'threads.net', 'bsky.app',
  ];
  try {
    const hostname = new URL(url).hostname;
    return socialDomains.some(d => hostname === d || hostname.endsWith(`.${d}`))
      || url.includes('/users/') || url.includes('/@');
  } catch {
    return false;
  }
}
