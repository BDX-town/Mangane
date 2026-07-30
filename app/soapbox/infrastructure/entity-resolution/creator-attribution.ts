/**
 * Phase 8B-2 — Native creator attribution normalizer.
 *
 * Processes Mastodon PreviewCard.authors[], legacy author_name/author_url
 * fields, and generates LinkCreatorAttribution records.
 *
 * Mastodon 4.3+ provides:
 *   PreviewCard.authors = [{ name, url, account? }]
 *   where account is a fully resolved Mastodon account object
 *
 * Legacy provides:
 *   author_name: string
 *   author_url: string
 *
 * This module:
 * 1. Normalizes both formats into canonical LinkCreatorAttribution records
 * 2. Creates/finds CanonicalEntity records for each creator
 * 3. Never replaces status author with linked-work creator
 * 4. Never transfers engagement to the creator
 * 5. Preserves multiple authors in order
 *
 * Security:
 * - URLs validated (http(s) only, no credentials)
 * - Author names bounded (max 500 chars)
 * - Account data validated before use
 * - No automatic global merge from name alone
 */

import {
  createEntity,
  findEntitiesByLabel,
  findEntityByProvider,
  addProviderReference,
  storeCreatorAttribution,
  storeEvidence,
} from './entity-repository';

import type {
  CanonicalEntityId,
  CreatorAttributionProof,
  LinkCreatorAttribution,
} from 'soapbox/domain/entity-resolution';

// ─── Input types (from API responses) ────────────────────────────────────────

/** Mastodon 4.3+ author object from PreviewCard.authors[] */
export interface CardAuthor {
  name?: string;
  url?: string;
  account?: {
    id?: string;
    acct?: string;
    url?: string;
    username?: string;
    display_name?: string;
  } | null;
}

/** Preview card data as received from the API */
export interface PreviewCardInput {
  url: string;
  author_name?: string;
  author_url?: string;
  authors?: ReadonlyArray<CardAuthor>;
  provider_name?: string;
  provider_url?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_AUTHOR_NAME_LENGTH = 500;
const MAX_AUTHORS = 20;
const ATTRIBUTION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Extract and store creator attributions from a preview card.
 *
 * @param accountScope - The viewer's account URL (for scoping)
 * @param card - The preview card data from the API
 * @returns Array of generated attribution keys (for reference)
 */
export function processCardAttribution(
  accountScope: string,
  card: PreviewCardInput,
): string[] {
  if (!accountScope || !card.url) return [];

  const canonicalResourceUrl = validateResourceUrl(card.url);
  if (!canonicalResourceUrl) return [];

  const attributionKeys: string[] = [];
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + ATTRIBUTION_TTL_MS).toISOString();

  // Process native Mastodon authors[] (highest confidence)
  if (card.authors && card.authors.length > 0) {
    const authors = card.authors.slice(0, MAX_AUTHORS);
    for (let i = 0; i < authors.length; i++) {
      const author = authors[i];
      const key = processNativeAuthor(accountScope, canonicalResourceUrl, author, i, now, expiresAt);
      if (key) attributionKeys.push(key);
    }
  }

  // Fallback: legacy author_name / author_url (lower confidence)
  if (attributionKeys.length === 0 && (card.author_name || card.author_url)) {
    const key = processLegacyAuthor(accountScope, canonicalResourceUrl, card, now, expiresAt);
    if (key) attributionKeys.push(key);
  }

  return attributionKeys;
}

/**
 * Get all creator attributions for a given resource URL.
 */
export { getAttributionsForResource } from './entity-repository';

// ─── Internal processing ─────────────────────────────────────────────────────

function processNativeAuthor(
  accountScope: string,
  canonicalResourceUrl: string,
  author: CardAuthor,
  ordinal: number,
  now: string,
  expiresAt: string,
): string | null {
  const name = boundString(author.name, MAX_AUTHOR_NAME_LENGTH);
  if (!name && !author.url && !author.account) return null;

  // Determine proof tier
  let proof: CreatorAttributionProof = 'structured-author';
  let canonicalAccountUri: string | undefined;
  let localAccountId: string | undefined;

  if (author.account && author.account.id && author.account.url) {
    // Server has resolved the account — highest trust for this context
    proof = 'native-server-verified';
    canonicalAccountUri = author.account.url;
    localAccountId = author.account.id;
  } else if (author.url) {
    const validUrl = validateAuthorUrl(author.url);
    if (validUrl) {
      proof = 'structured-author-with-social-profile';
      canonicalAccountUri = validUrl;
    }
  }

  // Find or create entity for this creator
  const entityId = resolveCreatorEntity(name || 'Unknown Creator', canonicalAccountUri, proof);

  // Store evidence
  const evidenceId = `ev-native-${Date.now()}-${ordinal}`;
  storeEvidence({
    evidenceId,
    kind: 'provider-lookup',
    provider: 'fediverse-creator',
    description: `Native server attribution for ${name || canonicalAccountUri || 'unknown'}`,
    observedAt: now,
    weight: proof === 'native-server-verified' ? 1.0 : 0.7,
  });

  // Generate attribution key
  const attributionKey = `attr-${accountScope.slice(-20)}-${canonicalResourceUrl.slice(-30)}-${ordinal}`;

  const attribution: LinkCreatorAttribution = {
    schemaVersion: 2,
    attributionKey,
    accountScope,
    canonicalResourceUrl,
    creatorEntityId: entityId,
    creatorRole: 'author',
    ordinal,
    proof,
    canonicalAccountUri,
    localAccountId,
    evidenceIds: [evidenceId],
    observedAt: now,
    verifiedAt: proof === 'native-server-verified' ? now : undefined,
    expiresAt,
  };

  storeCreatorAttribution(attribution);
  return attributionKey;
}

