# Phase 8B — Entity Resolution & Creator Attribution

Status: **Accepted target / queued**

Date: 2026-07-29

## Purpose

Establish one reusable, local-first canonical entity-resolution subsystem for Mangane and use it first for accurate creator attribution in link previews. The same subsystem must support semantic hashtags, topics, Custom Feeds, Search, Explore, Gist evidence, recommendations, composer context, duplicate detection, related-content grouping, and future protocol integrations without creating parallel identity graphs.

This phase supersedes the narrower Phase 8B Creator Attribution plan. The phase number remains **8B** because creator attribution enters through the Phase 8 link-preview and post-card layer, while the underlying entity authority is intentionally application-wide. It does not collide with Phase 8A Origin Authority Reconciliation, Phase 23A Custom Feeds, Phase 23B Subscribed Post Stories, or Phase 9.

## Product truth

Entity resolution answers:

> Which real-world or protocol entity does this mention, hashtag, account, article author, organization, place, event, work, or topic most likely refer to, and what evidence supports that match?

Creator attribution answers:

> Who created the external article, video, podcast, image, or other linked work?

A creator is a role or relationship between a work and an entity, not a separate universal identity type.

Mangane must keep these concepts distinct:

```text
Status author
  → Fediverse account that published the status

Linked work
  → article, video, podcast, image, document, or other external resource

Creator entity
  → person or organization credited with creating the linked work

Publication/provider entity
  → organization or service that published or hosts the work

Verified Fediverse creator
  → creator entity whose Fediverse account and publication-domain authorization satisfy accepted proof
```

Mangane must never replace the status author with the linked-work creator, transfer engagement to the creator, imply endorsement of the sharing post, or treat an external knowledge graph as ownership authority.

## Scope

### Included

- canonical entity records and typed relationships;
- mention, hashtag, metadata, account, URL, and structured-data candidate extraction;
- provider-neutral resolver contracts;
- local-first candidate generation, contextual disambiguation, confidence, evidence, and provenance;
- Wikidata and DBpedia matching and enrichment;
- native Mastodon `PreviewCard.authors[]`, legacy author fields, `missing_attribution`, and attribution-domain settings;
- cross-platform article metadata extraction for platforms without native creator attribution;
- semantic hashtag and topic resolution;
- entity-aware Custom Feed inclusion and exclusion;
- Search, Explore, Gist, recommendation, composer, and related-content consumers;
- aliases, multilingual labels, redirects, account moves, merges, splits, tombstones, refresh, and rollback;
- bounded caching, offline continuity, privacy, security, explainability, and evaluation.

### Excluded

- claiming Wikidata or DBpedia is globally authoritative or complete;
- silently auto-merging ambiguous people or organizations;
- inferring ownership from a display name alone;
- treating `sameAs`, `rel=me`, or a social URL as equivalent to Mastodon publication authorization;
- uploading private drafts, reading history, private feeds, or inaccessible content to public knowledge bases;
- unrestricted article crawling or a generic URL proxy;
- background resolution of every observed link or hashtag;
- using entity matches to bypass visibility, moderation, block, mute, filter, or server policy;
- representing model confidence as objective truth;
- allowing a creator or entity badge to obscure the status author or publication.

## Canonical terminology and collision prevention

Use qualified domain names:

```ts
CanonicalEntity
CanonicalEntityId
EntityAlias
EntityRelationship
EntityMention
EntityCandidate
EntityResolution
EntityEvidence
EntityProviderReference
EntityResolver
EntityResolutionService
EntityResolutionRepository
LinkCreatorAttribution
CreatorAttributionProof
HashtagEntityBinding
EntityFeedRule
```

Avoid application-wide bare types such as `Entity`, `Author`, `Creator`, `Topic`, `Match`, or `Resolution`. Those names are overloaded. UI labels may use natural language, but storage, adapters, repositories, commands, and events must use the qualified names above.

## Canonical entity model

