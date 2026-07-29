# Phase 8B — Creator Attribution for Link Previews

Status: **Accepted target / queued**

Date: 2026-07-29

## Purpose

Add accurate, capability-aware creator attribution to Mangane link previews across Mastodon, Akkoma, Pleroma, and other supported backends without confusing the creator of the linked work with the author of the Fediverse status that shared it.

Mastodon calls this feature author attribution and commonly refers to the HTML marker as the `fediverse:creator` or creator tag. In Mastodon 4.3 and later, clients receive normalized attribution through the `PreviewCard.authors` array. Each `PreviewCardAuthor` may include a resolved Fediverse `account`. Older fields `author_name` and `author_url` remain compatibility inputs but are deprecated in Mastodon.

Mangane must support the native API where available and provide a safe, honest fallback for platforms that do not expose the Mastodon feature. The fallback may display conventional creator metadata broadly, but it may label a Fediverse account as verified creator attribution only when the publication-domain and account authorization relationship has been proven.

This phase is numbered **8B** because it extends the Phase 8 post-card and link-preview presentation layer. It does not collide with Phase 8A origin-authority reconciliation, Phase 23A Custom Feeds, Phase 23B Subscribed Post Stories, or the numbered Phase 9 sequence.

## Product truth

Creator attribution answers:

> Who created the external article, video, podcast episode, image, or other linked work?

It does not answer:

> Who authored the Fediverse status sharing the link?

Those identities may be the same, different, or unknown.

Mangane must keep these concepts distinct:

```text
Status author
  → the Fediverse account that published the status

Linked-work creator
  → the person or organization credited by the linked resource

Verified Fediverse creator
  → a linked-work creator whose Fediverse account and publication domain satisfy the accepted attribution proof
```

Mangane must never replace the status author with the linked-work creator, transfer engagement to the linked-work creator, or imply that the creator endorsed the sharing status.

## Research-backed Mastodon contract

### Publication marker

A publication can place this in the document head:

```html
<meta name="fediverse:creator" content="@username@social.example">
```

Mastodon resolves the handle and verifies that the linked page's domain is included in the account's allowed attribution domains. This prevents an arbitrary website from falsely attributing its content to an unrelated Fediverse account.

### REST API

Mastodon 4.3 added:

```ts
interface PreviewCardAuthor {
  name: string;
  url: string;
  account: Account | null;
}

interface PreviewCard {
  authors: PreviewCardAuthor[];
  author_name: string; // legacy/deprecated compatibility
  author_url: string;  // legacy/deprecated compatibility
}
```

Mastodon currently may provide only one author even though the API is an array. Mangane must model multiple authors from the start and must not truncate the array in domain storage.

Mastodon 4.6 added:

```ts
missing_attribution: boolean | null;
```

This indicates that the linked article claims the current user as creator while the domain is absent from that user's allowed attribution domains. It is intended to support a profile-setting prompt, not to validate arbitrary third-party authors.

For the authenticated account, Mastodon exposes allowed domains through credential/profile APIs and supports updating:

```text
PATCH /api/v1/accounts/update_credentials
attribution_domains[]=example.com
```

Mangane must capability-gate this editor and preserve unrelated profile fields when updating it.

### ActivityPub

Recent Mastodon actors may expose `attributionDomains` through the Mastodon ActivityPub extension. This can contribute to validation for non-Mastodon clients, but Mangane must not assume every platform federates, preserves, or understands the property.

## Scope

### Included

- normalize native Mastodon `PreviewCard.authors`;
- retain legacy `author_name` and `author_url` fallback;
- render creator bylines in post link cards, article cards, Search, Explore, Gist evidence cards, bookmarks, and conversation previews where the same canonical preview model is used;
- support multiple creators;
- link a verified creator to the canonical local account record when available;
- allow following, opening, or inspecting that account through existing account commands;
- preserve provider/publication attribution separately;
- support conventional non-Fediverse creator metadata on platforms without `fediverse:creator`;
- optionally resolve `fediverse:creator` for unsupported backends through a separately approved, hardened metadata resolver or direct safe browser fetch when CORS permits;
- verify domain authorization before showing a Fediverse account as verified creator attribution;
- support authenticated Mastodon attribution-domain settings when capability evidence exists;
- cache, expire, reconcile, and purge attribution safely;
- document degraded behavior, rollback, tests, security, and privacy.

### Excluded

