# Phase 8D — Misskey post, Markdown, and MFM compatibility

## Status

Planned and required before Mangane proceeds to the next implementation phase.

This phase defines the compatibility, rendering, authoring, security, and test work required for Mangane to support posts originating from Misskey-compatible servers, ordinary Markdown content, and Misskey Flavored Markdown (MFM).

The phase is not complete merely because a Misskey-origin ActivityPub object can be displayed as generic HTML. Completion requires explicit, repeatable compatibility tests across normalization, storage, rendering, interaction, composition, edit/redraft, and safe degradation.

## Goals

1. Prove that Mangane preserves and renders representative Misskey-origin posts correctly.
2. Support standard Markdown where the connected server exposes an authoritative Markdown content type or source contract.
3. Support a documented safe subset of MFM.
4. Preserve readable content when an MFM feature is unsupported or unsafe.
5. Keep all content processing within Mangane's canonical HTML sanitization, URL policy, navigation policy, accessibility, and reduced-motion authorities.
6. Detect capabilities from server metadata and payload contracts rather than scattering server-name checks throughout the application.

## Non-goals

- Reimplementing the complete Misskey web client.
- Treating arbitrary user text that resembles MFM as authoritative MFM.
- Executing remote scripts, styles, widgets, embeds, or parser extensions.
- Fetching remote resources from the Markdown or MFM renderer.
- Emulating decorative effects that cannot meet Mangane's security, accessibility, performance, and reduced-motion requirements.
- Silently converting MFM source into lossy Markdown or HTML during edit or redraft.

## Compatibility architecture

### Capability-driven classification

Mangane must classify each individual payload using evidence tied to that payload, in descending order of preference:

1. explicit source/content-type metadata attached to the specific payload field returned by the authenticated server API;
2. a documented endpoint contract that defines the format of that specific response field;
3. sanitized server-rendered HTML when no authoritative source field is available;
4. plain-text fallback.

Instance-wide capabilities may gate parser availability, authoring controls, preview, and submission behavior, but they must never classify a particular timeline payload as Markdown or MFM. A server can support a format while returning an individual status only as rendered HTML or plain text. Server software names remain advisory diagnostics only and must not select a parser.

The normalized status model should distinguish at least:

```ts
type PostSourceFormat =
  | 'html'
  | 'plain-text'
  | 'markdown'
  | 'misskey-mfm'
  | 'unknown';
```

The model must also retain whether the source format is authoritative, inferred from a documented API contract, or unavailable. Rendering code must not infer MFM by scanning arbitrary text for MFM-like delimiters.

### Direct and federated paths

The compatibility suite must cover both:

- a direct Misskey-compatible path when Mangane is connected to a server exposing the relevant Misskey or Mastodon-compatible contract; and
- a federated path in which a Misskey-origin post is delivered through Akkoma or another Mastodon-compatible server.

These paths can expose different fields and different amounts of source information. Mangane must preserve the best available semantics without assuming that a federating intermediary retains native Misskey metadata.

### Canonical pipeline

Every supported path must pass through one bounded pipeline:

```text
server payload
  -> protocol/content classifier
  -> status normalizer
  -> bounded source representation
  -> Markdown or MFM parser when authoritative
  -> safe intermediate representation
  -> canonical HTML sanitizer and URL policy
  -> accessible renderer
```

No component may bypass the sanitizer by treating parser output as trusted HTML.

## Versioned Misskey fixture suite

Create a dedicated fixture directory with provenance documentation and synthetic or redacted data. Fixtures must record:

- the Misskey version or compatible implementation version represented;
- whether the payload came from a direct API, a Mastodon-compatible API, or a federated intermediary;
- which fields are authoritative source fields and which are server-rendered output;
- any transformations applied while removing personal data;
- the expected normalized and rendered semantics.

Fixtures must include representative cases for:

- plain text;
- ordinary server-rendered HTML;
- standard Markdown;
- supported MFM syntax;
- nested and escaped markup;
- mentions, hashtags, URLs, custom emoji, and Unicode emoji;
- replies and conversation metadata;
- renotes/shared posts;
- quote posts and quote metadata;
- content warnings and sensitive media;
- public, unlisted/home, followers-only, and direct visibility where exposed;
- local-only state where the API exposes it;
- images, video, audio, multiple attachments, alt text, and focal metadata where available;
- polls and reactions;
- edited and deleted posts;
- unsupported MFM;
- malformed, oversized, deeply nested, and adversarial input;
- federated Misskey-origin posts after metadata loss or HTML transformation by an intermediary.