```ts
type CanonicalEntityKind =
  | 'person'
  | 'organization'
  | 'publication'
  | 'place'
  | 'event'
  | 'work'
  | 'product'
  | 'brand'
  | 'topic'
  | 'community'
  | 'sports-team'
  | 'music-artist'
  | 'protocol-account'
  | 'collection'
  | 'other';

type EntityProvider =
  | 'local'
  | 'wikidata'
  | 'dbpedia'
  | 'activitypub'
  | 'webfinger'
  | 'schema-org'
  | 'fediverse-creator'
  | 'open-graph'
  | 'oembed'
  | 'microformats'
  | 'dublin-core'
  | 'rel-author'
  | 'rel-me'
  | 'visible-byline'
  | 'future-provider';

interface CanonicalEntity {
  schemaVersion: 1;
  entityId: CanonicalEntityId;
  kind: CanonicalEntityKind;
  preferredLabel: string;
  normalizedLabels: string[];
  description?: string;
  language?: string;
  imageUrl?: string;
  homepageUrl?: string;
  providerReferences: EntityProviderReference[];
  aliases: EntityAlias[];
  state: 'active' | 'merged' | 'split-required' | 'unavailable' | 'tombstoned';
  mergedIntoEntityId?: CanonicalEntityId;
  createdAt: string;
  updatedAt: string;
  sourceRevision: string;
}

interface EntityProviderReference {
  provider: EntityProvider;
  providerId: string;
  canonicalUri?: string;
  observedAt: string;
  verifiedAt?: string;
  expiresAt?: string;
  evidenceIds: string[];
}

interface EntityRelationship {
  schemaVersion: 1;
  relationshipId: string;
  subjectEntityId: CanonicalEntityId;
  predicate:
    | 'created-by'
    | 'published-by'
    | 'same-as'
    | 'member-of'
    | 'part-of'
    | 'located-in'
    | 'about'
    | 'related-to'
    | 'instance-of'
    | 'subclass-of'
    | 'official-account'
    | 'hashtag-refers-to';
  objectEntityId: CanonicalEntityId;
  confidence: number;
  evidenceIds: string[];
  validFrom?: string;
  validUntil?: string;
}
```

External provider identifiers are references on Mangane's canonical entity; they are not Mangane's primary database key. This permits provider disagreement, provider outage, local-only entities, future provider replacement, and transactional merge or split correction.

## Evidence and resolution model

Every resolver returns candidates, never an unconditional global match:

```ts
interface EntityCandidate {
  candidateKey: string;
  kind: CanonicalEntityKind;
  label: string;
  canonicalUri?: string;
  providerReferences: EntityProviderReference[];
  evidenceIds: string[];
  features: Record<string, number | string | boolean>;
}

interface EntityResolution {
  schemaVersion: 1;
  resolutionKey: string;
  accountScope: string;
  mentionKey: string;
  selectedEntityId?: CanonicalEntityId;
  candidateEntityIds: CanonicalEntityId[];
  confidence: number;
  margin: number;
  state: 'resolved' | 'ambiguous' | 'unresolved' | 'rejected' | 'stale';
  policyVersion: string;
  evidenceIds: string[];
  observedAt: string;
  expiresAt: string;
}
```

Resolution may consider exact identifiers, provider IDs, redirects, labels, aliases, transliterations, language, article or conversation context, nearby resolved entities, account biography and verified links, temporal context, entity-kind compatibility, selected feed/query intent, and negative evidence.

The score is a versioned policy output, not a probability claim unless separately calibrated. Automatic binding requires both a minimum score and a sufficient margin over the next candidate. Ambiguous results remain unresolved or request clarification in authoring/configuration surfaces.

## Provider architecture

```ts
interface EntityResolver {
  readonly id: string;
  readonly version: string;
  supports(input: EntityResolutionInput): boolean;
  resolve(
    input: EntityResolutionInput,
    context: EntityResolutionContext,
    signal: AbortSignal,
  ): Promise<EntityResolverResult>;
}
```

Resolvers are independent evidence producers. A merger combines candidates using deterministic identity keys and evidence rules. Presentation components never call Wikidata, DBpedia, WebFinger, or page resolvers directly.

Initial resolver families:

1. deterministic local identifiers and canonical account URIs;
2. existing local entity cache and aliases;
3. native server preview-card creator accounts;
4. ActivityPub/WebFinger account resolution;
5. structured linked-page metadata;
6. Wikidata search/entity lookup;
7. DBpedia lookup/SPARQL or approved endpoint access;
8. optional future domain providers such as MusicBrainz, ORCID, Crossref, DOI, OpenAlex, VIAF, GeoNames, or Library of Congress.

Adding a provider requires capability, privacy, licensing, rate-limit, cache, attribution, rollback, and test documentation. No provider may silently become the canonical entity authority.

## Wikidata and DBpedia integration

