# Mangane Search and Local Intelligence Architecture

Status: **Accepted target**

Last updated: 2026-07-29

## 1. Objective

Mangane provides local-first hybrid retrieval and contextual intelligence. Search combines exact lexical retrieval, semantic similarity, entities, topics, conversation structure, relationships, time, and explicit user preferences without requiring a centralized behavioral profile.

Search, Explore, Composer intelligence, semantic filtering, and Gist share infrastructure but remain distinct product capabilities. Gist synthesizes retrieved evidence and is never itself a source of truth.

## 2. Research synthesis

### ObjectBox principles to emulate

- vectors as versioned projections of canonical local records;
- embedded and persistent HNSW indexing;
- incremental insert, update, deletion, and graph repair;
- metadata constraints around vector retrieval;
- bounded caches rather than loading every vector into memory;
- transactional consistency as an architectural goal.

Mangane improves this with strict model/dimension compatibility, browser-safe mutation journals, a dedicated lexical index, explicit rank fusion, parallel index generations, and deterministic degraded modes.

### Weaviate principles to emulate

- independent lexical and vector candidate generation;
- candidate union rather than intersection;
- field-aware lexical scoring;
- reciprocal-rank and score-based fusion;
- hard filters distinct from soft boosts;
- candidate oversampling, optional reranking, and score explanations.

Mangane improves this with adaptive query planning, robust score calibration, entity/topic/conversation retrievers, local personalization, and stable incremental ranking.

### Meilisearch principles to emulate

- typo tolerance, prefix search, and search-as-you-type;
- matched-word coverage, proximity, exactness, and attribute priority;
- split/concatenated-term recovery;
- semantic-score calibration;
- versioned embedding templates;
- facets, filters, and small-model-first evaluation.

Mangane improves this with social-token classification, deterministic lexical rules combined with BM25F-like relevance, delayed semantic work while typing, and intent-adaptive semantic weighting.

## 3. Core pipeline

```text
Query understanding
  -> token, language, time, entity, and intent analysis
  -> parallel lexical/vector/entity/topic/conversation retrieval
  -> canonical-record and access validation
  -> score calibration and fusion
  -> soft boosts, penalties, optional reranking, and diversity
  -> machine-readable evidence and user-readable explanations
```

Canonical social records are authoritative. Every search projection is rebuildable and carries its source revision, content hash, schema/model/template versions, dimensions, and generation time. No result may be exposed without resolving the current canonical record and rechecking visibility, deletion, block policy, and account scope.

## 4. Lexical retrieval

The lexical engine combines deterministic social-search rules with corpus relevance.

Token classes include ordinary words, quoted phrases, handles, hashtags, URLs/domains, DIDs and protocol identifiers, versions and error codes, dates/numbers, emoji, entity aliases, and code fragments.

Policies:

- ordinary language and names are typo-tolerant;
- handles, DIDs, URLs, AT URIs, codes, and cryptographic identifiers are exact or narrowly prefix-aware;
- original and accent-folded forms are retained;
- stopwords remain indexed and are handled at query time;
- trigrams are selective, not universal;
- exact identifiers may override generic relevance scoring.

Post fields may include body, hashtags, author identity, entities, topics, URLs/domains, alt text, quoted text, and bounded conversation context. Deterministic match quality and field priority are combined with BM25F or equivalent corpus scoring.

## 5. Semantic retrieval

The initial semantic representation is a compact text-content embedding. Additional named vectors for conversation, media, or entities require evaluation evidence.

Every vector index manifest binds model and revision, dimensions, normalization, distance metric, embedding-template version, and index algorithm/version. Incompatible vectors are rejected rather than truncated or silently accepted.

HNSW is the baseline ANN algorithm. Construction quality, graph connectivity, deletion repair, query breadth, memory use, and candidate limits are device-profiled and benchmarked.

Model/index migration uses parallel generations:

```text
current index active
  -> next index building
  -> next index verified
  -> atomic activation
  -> previous index retired
```

Search remains available through the current index or lexical-only mode throughout migration.

## 6. Query planning and fusion

The planner selects retrievers, lexical field profiles, semantic weight, confidence thresholds, vector spaces, and candidate depth.

- handles, URLs, codes, and quoted phrases are lexical-dominant;
- broad conceptual queries increase semantic/entity weight;
- personal-recall queries add conversation, time, and local interaction evidence;
- account search uses identity fields rather than post-content ranking.

User modes are **Balanced**, **Exact**, and **Conceptual**. They adjust planner policy rather than exposing raw fusion parameters.

Candidates from all enabled retrievers are unioned and deduplicated. Supported fusion strategies are:

1. reciprocal-rank fusion for incompatible or uncalibrated retrievers;
2. relative-score fusion for early experiments;
3. calibrated weighted fusion as the long-term target;
4. learned fusion only after sufficient relevance data and privacy review.