- changing the authorship of the sharing status;
- inventing creator accounts from names alone;
- treating `rel=me` as equivalent to `fediverse:creator`;
- using an unverified `fediverse:creator` value as trusted attribution;
- running a generic open proxy from the PWA;
- sending the user's connected-server token to publication websites or creator servers;
- scraping every link in the background;
- bypassing blocks, domain policy, filters, or safe-link rules;
- claiming Mastodon-specific support on servers whose response shape merely resembles Mastodon;
- making external creator resolution a prerequisite for ordinary link previews;
- allowing a creator byline to obscure the publication/provider or the status author.

## Dependencies

Runtime implementation begins only after the relevant parts of these phases exist:

- Phase 1 protocol capability and typed adapter boundaries;
- Phase 5 canonical local records, account scoping, migration, and purge;
- Phase 7 feed-neutral presentation boundaries;
- Phase 8 post cards and canonical link-preview rendering;
- Phase 8A origin and destination safety rules where reused;
- Phase 11 Explore/Search card contracts;
- Phase 15 canonical account/entity resolution where optional enrichment is used;
- Phase 18 evidence provenance for Gist surfaces.

The native API normalization slice may begin earlier behind a feature flag if it reuses existing preview-card presentation safely and does not create a second link-preview store.

## Required current-state inventory

Before implementation, verify and document:

1. every current status/card type and preview-card TypeScript shape;
2. all call sites reading `author_name`, `author_url`, `provider_name`, or raw card fields;
3. whether Immutable.js, Redux, React Query, or canonical DB projections currently own card data;
4. server response fixtures for supported Mastodon, Akkoma, and Pleroma versions;
5. whether the existing backend capability matrix records Mastodon API version or preview-card author support;
6. existing URL, redirect, HTML, CSP, media, and destination-policy helpers;
7. every surface rendering link cards;
8. existing account lookup and canonical account-key behavior;
9. whether card payloads are persisted and how stale previews are invalidated;
10. profile-settings update behavior and OAuth scopes;
11. service-worker and browser-cache treatment of preview responses;
12. existing tests around malformed cards, HTML, URLs, and account isolation.

No implementation may assume the inherited types are complete merely because the application currently renders a preview.

## Canonical terminology and collision prevention

Use these domain names:

```ts
type LinkCreatorAttribution
interface LinkCreatorAttributionRepository
interface CreatorAttributionResolver
interface CreatorAttributionCapabilities
```

Avoid bare names such as:

```text
Author
Creator
Attribution
CardAuthor
```

unless they are scoped inside an unambiguous module. `Author` is already overloaded by status authors, article authors, media authors, and composer authorship.

The UI may say “By”, “Creator”, or “Author” depending on resource type, but storage and protocol code must use `LinkCreatorAttribution`.

## Canonical model

```ts
type LinkCreatorProof =
  | 'native-server-verified'
  | 'domain-account-verified'
  | 'metadata-only'
  | 'unverified-claim';

type LinkCreatorSource =
  | 'mastodon-preview-card-authors'
  | 'legacy-preview-card-author'
  | 'publication-metadata'
  | 'activitypub-attribution-domains'
  | 'trusted-metadata-resolver';

interface LinkCreatorAttribution {
  schemaVersion: 1;
  attributionKey: string;
  accountScope: string;
  canonicalResourceUrl: string;
  resourceOrigin: string;

  ordinal: number;
  displayName: string;
  creatorUrl?: string;

  fediverseAddress?: string;
  canonicalAccountUri?: string;
  localAccountId?: string;

  proof: LinkCreatorProof;
  sources: LinkCreatorSource[];
  publicationDomain?: string;
  authorizedDomain?: string;

  observedAt: string;
  verifiedAt?: string;
  expiresAt: string;
  sourceRevision?: string;
}
```

`canonicalResourceUrl` must use the accepted canonical-link policy. Tracking query removal or canonical-tag adoption must be deterministic and must not merge genuinely different resources.

`attributionKey` must be deterministic:

```text
version
+ account scope
+ canonical resource URL
+ creator ordinal
+ normalized creator account URI or normalized creator URL/name fallback
```

The key must not depend on a server-local status ID or preview-card response order alone.

## Authority matrix