Fixtures must not contain live credentials, access tokens, private posts, private account data, or personally identifying information copied from real users.

## Standard Markdown support

Mangane should support a documented Markdown profile rather than an unbounded collection of parser extensions.

The initial profile should evaluate and explicitly classify:

- paragraphs and line breaks;
- emphasis and strong emphasis;
- strikethrough where the server contract supports it;
- ordered and unordered lists;
- block quotes;
- inline code and fenced code blocks;
- links and autolinks;
- headings, if appropriate for post presentation;
- escaped delimiters;
- tables only if they remain usable on narrow screens and accessible to assistive technology.

Raw HTML embedded in Markdown must be disabled or passed through the canonical sanitizer under a narrowly documented policy. Parser output must never create executable HTML, unsafe attributes, unsafe protocols, arbitrary styles, or unbounded embedded content.

## Misskey Flavored Markdown support

### Support matrix

Before implementation, add a support matrix that classifies each researched MFM construct as:

- **supported** — rendered with equivalent or intentionally close semantics;
- **safely degraded** — source content remains readable, but decorative or interactive behavior is omitted;
- **intentionally unsupported** — the construct is rendered as neutral text or removed only when necessary for safety.

The matrix must be tied to tested Misskey versions and updated when fixture behavior changes.

### Initial candidate categories

Research and test, without assuming support, the currently relevant MFM categories exposed by the tested Misskey versions, including:

- mentions, hashtags, URLs, emoji references, and plain formatting;
- center, small, font, foreground/background color, and border-like presentation directives;
- search, plain, quote, and code-oriented constructs;
- motion or animation directives;
- nested MFM functions;
- escaping and literal text forms;
- implementation-specific extensions.

The implementation must prefer semantic HTML and design-system classes. It must not copy arbitrary inline CSS from source text.

### Motion and visual effects

Animated or motion-heavy MFM features require all of the following:

- an explicit support decision in the matrix;
- bounded animation duration, frequency, and resource use;
- no layout instability that impairs reading or interaction;
- `prefers-reduced-motion` behavior that disables decorative motion;
- a nonanimated readable fallback;
- tests for keyboard focus, screen-reader order, and narrow-screen layout.

Features that cannot meet these requirements must safely degrade instead of being partially emulated.

## Composer, preview, edit, and redraft

Markdown or MFM authoring controls may appear only when the connected server advertises or proves that it accepts the corresponding source format.

The composer must:

- preserve source text separately from rendered output;
- submit the authoritative content type expected by the server;
- use the same parser, support profile, sanitizer, and URL policy for preview and final local rendering;
- clearly indicate when the current account cannot author MFM even though the post being replied to originated on Misskey;
- avoid silently converting unsupported MFM to Markdown;
- preserve source text and content type during edit/redraft when the server returns them;
- fail closed to plain text or a clear unsupported-state message when the source contract is ambiguous.

A reply from a non-Misskey account to a Misskey-origin post must remain interoperable. Mangane must not inject native-only MFM syntax unless the posting server accepts it.

## Security requirements

### Parser limits

Markdown and MFM processing must enforce explicit limits for:

- input byte and character length;
- nesting depth;
- token count;
- AST node count;
- generated output length;
- link count;
- custom emoji references;
- animation/effect nodes;
- parse and render time where deterministic enforcement is practical.

Limit failures must return a readable bounded fallback and must not crash the timeline or status page.

### Required protections

Tests and implementation must guard against:

- script and event-handler injection;
- dangerous URL schemes and deceptive navigation;
- arbitrary CSS or style injection;
- DOM clobbering;
- prototype pollution;
- catastrophic regular-expression backtracking;
- parser nontermination;
- pathological nesting and memory amplification;
- bidi-control abuse and misleading link labels;
- malformed Unicode and surrogate pairs;
- unsafe raw HTML;
- remote resource fetching from renderer plugins;
- unbounded animation or layout work;
- sanitizer/parser disagreement that reactivates escaped markup.