Wikidata and DBpedia provide candidate generation, stable external identifiers, aliases, multilingual labels, types, descriptions, official websites, selected relationships, redirects, and cross-provider links. They improve disambiguation and enrichment but do not prove social-account ownership, article authorship, or publication authorization.

Mangane may use exact Q identifiers or DBpedia resource URIs, identifier mappings, label and alias search constrained by language and expected kind, official-domain agreement, dates/locations/occupations/organizations/event context, `sameAs`, and redirects. A name-only match is never enough for automatic global merging of people or organizations.

Provider clients must:

- prefer bounded entity lookup over broad interactive SPARQL queries;
- coalesce requests and cap per-provider concurrency;
- implement exponential backoff with full jitter, `Retry-After`, cancellation, and circuit breakers;
- cache normalized provider responses rather than arbitrary raw pages;
- retain provider, retrieval time, endpoint/version, language, and required license/attribution metadata;
- use positive and negative TTLs;
- keep local canonical entities available offline;
- never send private post text, drafts, private feed definitions, account tokens, hidden examples, or reading history.

## Entity extraction sources

### Social and protocol records

- account names, handles, canonical actor URIs, profile URLs, verified links, biographies, and moved-account evidence;
- status text, hashtags, mentions, URLs, content warnings, alt text, quoted records, and permitted thread context;
- ActivityPub objects and extensions through verified adapters;
- server-provided preview-card and search metadata.

### Linked-resource metadata

For platforms without native Mastodon creator attribution, Mangane's metadata extraction pipeline must inspect recognized author and identity metadata, subject to the safe-fetch boundary:

```text
fediverse:creator
Schema.org JSON-LD author / creator / publisher
Schema.org Person or Organization url and sameAs
rel=author links
Open Graph article:author and provider fields
oEmbed author_name and author_url
microformats h-entry / p-author / h-card
Dublin Core creator fields
meta[name=author]
canonical URL and publication metadata
visible byline markup as a last-resort, low-confidence source
```

Extraction, entity matching, social-profile discovery, Fediverse account resolution, and publication authorization are separate steps. A social profile URL may identify a creator entity without proving Mastodon-style publication authorization.

Fetch order:

```text
connected-server normalized preview metadata
  → safe direct browser fetch when CORS permits
  → optional hardened trusted metadata resolver
  → ordinary preview without enrichment
```

A browser PWA cannot reliably retrieve arbitrary article HTML. Any trusted resolver must be narrowly scoped metadata infrastructure, never a generic proxy. It must implement HTTPS-only production access, DNS/IP validation before and after redirects, DNS-rebinding resistance, private/link-local/loopback/metadata-address blocking, GET/HEAD only, no caller-controlled headers, no cookies or forwarded credentials, strict compressed and expanded byte limits, streaming head parsing, no script execution, per-origin and global limits, typed output, content-free logs, and an operator kill switch. Raw HTML must not be returned to or persisted by Mangane.

## Native Mastodon creator attribution

Mastodon 4.3+ exposes creator attribution through `PreviewCard.authors[]`; each author may include a resolved `account`. Legacy `author_name` and `author_url` remain fallback inputs. Mastodon 4.6 adds `missing_attribution` for the authenticated user's own attribution-domain prompt.

Mangane must preserve multiple authors and normalize nested accounts into the existing canonical account authority. It must not create a link-preview-specific account store.

For authenticated Mastodon accounts, capability-gated profile settings may read and update `attribution_domains[]`. Updates must normalize domains, reject schemes/paths/credentials/ports/wildcards, preserve unrelated profile fields, use correct OAuth scopes, rollback optimistic state on failure, and never emulate unsupported server behavior locally.

## Creator attribution proof tiers

```ts
type CreatorAttributionProof =
  | 'native-server-verified'
  | 'domain-account-verified'
  | 'structured-author-with-social-profile'
  | 'structured-author'
  | 'metadata-author'
  | 'visible-byline'
  | 'unverified-social-claim';

interface LinkCreatorAttribution {
  schemaVersion: 2;
  attributionKey: string;
  accountScope: string;
  canonicalResourceUrl: string;
  creatorEntityId: CanonicalEntityId;
  creatorRole: 'author' | 'creator' | 'editor' | 'photographer' | 'publisher' | 'other';
  ordinal: number;
  proof: CreatorAttributionProof;
  canonicalAccountUri?: string;
  localAccountId?: string;
  publicationEntityId?: CanonicalEntityId;
  publicationDomain?: string;
  authorizedDomain?: string;
  evidenceIds: string[];
  observedAt: string;
  verifiedAt?: string;
  expiresAt: string;
}
```