Fallback order is calibrated fusion, then relative-score fusion, then reciprocal-rank fusion. Calibration artifacts are retriever- and model-specific, versioned, and tested against outlier sensitivity.

## 7. Eligibility, boosts, and penalties

Hard eligibility includes current access, account scope, deletion/tombstones, block policy, strict mute or semantic-hide policy, explicit date/surface scope, and a valid canonical record.

Soft contributions may include lexical and semantic relevance, entity/topic match, conversation continuity, relationship affinity, explicit interests, recency, source preference, and capped popularity.

Penalties may include repetition, already-seen content where requested, near duplicates, excessive same-author concentration, low-confidence vector-only results, and stale projections.

Canonical relevance and personal utility are recorded separately so personalization is never represented as objective truth.

## 8. Entities, topics, Gist, and Explore

Phase 8B defines the single canonical entity authority used by Search and every other intelligent consumer. Processing follows mention or hashtag extraction, candidate generation, contextual resolution, confidence plus margin gates, explicit ambiguity/abstention, canonical local identity, and optional Wikidata/DBpedia enrichment. External graphs provide aliases, multilingual labels, types, redirects, official links, and selected relationships; they do not define ownership, authorship, authorization, or truth. Cached enrichment retains provider, evidence, retrieval time, freshness, license/attribution metadata, and independently disableable provider state.

Literal hashtags remain independently searchable social tokens. A separate HashtagEntityBinding may resolve context-specific meanings, equivalent event tags, aliases, and translations for semantic search, Custom Feeds, recommendations, topic pages, and Gist grouping. Ambiguous tags remain literal or unresolved rather than receiving a universal meaning.

Phase 15 entity retrieval, graph expansion, and fusion must reuse Phase 8B schemas, repositories, aliases, evidence, Wikidata/DBpedia clients, caches, confidence policy, merge/split history, and privacy boundaries. It may add retrieval indexes and evaluation but may not establish a second entity graph.

Topic assignments are local, versioned derived data with confidence values. They are not permanent facts about users or authors. Topic/entity relationships preserve provenance and cannot bypass canonical-record access checks.

Gist requires sufficient and diverse evidence, citations to posts or linked sources, separation of facts/claims/interpretation, visible uncertainty, disagreement preservation, and refusal to synthesize when evidence is insufficient. Knowledge-graph matches help disambiguation but do not independently prove source claims.

Explore may use follows, lists, bookmarks, explicit interests, retention-governed search/reading history, topic/entity affinity, trends, recency, diversity, and negative feedback. It must not become a hidden engagement-maximization feed.

## 9. Semantic filtering

Semantic filters support Hide, Reduce, and Deprioritize, plus duration, surface scope, positive/negative examples, confidence thresholds, explanations, feedback, and undo.

Strict hide policies fail closed at presentation. Broad semantic filtering must provide preview and recovery controls to reduce overblocking.

## 10. Composer intelligence and interpolator

Composer context may analyze the draft, replied-to post, accessible parent thread, selected replies, entities, links, sentiment, and conversational dynamics.

Capabilities include entity disambiguation, missing-context detection, misunderstanding warnings, duplicate-discussion detection, audience/thread awareness, concise tone and sentiment feedback, source/context suggestions, and interpolation of omitted context from accessible evidence.

All assistance is advisory, concise, dismissible, non-shaming, uncertainty-aware, local for private drafts unless the user explicitly invokes a remote model, and incapable of posting automatically.

## 11. Explainability

Every intelligent result retains machine-readable evidence and can explain exact matches, related concepts, entities, relationship or topic signals, recent conversation participation, and semantic-filter effects. Explanations must never expose inaccessible content or private-profile details.

## 12. Degraded modes

```text
Full: lexical + vector + entities + personalization + reranking
Reduced: lexical + vector + entities
Degraded: lexical + entities
Lexical-only: local lexical index + exact local filters
Minimum online fallback: remote search + local exact filters
```

The local lexical index is the mandatory offline floor whenever it is healthy. Failure or quarantine of vectors, embedding models, entities, topics, personalization, or reranking must not force remote search or disable local retrieval.

Remote search is used only when the local lexical index is unavailable, corrupt, not yet built, or insufficient for an explicitly remote-only scope, and only when network access and user policy permit it.

Failures are quarantined per component. Corruption in one derived index must not automatically quarantine healthy indexes. Search must continue in the healthiest remaining local mode while failed components rebuild.

## 13. Evaluation

Privacy-safe relevance suites must cover exact social identifiers, hashtags, URLs, quotations, codes, typos, prefixes, multilingual and accented text, conceptual queries, ambiguous entities, conversation recall, recent events, semantic-filter false positives/negatives, cross-account isolation, and every degraded-mode transition—including lexical-only offline operation.

Track recall@k, precision@k, MRR/NDCG where appropriate, exact-match preservation, latency, index growth, rebuild time, memory, energy use, explanation correctness, and degraded-mode continuity.