| Field | Preferred authority | Fallback | Rule |
|---|---|---|---|
| Linked resource URL | canonical preview/link model | status card URL | destination policy applies |
| Creator name | native `authors[].name` | legacy author name or publication metadata | plain text only |
| Creator website | native `authors[].url` | legacy author URL | validated URL |
| Fediverse account | native resolved `authors[].account` | independently resolved account | never infer from display name |
| Verification | connected server's verified result | publication tag + account attribution-domain proof | fail closed |
| Publication/provider | preview provider fields | resource origin | separate from creator |
| Status author | canonical status record | none | never replaced by creator attribution |

Native Mastodon `authors[].account` is accepted as `native-server-verified` for display in that connected-server response context. If Mangane independently fetches or imports attribution from another source, it must perform its own domain-account verification before granting `domain-account-verified` status.

## Native provider adapter

```ts
interface CreatorAttributionCapabilities {
  previewCardAuthors: boolean;
  legacyPreviewAuthor: boolean;
  missingAttributionHint: boolean;
  readOwnAttributionDomains: boolean;
  updateOwnAttributionDomains: boolean;
  activityPubAttributionDomains: boolean;
  externalResolution: 'none' | 'browser-cors' | 'trusted-resolver';
}
```

Capabilities must be derived from verified response and endpoint behavior, instance/API version evidence where reliable, and schema validation. Do not use only software-name sniffing.

Normalization order:

```text
valid non-empty PreviewCard.authors
    ↓
legacy author_name / author_url
    ↓
optional external metadata resolution
    ↓
provider-only card with no creator claim
```

An empty `authors` array is not an error. A malformed `authors` entry is skipped and recorded through content-free diagnostics; it must not invalidate the entire status.

## Multiple authors

Mangane must preserve all valid authors returned by the API.

Initial UI behavior:

- show one author inline;
- show two authors when space permits;
- collapse larger sets into “First author and N others”;
- provide an accessible disclosure showing all creators;
- preserve API order;
- never silently discard authors from canonical storage;
- avoid sending separate account lookups when the nested account is already complete enough for the canonical account repository.

Future API support for more than one `fediverse:creator` must not require a schema migration.

## Cross-platform feature behavior

Mangane should offer creator attribution even when the connected platform does not implement Mastodon's feature, but the semantics must remain layered.

### Level 1 — Conventional creator metadata

If a backend supplies `author_name`/`author_url`, oEmbed author fields, or equivalent normalized preview metadata, Mangane may display:

```text
By Jane Doe
```

This is metadata-only and does not imply a verified Fediverse account.

### Level 2 — Unverified Fediverse creator claim

If Mangane directly observes:

```html
<meta name="fediverse:creator" content="@jane@example.social">
```

but cannot verify publication-domain authorization, it may retain the claim briefly for reconciliation but must not present it as verified. The default production UI should omit the account link or label it explicitly as unverified only if that distinction is useful and abuse-reviewed.

### Level 3 — Verified cross-platform creator attribution

Mangane may show the linked Fediverse account as verified when all of these are true:

1. the tag was obtained from the final accepted canonical publication page;
2. redirects and canonical URLs passed destination policy;
3. the handle resolved through safe WebFinger/account lookup;
4. the resolved actor identity matches the displayed account;
5. the publication's registrable domain matches an allowed `attributionDomains` entry on the actor or another approved equivalent proof;
6. proof is fresh and was not derived from cached data beyond its accepted TTL;
7. the account is not blocked, suspended, or otherwise prohibited for the viewer.

Failure at any step degrades to conventional metadata or no creator byline.

## External metadata resolution

A browser PWA cannot reliably fetch arbitrary article HTML because of CORS. It also must not gain an unrestricted server-side fetch primitive.

Allowed options:

### Direct browser resolution

Use only when:

- the resource explicitly allows CORS;
- destination policy accepts the URL and every redirect;
- credentials are omitted;
- response type and size are bounded;
- only the document head or a bounded byte prefix is parsed;
- timeouts, cancellation, concurrency, and per-origin budgets apply.

### Trusted metadata resolver

A future optional resolver may fetch link metadata for unsupported backends, but it must be a narrowly scoped service, not a generic proxy.

Required controls:

