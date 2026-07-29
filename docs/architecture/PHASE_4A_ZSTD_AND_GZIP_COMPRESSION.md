# Phase 4A Zstd and Gzip Compression

Status: **Accepted target / queued after Phase 4 foundations**

Last updated: 2026-07-29

## Purpose

Integrate gzip and Zstandard (`zstd`) deliberately across Mangane's deployment,
network, export/import, worker, and local-persistence boundaries without assuming
that browser JavaScript controls HTTP content negotiation or that every payload
benefits from compression.

This phase is an efficiency and resilience phase. It must not change canonical
record semantics, leak secrets through compression side channels, create
unbounded decompression work, or introduce a large WebAssembly dependency without
measured benefit.

## External standards and browser constraints

The implementation must follow:

- RFC 9110 HTTP content-coding and `Accept-Encoding` semantics;
- RFC 8878 Zstandard format and `zstd` content coding;
- RFC 9659 HTTP Zstandard window-size limits;
- the browser Compression Streams API where supported.

Important browser constraints:

- `Accept-Encoding` is controlled by the user agent and is a forbidden request
  header for application JavaScript;
- normal `fetch` responses are transparently decompressed by the browser;
- application code must not attempt to decode an already decoded HTTP response;
- `CompressionStream`/`DecompressionStream` support must be capability-tested by
  algorithm rather than inferred from browser name;
- gzip is the portable browser-side baseline;
- native zstd compression and decompression support may differ by browser and
  version, so zstd must remain capability-gated.

## Scope

### 4A.1 HTTP response compression

Deployment servers, reverse proxies, CDNs, and compatible backend instances may
serve compressible responses using negotiated content coding.

Policy:

1. prefer `zstd` only when the user agent advertises it and the serving layer is
   verified to produce RFC 8878/RFC 9659-compatible frames;
2. retain gzip as the universal negotiated fallback;
3. retain identity for clients or payloads where compression is unsupported or
   wasteful;
4. emit `Vary: Accept-Encoding` for cacheable negotiated resources;
5. preserve strong or correctly variant-scoped validators;
6. never apply multiple equivalent compression codings to the same response;
7. never label an encoded response with an inaccurate `Content-Encoding`;
8. avoid recompressing formats already compressed internally, including most
   images, video, audio, ZIP archives, and precompressed font assets.

Likely compressible classes:

- JavaScript, CSS, HTML, SVG, JSON, ActivityStreams JSON-LD, manifests, and text;
- larger API responses and exported Mangane metadata;
- source maps only in approved non-production contexts.

Compression thresholds must be benchmarked. Tiny responses should remain
uncompressed when framing and CPU cost outweigh byte savings.

## PWA and static-asset delivery

Production builds may generate verified precompressed variants where the hosting
platform supports deterministic selection.

Required controls:

- every compressed artifact maps to the exact uncompressed content digest;
- stale `.gz` or `.zst` siblings fail CI rather than being served;
- the service worker caches the browser-decoded representation unless a specific
  lower-level cache contract proves otherwise;
- cache keys must not create duplicate account-private representations merely
  because the wire coding differs;
- navigation fallback and update recovery must work when one coding variant is
  absent or corrupt;
- deployment documentation must distinguish origin/CDN configuration from PWA
  runtime code.

Mangane must not ship application code that manually sets `Accept-Encoding`.

## API request-body compression

Request compression is opt-in and capability-negotiated. Do not compress ordinary
small Mastodon-compatible JSON or form requests by default.

A request body may use `Content-Encoding: gzip` or `Content-Encoding: zstd` only
when the target authority explicitly advertises or documents support and the
request remains retry-safe under the Phase 6 idempotency contract.

Required behavior:

- discover request-coding support through an approved capability or a prior
  `415` response carrying `Accept-Encoding`;
- never guess support from response compression;
- preserve original media type in `Content-Type`;
- bound compressed and uncompressed sizes;
- retain an identity retry only when method semantics, idempotency, and server
  response make retry safe;
- never retry non-idempotent post creation solely to change compression unless a
  stable operation identifier prevents duplication.

Initial production scope should exclude request compression unless a measured API
or export/upload path justifies it.

## Local persistence and export compression

Local compression is separate from HTTP compression.

Approved initial candidates:

- large immutable timeline snapshots;
- rebuildable search/index segments;
- bounded diagnostic exports after redaction;
- user-initiated backup/export bundles;
- cached large JSON documents where measured storage reduction exceeds CPU and
  complexity cost.

Do not compress:

- individual small rows;
- access tokens, private keys, OAuth secrets, or credential stores;
- data already compressed by its media format;
- hot records whose repeated decode cost harms scrolling;
- mixed attacker-controlled and secret material in a shared compression context.

Every stored compressed record requires:

```ts
interface CompressedEnvelope {
  schemaVersion: number;
  algorithm: 'gzip' | 'zstd';
  uncompressedBytes: number;
  compressedBytes: number;
  checksum: string;
  createdAt: string;
  payload: Uint8Array;
}
```

The envelope must be versioned independently from the inner domain schema.
Checksums verify integrity, not authenticity.

## Codec abstraction

Domain repositories may not import browser or WebAssembly codec packages
directly.

```ts
interface CompressionCodec {
  readonly algorithm: 'gzip' | 'zstd';
  readonly implementation: 'native-stream' | 'wasm' | 'server';

  isSupported(): boolean;

  compress(input: ReadableStream<Uint8Array>, options: {
    signal: AbortSignal;
    maxInputBytes: number;
  }): Promise<ReadableStream<Uint8Array>>;

  decompress(input: ReadableStream<Uint8Array>, options: {
    signal: AbortSignal;
    expectedBytes?: number;
    maxOutputBytes: number;
  }): Promise<ReadableStream<Uint8Array>>;
}
```