Parsing must be pure and deterministic. The renderer must perform no network requests.

### Cache safety

Any cached derived representation must include the parser profile version and sanitizer version in its cache identity. Changes to either version must invalidate old output. Cached output must be bounded and must never be treated as trusted merely because it was cached.

## Accessibility requirements

- Rendered content must preserve logical reading order.
- Links need understandable accessible names and visible focus states.
- Code blocks and tables must remain horizontally manageable on narrow screens.
- Decorative formatting must not remove text contrast or obscure content.
- Color must not be the only carrier of meaning.
- Custom emoji need appropriate alternative text.
- Unsupported constructs must remain readable to screen readers.
- Reduced-motion behavior is mandatory for every animated effect.
- Touch targets and interactive affordances must meet Mangane's existing accessibility baseline.

## Required automated tests

### Normalization and classification

- Direct Misskey-compatible payload -> expected normalized status.
- Federated Misskey-origin payload -> expected normalized status.
- Authoritative content-type classification.
- Missing or contradictory metadata -> safe fallback.
- No server-name-only format inference.

### Parser and renderer

- Golden tests for every supported Markdown construct.
- Golden tests for every supported MFM construct.
- Readable fallback tests for every degraded or unsupported construct.
- Escaping and nested syntax tests.
- Custom emoji, mention, hashtag, and link tests.
- Sanitizer invariants proving no executable or policy-violating output survives.
- Reduced-motion tests for effects.
- Accessibility component tests.

### Adversarial and property testing

- Fuzz/property tests proving parser termination under bounded input.
- Deep nesting and large token-count tests.
- Malformed Unicode and bidi-control tests.
- Unsafe URL and misleading-link tests.
- Raw HTML, event-handler, CSS, and DOM-clobbering tests.
- Repeated delimiters and regex-stress cases.
- Output-size amplification tests.

### End-to-end compatibility

At minimum, CI must prove:

```text
Misskey fixture
  -> fetch/import contract
  -> normalize
  -> store
  -> render
  -> accessible, sanitized expected result
```

Additional integration tests must cover:

- replies;
- shared/renoted posts;
- quotes;
- media and alt text;
- polls and reactions;
- edit/redraft source preservation;
- composer preview and submission when supported;
- a direct Misskey-compatible path;
- a federated Misskey-origin path through a Mastodon-compatible server.

## Dedicated CI contract

Add a dedicated Misskey compatibility test command and CI job or clearly owned job step. It must run the versioned fixtures, normalization tests, rendering tests, and security regressions.

The new suite must not weaken or bypass existing gates. Changes in this phase must also pass:

- HTML safety authority;
- telemetry and redaction authority;
- network callsite authority;
- architecture inventory;
- browser persistence authority;
- React Query authority;
- accessibility and visual baselines;
- full unit and integration coverage;
- development and production builds;
- production build budget;
- security regression tests.

## Definition of done

This phase is complete only when all of the following are true:

1. A versioned and provenance-documented Misskey fixture suite exists.
2. Direct and federated Misskey-origin post paths are tested.
3. Standard Markdown has an explicit supported profile.
4. MFM has a versioned support/degradation matrix.
5. Incoming posts survive fetch, normalization, storage, and rendering without avoidable semantic loss.
6. Composer, preview, edit, and redraft preserve authoritative source and content type where supported.
7. Unsupported constructs degrade to readable inert content.
8. Parser limits, fuzz tests, sanitizer invariants, URL policy, reduced motion, and accessibility requirements are enforced.
9. A dedicated Misskey compatibility suite runs in CI.
10. All existing and new CI checks pass on the final head.
11. Documentation identifies tested Misskey versions and known limitations.
12. No temporary workflow, fixture-generation artifact, live user data, or unsafe renderer bypass remains in the final diff.

## Handoff checkpoint

Before beginning another Mangane implementation phase, inspect this document and either:

- implement Phase 8D in dependency-ordered subphases; or
- explicitly document why another prerequisite must precede it without losing this requirement.

Do not mark Misskey compatibility complete based solely on generic ActivityPub rendering or a single happy-path fixture.