A native server-resolved account is accepted as `native-server-verified` in that connected-server response context. Independently discovered `fediverse:creator` requires final-page validation, safe handle/actor resolution, publication-domain authorization, freshness, and viewer policy before `domain-account-verified` presentation.

JSON-LD `author` plus `sameAs` may support `structured-author-with-social-profile`; it does not automatically become verified creator attribution. A visible byline alone remains low confidence and must not create a global person merge.

## Deduplication, merges, and splits

Candidate deduplication priority:

```text
existing canonical entity ID
  → exact provider ID or canonical URI
  → verified same-as relationship
  → canonical protocol account URI
  → normalized official URL/domain plus compatible kind
  → resource-scoped normalized label fallback
```

Two entities must never be globally merged solely because they share a display name. Merges are transactional and reversible through alias history. A merge must repoint relationships, mentions, creator attributions, hashtag bindings, feed rules, and index projections without duplicating them. Conflicting strong identifiers place the entity into `split-required` or manual-review state. Tombstones prevent stale sync or provider refresh from resurrecting rejected aliases.

## Semantic hashtags

A hashtag remains a literal social token. Entity resolution adds a separate optional binding:

```ts
interface HashtagEntityBinding {
  schemaVersion: 1;
  bindingKey: string;
  normalizedHashtag: string;
  language?: string;
  entityId?: CanonicalEntityId;
  state: 'resolved' | 'ambiguous' | 'literal-only' | 'rejected';
  confidence: number;
  contextPolicyVersion: string;
  evidenceIds: string[];
  observedAt: string;
  expiresAt: string;
}
```

Literal hashtag behavior must survive entity failure. Context can distinguish `#Apple` as a company, fruit, record label, or another entity. Variants such as `#WWDC25` and `#WWDC2025` may bind to the same event while remaining distinct literal tags for exact search and server hashtag timelines.

Entity-aware hashtags may improve search expansion, topic pages, related tags, duplicate trend grouping, Custom Feed rules, recommendations, Explore diversity, Gist grouping, and composer ambiguity warnings. The UI must not pretend an ambiguous hashtag has one universal meaning.

## Custom Feed integration

Custom Feeds may reference literal tokens and canonical entities separately:

```ts
type EntityFeedRuleMode = 'include' | 'exclude' | 'boost' | 'require';

interface EntityFeedRule {
  schemaVersion: 1;
  ruleId: string;
  feedRevisionId: string;
  entityId: CanonicalEntityId;
  mode: EntityFeedRuleMode;
  relationDepth: 0 | 1;
  allowedRelationshipPredicates: string[];
  minimumResolutionConfidence: number;
}
```

A rule for Apple Inc. may match high-confidence entity mentions, resolved hashtags, linked resources, official accounts, and explicitly allowed first-degree relationships such as products or events. It must not become an unbounded graph crawl. Relationship depth, predicates, candidate counts, and fan-out are bounded and versioned.

Feed creators must be able to choose literal hashtag/keyword matching, canonical entity matching, exact entity only, selected related entities, ambiguity policy, and lexical-only fallback. Subscriber visibility, moderation, blocks, filters, and server policy always override selection. Private feed examples and negative rules are never sent to Wikidata, DBpedia, or another public resolver.

## Other consumers

### Search

Resolve explicit entities in queries; expand aliases, translations, redirects, and selected relationships; preserve exact handles, hashtags, URLs, and identifiers; union lexical, vector, entity, topic, and conversation candidates; and explain literal versus entity matches.

### Explore and recommendations

Group related content, reduce duplicate entity concentration, diversify across related entities, use explicit local interests, keep personal affinity separate from canonical confidence, and allow negative feedback/reset. Entity resolution must not become hidden engagement maximization.

### Gist and AI grounding

Pass canonical entity IDs, labels, aliases, kinds, provenance, and evidence to synthesis. Knowledge-graph enrichment helps disambiguate; it is not proof that an article claim is true. Gist cites source posts or linked works and preserves uncertainty and disagreement.

### Composer context and interpolator

Detect ambiguous names and hashtags, suggest missing context, identify likely duplicate discussions, and remain advisory. Private drafts stay local unless the user explicitly invokes an approved remote model.