- HTTPS only except explicitly approved loopback development;
- public-address DNS/IP validation before and after redirects;
- DNS rebinding resistance;
- block loopback, link-local, private, multicast, metadata-service, Unix-socket, and non-HTTP destinations;
- bounded redirect count;
- validate every redirect target;
- no user-controlled request headers;
- no cookies, authentication forwarding, or ambient credentials;
- GET/HEAD only;
- strict connect, header, total, and idle timeouts;
- maximum compressed and expanded body sizes;
- content-type allowlist;
- no script execution;
- streaming head parser with early termination;
- per-account, per-origin, and global rate limits;
- cache partitioning and anti-poisoning keys;
- egress allow/deny controls;
- content-free logs;
- abuse controls and operator kill switch;
- deterministic provider exit and purge.

The resolver response must be a small typed metadata envelope. Raw HTML must not be returned to or persisted by the client.

## Metadata parsing

The parser must:

- parse HTML as inert data;
- inspect only `<head>` metadata before an accepted byte/element limit;
- use the first syntactically valid `fediverse:creator` value unless a later standard defines different ordering;
- normalize optional leading `@` without accepting malformed extra separators;
- apply Unicode and control-character checks;
- bound name, URL, handle, and author count lengths;
- reject javascript, data, blob, file, and custom schemes;
- never render metadata as HTML;
- distinguish publication creator from OpenGraph site/provider name;
- retain provenance for every field.

## Account resolution and deduplication

All creator accounts must use Mangane's canonical account repository.

```text
native nested account
or resolved WebFinger account
        ↓
canonicalize actor/account URI
        ↓
upsert canonical account
        ↓
attach local account key to attribution
```

Deduplicate creators by canonical account URI first, then normalized creator URL, then normalized name only as a final metadata-only fallback within the same resource.

Do not merge two creators globally because they share a display name.

Account moves must migrate attribution aliases transactionally without duplicating bylines. Suspensions and deletions must remove or downgrade account-linked attribution while preserving non-account creator metadata when appropriate.

## Cache and freshness

Attribution is derived metadata, not canonical article content.

Suggested initial TTLs:

- native server-verified preview attribution: follow preview-card freshness, capped at seven days without re-observation;
- independently verified domain/account proof: 24 hours for negative proof, seven days for positive proof;
- metadata-only byline: follow preview-card freshness;
- transient network failure: bounded exponential retry, no permanent negative cache;
- malformed or prohibited destination: longer negative cache with policy version key.

Use validators such as ETag and Last-Modified when the resolver supports them. A resource URL change, canonical URL change, actor move, attribution-domain change, or server card revision must invalidate the relevant derived record.

Cache keys must include parser/policy version and account scope where viewer policy affects the result.

## Profile settings support

For authenticated Mastodon-compatible accounts with verified support, Mangane may expose an “Author attribution domains” setting.

Rules:

- read the current value from credential/profile APIs;
- require appropriate write scope;
- validate registrable domains, IDNA normalization, duplicates, count, and length;
- do not accept URL paths, schemes, credentials, ports, wildcards, or IP literals unless the upstream contract explicitly allows them and security review approves;
- preserve unrelated profile fields;
- submit the complete intended `attribution_domains[]` set according to the server API contract;
- handle optimistic state only with rollback;
- surface server validation errors without leaking response bodies;
- never emulate this setting locally for servers that do not federate or enforce it;
- support `missing_attribution` prompts only for the authenticated user's own claimed article;
- rate-limit prompts and make them dismissible.

A server that lacks this setting may still display metadata-only creator bylines. It must not be described as supporting verified author attribution.

## Presentation contract

Recommended card hierarchy:

```text
Article title
Description
By Creator Name · Publication Name
[creator avatar/account affordance when verified]
```

Rules:

- status author remains in the status header;
- creator attribution appears inside the linked-resource card;
- publication/provider remains visible;
- verified Fediverse account uses existing account hover/card/sheet behavior;
- metadata-only creator URL opens through destination policy;
- show a concise verified indicator only if it is understandable and not visually noisy;
- do not use a checkmark that could be confused with identity verification or platform endorsement;
- expose proof detail in an accessible information sheet when needed;
- sensitive/blocked accounts do not bypass moderation merely because they are article creators;
- card remains coherent with no creator data;
- no layout shift after asynchronous enrichment beyond accepted skeleton bounds.

## Actions

For a verified creator account, Mangane may offer:

- open profile;
- follow/unfollow;
- enable subscribed-post notifications through the normal relationship command;
- add to list where supported;
- mute/block/report through existing account actions.

These actions must operate on the canonical account and must not be duplicated inside link-card-specific services.

No creator-specific engagement count is introduced.

