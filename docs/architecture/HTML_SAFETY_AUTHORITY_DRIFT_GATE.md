# HTML Safety Authority Drift Gate

Status: **Current / bounded Phase 0 enforcement**

## Purpose

This gate makes the directly verified HTML rendering and transformation boundary executable. It prevents the current status body, content-warning, plaintext conversion, and compatibility-stripping behavior from drifting without explicit security review.

It does not certify remote HTML as safe. The verified status sinks still have no source-backed sanitizer provenance, and the two shared helpers are transformers rather than sanitizers.

## Enforced current evidence

- `status.contentHtml` may pass through `addGreentext()` and is rendered with `dangerouslySetInnerHTML`;
- `status.spoilerHtml` is rendered with `dangerouslySetInnerHTML`;
- inserted status links are modified after rendering with `rel="nofollow noopener"` and `target="_blank"`, which is navigation hardening rather than sanitization;
- `unescapeHTML()` parses through `innerHTML` and returns text;
- `stripCompatibilityFeatures()` parses and reserializes HTML after removing two narrow compatibility selectors;
- none of these four surfaces may be marked sanitizer-verified without replacing the bounded evidence and tests;
- all four accepted unknowns remain pinned.

## Failure behavior

CI fails when a required surface disappears, a source fragment changes, a transformer is reclassified as a sanitizer, the unknown list shrinks, a manifest path escapes the repository, or the accepted surface set changes without reconciliation.

## Security boundary

This gate intentionally preserves known blockers. It does not prove allowed tags, attributes, URI schemes, SVG, MathML, CSS, iframe, malformed-markup, custom-element, CSP, or downstream caller safety. Those remain required before the HTML safety workstream can be completed.

## Validation

The dedicated workflow runs the checker and adversarial suite with Node's built-in test runner. The broader Architecture inventory workflow also invokes the checker so relevant source changes cannot bypass the bounded gate.
