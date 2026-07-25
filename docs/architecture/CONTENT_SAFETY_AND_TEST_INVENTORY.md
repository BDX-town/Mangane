# Mangane Content Safety and Test Inventory

Status: **Current / Phase 0D content-safety work complete**

Last updated: 2026-07-25

This document records content-safety and test-harness behavior verified directly from the current repository. Phase 0D's complete sink inventory and adversarial safety boundary are now executable; the broader Phase 0G CI/test baseline and Phase 0E telemetry work remain separate.

## 1. Shared HTML utilities

`app/soapbox/utils/html.ts` contains two shared helpers that create detached DOM elements and assign supplied strings through `innerHTML`.

### `unescapeHTML`

Verified behavior:

- creates a temporary `div`;
- performs regular-expression substitutions for line breaks and paragraph boundaries;
- strips tag-shaped text with a regular expression;
- assigns the result through `wrapper.innerHTML`;
- returns `wrapper.textContent`;
- explicitly warns in source that the function can still return unsafe HTML.

This helper is a text-conversion utility, not a sanitizer. It must not be used as evidence that remote content is safe for later HTML insertion.

### `stripCompatibilityFeatures`

Verified behavior:

- creates a temporary `div`;
- assigns the supplied string directly to `node.innerHTML`;
- removes `.quote-inline` and `.recipients-inline` elements;
- returns `node.innerHTML`.

The function transforms markup but does not define an allowlist, remove event-handler attributes, restrict URL schemes, enforce safe link attributes, or otherwise establish a complete sanitization policy.

### Required treatment

Both helpers must be classified as HTML transformers. Any caller that subsequently renders their output as HTML requires an independently verified sanitizer and sink policy.

## 2. Completed HTML sink inventory

The generated Phase 0D authority enumerates every reachable production use of:

- `dangerouslySetInnerHTML`;
- direct `.innerHTML`, `.outerHTML`, `insertAdjacentHTML`, and document-write APIs;
- parser libraries and detached-DOM transformations;
- status and profile-field rendering;
- instance-provided custom pages and configuration markup;
- link previews, oEmbed, iframe and embed rendering;
- SVG and inline-SVG rendering;
- rich-text composer previews;
- notification text conversion;
- clipboard and share-target content;
- any sanitizer library, configuration, hooks and bypasses.

The row-level manifest and linked matrices record:

- content source and trust level;
- sanitizer and exact configuration;
- permitted elements and attributes;
- URL-scheme and origin policy;
- link `rel`, target and referrer behavior;
- iframe sandbox and permissions policy;
- CSP interaction;
- account and instance scope;
- tests for malformed markup, event handlers, CSS injection, SVG/script payloads, protocol smuggling and mutation XSS.

## 3. Dependency signals relevant to content safety

The package manifest includes:

- `cheerio`;
- `escape-html`;
- `entities`;
- `react-inlinesvg`;
- `exif-js`;
- remote-content and preview-related UI dependencies.

Dependency presence does not prove active usage or safe configuration. Phase 0D therefore pins and directly exercises `dompurify` 3.4.12 through `app/soapbox/utils/html-safety.ts`; the generated manifest records every boundary call.

## 4. Test command baseline

The package manifest defines:

- `test`: Jest under `NODE_ENV=test`;
- `test:coverage`: Jest coverage;
- `test:all`: coverage followed by lint;
- JavaScript/TypeScript lint through ESLint;
- Sass lint through Stylelint;
- build through webpack.

The manifest does not define dedicated scripts for:

- TypeScript-only type checking;
- browser or end-to-end tests;
- accessibility tests;
- service-worker integration tests;
- security tests;
- dependency audit or license checking;
- bundle-size budgets;
- performance tests;
- migration or rollback tests.

These may exist through direct workflow commands, but they are not guaranteed by package scripts.

## 5. Jest configuration

`jest.config.js` verifies:

- Jest runs in `jsdom`;
- tests match `__tests__` paths and `*.test` naming;
- Babel transforms JavaScript and TypeScript;
- coverage is collected from `app/soapbox` JavaScript and TypeScript sources;
- service-worker `entry.ts` is excluded from coverage;
- coverage reports include HTML, text, text-summary and Cobertura;
- reporters include the default reporter and `jest-junit`;
- webpack, static assets, vendor, temporary and configuration paths are ignored.

### Important gap

The service-worker entry is excluded from coverage while the worker currently owns security-sensitive push and share-target behavior. Phase 4 must add direct worker tests rather than relying on application coverage.

The Jest configuration declares `app/soapbox/jest/test-setup.ts`. Phase 0 verification traced that file to commit `bd9d5f64`, where it was deleted as unused without removing the active `setupFilesAfterEnv` reference. The setup contract has been restored from its last tracked implementation and now initializes Testing Library DOM matchers, API mock cleanup, fake IndexedDB, deterministic UUIDs, IntersectionObserver, and `matchMedia`.

## 6. CI evidence status

The PR head currently exposes no combined status checks through the available GitHub status API. This does not prove that the repository has no workflows or checks; checks may use GitHub Checks rather than legacy statuses, may not trigger for documentation-only changes, or may be absent.

Phase 0 still requires an exact workflow inventory covering:

- workflow filenames and triggers;
- permissions and secrets;
- runtime and package-manager setup;
- dependency caching;
- lint, test, coverage and build commands;
- required-check enforcement;
- fork and pull-request behavior;
- artifact and report retention;
- concurrency and cancellation;
- security scanning and dependency review;
- browser, accessibility and worker coverage;
- baseline results on current `main` and the Phase 0 branch.

## 7. Current conclusions

Verified:

- shared HTML helpers perform markup transformation through `innerHTML`;
- those helpers do not constitute a complete sanitizer;
- one helper explicitly warns that unsafe HTML may remain;
- all production HTML sinks, parser/writes, iframes and destination expressions are generated into the Phase 0D manifest;
- DOMPurify 3.4.12 provides the centralized HTML/attribute/URL allowlist;
- raw card/embed execution is blocked and oEmbed uses sanitized empty-sandbox `srcDoc`;
- adversarial browser tests and source-mutation drift tests run in dedicated CI;
- the current test harness is Jest/jsdom-based;
- the service-worker entry is excluded from coverage;
- package scripts do not themselves establish browser, accessibility, worker-security, dependency-audit or license-check coverage.

Not yet verified in this separate test/CI workstream:

- exact Sentry initialization, consent and redaction behavior;
- all GitHub Actions workflows and required checks;
- actual baseline test, lint, build and coverage outcomes;
- browser and accessibility test coverage.

These remaining items belong to Phase 0E–0G rather than Phase 0D.