## Privacy

- external resolution is disabled by default until explicitly approved and documented;
- direct browser fetches reveal the user's IP to the publication and therefore require a clear policy and bounded user-triggered or visible-card behavior;
- do not send browsing history, account identity, status text, or access tokens to a resolver;
- resolver requests contain only the canonical resource URL and protocol version;
- do not persist raw HTML;
- do not log resource query strings, creator handles, account URIs, or article titles;
- account-scoped caches purge on logout/account removal;
- public metadata may be shared across accounts only after an explicit cache-key/privacy review and only if moderation-independent;
- remote model services are not involved.

## Security requirements

- all URLs pass the central URL and destination policy;
- nested account objects pass runtime schema validation;
- creator names are plain text and length bounded;
- raw preview `html` is never used for creator attribution;
- no DOM insertion through `innerHTML`;
- no trust based solely on a tag, display name, URL string, or server software label;
- domain comparison uses normalized host and registrable-domain rules, with documented treatment of subdomains;
- internationalized domains use consistent IDNA normalization;
- redirects cannot change proof domain silently;
- actor/profile responses are bounded and schema validated;
- WebFinger resource and returned subject/aliases must agree under the canonical identity policy;
- blocked/suspended accounts are not promoted through creator cards;
- proof downgrade is immediate when authorization disappears;
- stale positive proof must not survive indefinitely;
- every repository command requires exact account scope;
- object-level authorization applies to profile-settings mutation;
- errors contain no raw external content.

## Reliability and retries

Use centralized retry policy:

- retry safe GET/HEAD operations only;
- classify DNS, timeout, TLS, 429, 5xx, schema, policy, and permanent 4xx failures;
- exponential backoff with full jitter;
- honor bounded Retry-After;
- cap attempts and elapsed time;
- cancel when the card leaves the active window, account changes, route closes, feature disables, or application backgrounds where appropriate;
- coalesce identical in-flight canonical resource requests;
- use one per-origin scheduler rather than one timer per card;
- circuit-break repeatedly failing origins;
- never retry prohibited destinations.

## Offline and degraded behavior

- cached attribution may render with a stale indicator when policy permits;
- ordinary preview cards remain usable when creator resolution fails;
- native API fields require no secondary network call;
- unsupported servers show conventional bylines or no byline;
- external resolver outage does not block timeline hydration;
- account resolution failure retains metadata-only name where safe;
- feature disable removes creator-account affordances without removing the link card.

## Migration

1. inventory raw and normalized preview-card shapes;
2. add optional `authors` and `missingAttribution` fields to protocol schemas without changing presentation;
3. add canonical `LinkCreatorAttribution` derived records or embed the normalized list in the existing canonical preview record, choosing one authority only;
4. backfill from existing legacy author fields without network access;
5. migrate post cards behind `linkPreview.creatorAttribution`;
6. add account linking and moderation integration;
7. add authenticated attribution-domain settings behind a separate capability flag;
8. evaluate direct/resolver enrichment in a later bounded slice;
9. remove direct legacy-field reads after equivalence and rollback evidence.

Migrations must be idempotent, resumable, account-scoped, and tolerant of mixed old/new records.

## Rollback

Rollback must:

- disable creator enrichment and account affordances;
- render existing link cards using provider and legacy author metadata;
- retain canonical statuses and previews;
- stop and cancel resolver work;
- purge resolver-specific caches and credentials/configuration according to policy;
- preserve profile attribution-domain settings already stored by the server;
- avoid rewriting server data;
- leave no duplicate preview renderer or orphan account records.

## Feature flags

At minimum:

```text
linkPreview.creatorAttribution
linkPreview.creatorAccountActions
profile.attributionDomains
linkPreview.externalCreatorResolution
```

Each flag requires an owner, default, dependencies, rollback value, telemetry-free evaluation, and removal criteria.

External creator resolution defaults off until its security and privacy gates pass.

## Implementation slices

### Phase 8B-0 — Inventory and fixtures

- enumerate all preview types and renderers;
- capture sanitized fixtures from Mastodon 4.3–4.6 and representative Akkoma/Pleroma servers;
- classify current legacy fields;
- update capability matrix;
- establish exact UI copy and proof vocabulary.

### Phase 8B-1 — Native normalization

- runtime schemas for `authors`, nested accounts, and `missing_attribution`;
- canonical model and deduplication;
- legacy fallback;
- no external fetching;
- unit and adapter tests.