### Topic pages and semantic navigation

A future entity page may aggregate accessible posts, articles, creators, feeds, lists, related entities, and trends through the same canonical entity ID. Every record is access-checked and the UI must not imply global completeness.

## Authority matrix

| Concern | Authority | Rule |
|---|---|---|
| Social status | canonical status store | entity projections never replace it |
| Protocol account | canonical account store and verified adapter | external graph cannot claim ownership |
| Mangane entity ID | local entity repository | provider IDs are references |
| Entity labels/types | merged evidence with provenance | disagreement retained |
| Creator credit | linked-resource/server metadata | proof tier controls presentation |
| Fediverse creator verification | native server result or verified domain-account proof | fail closed |
| Hashtag literal identity | normalized literal token | semantic binding remains separate |
| Feed selection | feed revision plus local resolution policy | moderation/access override |
| Knowledge enrichment | Wikidata/DBpedia cache | optional, stale-aware, rebuildable |
| Personal affinity | local personalization authority | never objective entity truth |

## Persistence and indexes

Suggested stores:

```text
canonicalEntities
entityAliases
entityProviderReferences
entityRelationships
entityEvidence
entityMentions
entityResolutions
hashtagEntityBindings
linkCreatorAttributions
entityFeedRules
entityIndexManifest
entityMutationJournal
```

Public provider enrichment may be shared across accounts only when its cache key excludes private context and the data is public. Mentions, resolutions, feed rules, affinities, and presentation state remain account scoped. Logout and purge remove account-scoped records deterministically without corrupting shared public enrichment.

Derived lexical/vector/entity indexes are rebuildable and bind source revision, schema version, resolver policy, provider versions, language, model/template version where applicable, and generation time.

## Scheduling, retry, and self-healing

- coalescing schedulers per provider and privacy scope;
- bounded priority queues for visible work, feed preview, and refresh;
- cancellation on route abandonment, account switch, logout, purge, or feature disable;
- exponential backoff with full jitter and `Retry-After`;
- per-provider circuit breakers and health state;
- negative caching for unresolved identifiers;
- deterministic stale refresh and corruption quarantine;
- mutation journals for merges, splits, aliases, and index updates;
- startup repair from canonical records;
- no retry for permanent validation, authorization, policy, or malformed-input failures.

## Security and privacy

Threats include entity poisoning, malicious `sameAs` graphs, forged creator tags, homographs, Unicode/IDNA confusion, cache poisoning, stale redirects, SSRF, DNS rebinding, parser bombs, account-scope IDOR, hidden-context leakage, stale merges, graph-expansion denial of service, resolver output treated as authorization, and credential/referrer leakage.

Required controls include strict runtime schemas; fail-closed destination policy; credentials omitted externally; no connected-server token forwarded to providers/publications/creator servers; normalized Unicode plus original forms; bounded redirects, DNS/IP checks, bodies, expanded bytes, parser depth, graph depth, candidates, concurrency, queues, cache, and time; object-level authorization; content-free diagnostics; moderation/access rechecks; evidence provenance for automatic merges or badges; feature flags; and independent provider kill switches.

## Accessibility and presentation

Creator bylines remain subordinate to the status author and clear about role. Multiple creators use an accessible disclosure. Verified, structured, metadata-only, and ambiguous states cannot rely on color alone. Entity chips expose meaningful labels/kinds. Screen readers distinguish “Article author” from “Shared by.” Keyboard, focus, reduced-motion, text scaling, localization, RTL, and 44×44 target requirements apply.

## Evaluation

Evaluation must cover common-name people/organizations, multilingual aliases, transliteration, redirects, same-name events, ambiguous hashtags such as `#Apple`, `#Java`, and `#Mercury`, equivalent event hashtags, native/legacy/multiple/malformed Mastodon authors, all supported article metadata forms, forged claims, Wikidata/DBpedia agreement and disagreement, outages/rate limits/staleness, merges/splits/account moves/tombstones/corruption/offline/rebuild, Custom Feed entity modes, cross-account isolation, purge, moderation, and inaccessible-content non-leakage.

Track candidate and selected-entity precision/recall, abstention quality, merge error rate, creator-attribution precision, hashtag binding precision, feed relevance, explanation correctness, cache hit rate, provider volume, latency, memory, storage, energy, rebuild time, and degraded-mode continuity.

## Implementation slices