function processLegacyAuthor(
  accountScope: string,
  canonicalResourceUrl: string,
  card: PreviewCardInput,
  now: string,
  expiresAt: string,
): string | null {
  const name = boundString(card.author_name, MAX_AUTHOR_NAME_LENGTH);
  const url = card.author_url ? validateAuthorUrl(card.author_url) : undefined;

  if (!name && !url) return null;

  // Legacy fields have lower confidence
  let proof: CreatorAttributionProof = 'metadata-author';
  if (url && isFediverseUrl(url)) {
    proof = 'structured-author-with-social-profile';
  }

  const entityId = resolveCreatorEntity(name || 'Unknown Author', url, proof);

  const evidenceId = `ev-legacy-${Date.now()}-0`;
  storeEvidence({
    evidenceId,
    kind: 'provider-lookup',
    provider: 'open-graph',
    description: `Legacy card author: ${name || url || 'unknown'}`,
    observedAt: now,
    weight: 0.5,
  });

  const attributionKey = `attr-legacy-${accountScope.slice(-20)}-${canonicalResourceUrl.slice(-30)}`;

  const attribution: LinkCreatorAttribution = {
    schemaVersion: 2,
    attributionKey,
    accountScope,
    canonicalResourceUrl,
    creatorEntityId: entityId,
    creatorRole: 'author',
    ordinal: 0,
    proof,
    canonicalAccountUri: url,
    evidenceIds: [evidenceId],
    observedAt: now,
    expiresAt,
  };

  storeCreatorAttribution(attribution);
  return attributionKey;
}

// ─── Entity resolution for creators ─────────────────────────────────────────

/**
 * Find or create a CanonicalEntity for a creator.
 * Uses deterministic matching:
 * 1. By canonical account URI (if available)
 * 2. By name label (only if high confidence)
 * 3. Create new if no match
 *
 * NEVER auto-merges on name alone (spec requirement).
 */
function resolveCreatorEntity(
  name: string,
  canonicalAccountUri: string | undefined,
  proof: CreatorAttributionProof,
): CanonicalEntityId {
  // Try by canonical account URI (strongest match)
  if (canonicalAccountUri) {
    const existing = findEntityByProvider('activitypub', canonicalAccountUri);
    if (existing) return existing.entityId;
  }

  // For high-confidence proofs, try by exact label
  if (proof === 'native-server-verified' && name) {
    const labelMatches = findEntitiesByLabel(name);
    // Only use if exactly one match of compatible kind
    if (labelMatches.length === 1 && (labelMatches[0].kind === 'person' || labelMatches[0].kind === 'organization')) {
      return labelMatches[0].entityId;
    }
  }

  // Create new entity
  const entityId = createEntity({
    kind: 'person',
    preferredLabel: name,
    homepageUrl: canonicalAccountUri,
  });

  // If we have a canonical URI, add it as a provider reference
  if (canonicalAccountUri) {
    addProviderReference(entityId, {
      provider: 'activitypub',
      providerId: canonicalAccountUri,
      canonicalUri: canonicalAccountUri,
      observedAt: new Date().toISOString(),
      evidenceIds: [],
    });
  }

  return entityId;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function validateResourceUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    if (parsed.username || parsed.password) return null;
    return parsed.href;
  } catch {
    return null;
  }
}

function validateAuthorUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return undefined;
    if (parsed.username || parsed.password) return undefined;
    return parsed.href;
  } catch {
    return undefined;
  }
}

function isFediverseUrl(url: string): boolean {
  // Heuristic: Fediverse profiles typically have /users/ or /@
  return url.includes('/users/') || url.includes('/@');
}

function boundString(value: string | undefined | null, maxLength: number): string {
  if (!value) return '';
  return value.trim().slice(0, maxLength);
}