### Phase 8B-2 — Card presentation

- shared byline component;
- post cards, article cards, bookmarks, Search/Explore, and conversation previews;
- multiple-author disclosure;
- account actions via existing commands;
- moderation and accessibility.

### Phase 8B-3 — Account settings

- read/update own attribution domains on supported Mastodon APIs;
- domain validation;
- `missing_attribution` prompt;
- scope, rollback, and error tests.

### Phase 8B-4 — Cross-platform metadata-only support

- normalize legacy/oEmbed/platform-specific creator fields through adapters;
- consistent bylines on unsupported platforms;
- no verified-account claim without proof.

### Phase 8B-5 — Optional verified external resolution

- choose direct CORS and/or trusted resolver architecture through a separate implementation ADR;
- implement hardened fetch, parser, proof verification, caching, budgets, and operator controls;
- keep disabled until adversarial and privacy gates pass.

## Test requirements

### Unit

- empty, one, and multiple authors;
- malformed author entries;
- duplicate nested accounts;
- legacy field migration;
- canonical URL/key stability;
- IDNA/domain normalization;
- subdomain authorization rules;
- malformed handles and control characters;
- proof upgrade/downgrade;
- TTL and invalidation;
- `missing_attribution` semantics;
- no status-author replacement.

### Adapter and contract

- Mastodon 4.3 authors;
- Mastodon 4.6 missing attribution;
- old Mastodon legacy fields;
- Akkoma/Pleroma absent or platform-specific fields;
- unknown extra fields;
- nested account schema failures;
- API-version and capability disagreement.

### Security

- SSRF payloads and redirects;
- DNS rebinding simulation;
- private/link-local/metadata IPs;
- oversized compressed and expanded bodies;
- malformed HTML and endless head;
- script/style payloads in metadata;
- javascript/data/file URLs;
- homograph and IDNA edge cases;
- forged creator tag without actor authorization;
- actor claiming unrelated domains;
- WebFinger alias mismatch;
- stale proof after domain removal;
- cross-account cache and settings IDOR;
- token/referrer leakage;
- log-redaction assertions.

### Integration

- status and creator remain distinct;
- card hydration from local store;
- account move and suspension;
- follow from creator card;
- profile-setting update preserving unrelated fields;
- feature disable/rollback;
- offline cached attribution;
- resolver outage;
- multi-tab request coalescing;
- account switch and purge.

### Accessibility

- creator byline reading order;
- meaningful link names;
- multiple-author disclosure keyboard/screen-reader behavior;
- no color-only verification indicator;
- focus restoration after account sheet;
- zoom, reflow, reduced motion, and 44×44 action targets.

### Performance

- no per-card unbounded network fan-out;
- bounded account upserts;
- large timeline render benchmark;
- no material regression to scroll responsiveness;
- resolver concurrency and cache-hit benchmarks;
- bundle impact limits;
- no duplicate account/avatar fetch when nested data is available.

## Completion gates

Phase 8B is complete only when:

1. native Mastodon `PreviewCard.authors` is normalized and rendered;
2. multiple authors are preserved;
3. legacy and unsupported-platform metadata degrade honestly;
4. status author, creator, and publication remain distinct;
5. verified creator accounts are never accepted from an unverified tag alone;
6. all attribution and account records are deduplicated and account safe;
7. blocks, filters, suspension, moves, and deletion reconcile correctly;
8. attribution-domain settings are capability-gated and preserve unrelated profile state;
9. external resolution, if enabled, passes SSRF, redirect, resource, privacy, and abuse gates;
10. ordinary previews continue to work offline and during resolver failure;
11. migration and rollback are tested;
12. accessibility and performance thresholds pass;
13. CI is clean and no review comments remain;
14. documentation matches merged runtime behavior.

## Non-goals for completion claims

Documentation alone does not complete Phase 8B. Native rendering alone does not complete external resolution. Metadata-only bylines do not establish verified Fediverse authorship. A server returning an `authors` property does not prove it implements all Mastodon attribution settings.

## Handoff summary

The first runtime PR should implement **Phase 8B-0 and 8B-1 only**: inventory, fixtures, schemas, normalization, deduplication, and legacy fallback. It should not introduce arbitrary page fetching, a resolver service, or new profile-setting writes. Those require separate, reviewable slices after the canonical preview-card authority is verified.