### 8B-0 — Inventory and fixtures

Inventory card, account, search, topic, hashtag, and semantic authorities; enumerate creator fields/renderers; identify duplicate entity-like models; collect Mastodon, Akkoma, Pleroma, structured metadata, Wikidata, and DBpedia fixtures; verify provider terms, attribution, rate limits, endpoints, and browser constraints.

### 8B-1 — Canonical entity contracts and local authority

Implement schemas, repositories, cache/account boundaries, evidence, aliases, relationships, mentions, resolutions, migrations, purge, repair, and deterministic local identifiers. No external provider is required.

### 8B-2 — Native creator attribution

Normalize Mastodon `authors[]`, legacy fallback, multiple authors, nested accounts, deduplication, and shared card presentation. No arbitrary page fetch.

### 8B-3 — Structured linked-page metadata

Normalize `fediverse:creator`, JSON-LD, `rel=author`, Open Graph, oEmbed, microformats, Dublin Core, and conventional metadata. Direct CORS fetch only through destination policy. Add metadata-only entity binding and proof-tier UI.

### 8B-4 — Wikidata and DBpedia providers

Add bounded provider clients, schemas, cache, provenance, required attribution, backoff, circuit breakers, redirects, multilingual labels, aliases, types, selected relationships, deterministic candidate merge, and abstention. No private context transmission.

### 8B-5 — Semantic hashtags and topics

Add hashtag extraction, contextual resolution, literal-plus-entity binding, ambiguity, translations, event aliases, topic-page contracts, and fallback. Trend counts remain literal and provenance-preserving.

### 8B-6 — Custom Feed entity rules

Add exact entity, selected-related-entity, inclusion/exclusion/boost/require modes, creator preview, bounded graph expansion, lexical fallback, revision migration, and Phase 23A conformance tests.

### 8B-7 — Search, Explore, Gist, recommendation, and composer integration

Wire shared entity planner inputs, explanations, local personalization separation, AI grounding, ambiguity warnings, and relevance/safety/privacy/degraded-mode evaluations.

### 8B-8 — Optional trusted metadata resolver and profile settings

Require a separate deployment/security ADR before activation. Add hardened metadata-only resolution if native/direct coverage is insufficient, plus capability-gated Mastodon attribution-domain editing.

## Migration and rollback

The creator-only Phase 8B schema is superseded before runtime implementation. Any prototype rows must migrate transactionally into canonical entities plus `LinkCreatorAttribution`; duplicate creator authorities must not remain.

Feature flags:

```text
entityResolutionCore
wikidataResolver
dbpediaResolver
semanticHashtagResolution
entityAwareCustomFeeds
creatorAttributionNative
creatorMetadataExtraction
creatorAccountVerification
trustedMetadataResolver
attributionDomainSettings
```

Rollback disables consumers/providers independently while preserving canonical statuses, accounts, literal hashtags, ordinary previews, lexical Custom Feed rules, and safe local entities. Disabling a provider must not delete entities that retain other evidence. Full rollback rebuilds derived indexes and may purge optional enrichment without changing social data.

## Exit criteria

Phase 8B is complete only when:

1. one canonical entity authority is used by creator attribution, hashtags, Custom Feeds, Search, Explore, Gist, recommendations, and composer integrations;
2. no duplicate creator-specific or consumer-specific entity store remains;
3. Wikidata and DBpedia adapters are bounded, provenance-preserving, privacy-safe, rate-limit aware, independently disableable, and tested in outage/degraded modes;
4. native Mastodon attribution, legacy fallback, multiple authors, and cross-platform metadata work without confusing status authorship;
5. arbitrary publications cannot falsely obtain verified Fediverse creator presentation;
6. ambiguous names and hashtags abstain or remain literal rather than silently binding incorrectly;
7. Custom Feed entity rules are deterministic, bounded, explainable, revisioned, and fall back to literal/lexical behavior;
8. merges, splits, aliases, redirects, account moves, tombstones, corruption, offline use, relaunch, and rebuild reconcile without duplication or resurrection;
9. account isolation, purge, moderation, inaccessible-content, SSRF, DNS rebinding, Unicode/IDNA, cache-poisoning, and token-leakage tests pass;
10. accessibility, localization, performance, storage, request-volume, battery, and explanation gates pass;
11. documentation and capability matrices distinguish implemented, degraded, unsupported, experimental, and deferred behavior;
12. CI and review are clean.