Codec selection is policy-driven:

```text
native zstd, when verified and beneficial
  -> native gzip
  -> identity
```

A zstd WebAssembly codec is not automatically approved. It requires dependency,
license, supply-chain, CSP, bundle, memory, startup, worker, and mobile battery
review. It must be lazy-loaded outside the critical application shell.

## Worker execution

Compression and decompression of large payloads run in a bounded worker path.
The UI thread may process only small payloads under a measured threshold.

Worker requirements:

- transferable streams or buffers where supported;
- cancellation on logout, account switch, purge, navigation abandonment, or
  storage migration rollback;
- hard input/output byte limits;
- bounded concurrency;
- no unbounded buffering before decode completion;
- progress only for user-visible long operations;
- deterministic cleanup after failure.

## Decompression-bomb and memory safety

Never trust declared uncompressed size alone.

The decoder must enforce:

- maximum compressed input bytes;
- maximum expanded bytes;
- maximum expansion ratio;
- maximum zstd window permitted by RFC 9659 and the selected implementation;
- maximum wall-clock/worker budget;
- cancellation and queue limits;
- checksum verification where the envelope defines one;
- fail-closed behavior for truncated, concatenated, malformed, or unsupported
  frames.

Partially decoded data must not enter canonical stores.

## Compression side-channel policy

Compression can expose secret-dependent length differences when attacker-
controlled and secret material share a compression context.

Mangane must:

- keep authentication tokens and private keys out of compressed application
  payloads;
- avoid reflecting secrets into compressible HTML or JSON;
- avoid compressing cross-origin attacker input together with private drafts,
  private messages, or hidden moderation data;
- preserve existing CSRF, origin, cache, and authorization boundaries;
- document any deployment-level decision to disable compression for especially
  sensitive dynamic responses;
- never treat TLS as a complete mitigation for compression-oracle attacks.

## Migration

Local compression is additive and schema-versioned.

Migration steps:

1. read existing identity records normally;
2. compress only eligible records during bounded idle/background opportunities or
   on rewrite;
3. atomically replace a record only after decode verification succeeds;
4. retain the prior representation until the transaction commits;
5. support mixed compressed and uncompressed records throughout rollout;
6. never require a full blocking database rewrite at application launch.

Rollback reads both formats, stops new compression, and rewrites compressed
records to identity only when necessary and safely bounded.

## Observability

Privacy-safe measurements may include:

- algorithm and implementation class;
- input/output byte buckets;
- compression ratio buckets;
- duration and cancellation buckets;
- decode rejection category;
- fallback count;
- worker queue depth category;
- deployment response-coding coverage.

Do not log payloads, URLs containing credentials, account identifiers, drafts,
private messages, or exact sensitive sizes.

## Implementation slices

### 4A.1 Capability and deployment audit

- inventory current CDN/proxy/backend compression;
- record browser gzip/zstd stream support on target devices;
- benchmark representative API, index, snapshot, and export payloads;
- define thresholds and excluded media classes;
- add deployment conformance fixtures for `Vary`, validators, and codings.

### 4A.2 Provider-neutral codecs

- implement native gzip stream codec;
- capability-probe native zstd independently for compress/decompress;
- add identity fallback and typed errors;
- add bounded worker execution and cancellation.

### 4A.3 Local envelope and migration

- add versioned compressed envelope;
- transactional mixed-format reads/writes;
- corruption, quota, interrupted migration, and rollback tests;
- integrate one measured high-value record class first.

### 4A.4 Deployment response compression

- provide server/CDN configuration guidance;
- verify gzip fallback and optional zstd negotiation;
- enforce precompressed artifact freshness in CI where used;
- measure real transfer, CPU, and cache effects.

### 4A.5 Export/import

- add bounded gzip export baseline;
- add zstd only where both producer and consumer capability are explicit;
- validate checksums, schema, expanded size, and account scope before import.

## Tests

Required coverage includes:

- gzip and zstd capability detection;
- browser-native unsupported-format fallback;
- deterministic round trips;
- malformed, truncated, oversized, and high-expansion inputs;
- cancellation and worker termination;
- quota exhaustion and interrupted migration;
- mixed-version database reads;
- stale precompressed assets;
- incorrect `Content-Encoding` and missing `Vary`;
- request compression 415 negotiation and retry safety;
- secret/payload log redaction;
- account switch and purge during work;
- mobile CPU, memory, startup, battery, and scrolling budgets.

## Explicit non-goals

- forcing `Accept-Encoding` from browser JavaScript;
- manually decoding normal compressed `fetch` responses;
- compressing every IndexedDB record;
- recompressing media formats that are already compressed;
- adding zstd WebAssembly merely because zstd is newer;
- replacing encryption with compression;
- claiming bandwidth savings without representative measurements;
- allowing compression to weaken cache, account, or authorization isolation.

## Exit criteria

Phase 4A is complete only when:

1. HTTP and local compression boundaries are documented and implemented
   separately;
2. gzip works as the tested portable fallback;
3. zstd is used only under verified capability and RFC 9659 limits;
4. no application code attempts to control forbidden HTTP negotiation headers;
5. compressed local records are versioned, bounded, checksummed, transactional,
   and rollback-readable;
6. decompression-bomb, malformed-frame, cancellation, quota, and corruption tests
   pass;
7. secret-bearing and attacker-controlled data do not share an unsafe compression
   context;
8. deployment caches vary correctly by content coding;
9. mobile performance, memory, battery, bundle, and startup budgets pass;
10. disabling zstd or all local compression preserves canonical data and normal
    Mangane operation;
11. documentation authority, CI, and review are clean.
