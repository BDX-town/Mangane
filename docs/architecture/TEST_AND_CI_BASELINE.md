# Test and CI Baseline

Status: **Phase 0G complete / executable**

Last updated: 2026-07-25

## Authority

The canonical pull-request workflow is [`.github/workflows/phase-0g-quality.yml`](../../.github/workflows/phase-0g-quality.yml). [`scripts/check-ci-baseline.js`](../../scripts/check-ci-baseline.js) rejects missing jobs, mutable action tags, broadened permissions, unbounded jobs, non-immutable installs, missing owner commands, and `continue-on-error`.

Every job uses Node 18.20.8, repository-pinned Yarn 4.0.2, `yarn install --immutable --mode=skip-build`, read-only repository permission, non-persisted checkout credentials, a timeout, and stale-run cancellation. Build jobs then run the explicitly reviewed, checksum-pinned `yarn prepare:twemoji` acquisition step; dependency and repository install scripts remain disabled. No job receives a secret. No required job is allowed to continue after failure.

## Canonical workflow and job matrix

| Job / owner | Required commands | Primary evidence |
|---|---|---|
| `quality` / frontend-maintainers | ESLint drift budget, Sass lint, TypeScript drift gate, CI contract tests | 0 ESLint errors; no warning increase; exact inherited type diagnostics; workflow mutation tests |
| `unit-integration` / frontend-maintainers | full Jest coverage; all Node-native governance tests | application behavior, reducers, actions, utilities, persistence, routing, and inventory mutation suites |
| `browser-accessibility` / design-system | focused jsdom browser smoke; design/accessibility mutation suite | login labels and keyboard control, public/protected deep links, compose navigation, reduced motion, keyboard/focus authority |
| `worker-security` / security-maintainers | HTML, telemetry, persistence, share-target, push-worker, and cache-authority suites | sanitization and navigation policy; diagnostics redaction; logout/purge; worker restart revocation; exact share routing and bounded input |
| `production-build` / release-maintainers | production webpack build; bundle/worker/secret budget gate | production application, CSS, runtime and service-worker byte limits; no source maps; generated-output secret scan |
| `development-build` / release-maintainers | development webpack build | development configuration, source maps, copied share worker, and deep-link fallback compile together |

Required branch checks must use the six stable job names above. Repository branch-protection settings are external to the source tree and require direct GitHub verification after the workflow is published.

Direct GitHub API verification at 2026-07-25T20:53:34-04:00 reported `Branch not protected` for the stacked PR base `phase-0/telemetry-redaction-authority`. Therefore the six jobs are green on PR 44 but are not enforced by a branch-protection rule. This external repository-setting limitation is recorded in [`config/test-ci-baseline.json`](../../config/test-ci-baseline.json); the source baseline does not claim otherwise.

## TypeScript migration debt

`yarn typecheck` runs the complete production TypeScript graph with JavaScript disabled and pins every inherited diagnostic in [`config/typecheck-baseline.json`](../../config/typecheck-baseline.json). The baseline currently contains 101 inherited diagnostics and zero unbaselined diagnostics. Any added, removed, moved, or changed diagnostic fails CI until explicitly reconciled.

This is intentionally not described as a clean typecheck. The debt is owned by `frontend-maintainers`, tracked as the Phase 1 TypeScript authority migration, and expires on 2026-10-31. Broad file exclusions and `skipLibCheck` cannot turn application diagnostics into an unreported pass.

## ESLint and formatting

ESLint has zero errors. The inherited 183 warnings are a hard ceiling enforced by `yarn lint:js:baseline`; reductions pass and increases fail. Sass has no accepted error baseline. There is no repository-wide Prettier contract, so formatting is enforced by ESLint and Stylelint rather than an invented formatter configuration.

## Test ownership and evidence

- Jest owns application unit, integration, DOM/browser, routing, auth and accessibility behavior.
- Node's native test runner owns repository governance, adversarial drift, build-budget and worker sandbox tests.
- Production webpack owns actual service-worker integration and bundle evidence.
- The dependency workflow owns lockfile, license, action-pin and current-advisory evidence.

The current full Jest run passes 151 suites and 718 tests, and the Node-native governance runner passes 160 adversarial and authority tests. Coverage is 36.87% statements, 27.71% branches, 26.39% functions, and 38.17% lines. The committed Jest thresholds round each metric down to a hard non-regression floor; increasing coverage does not require baseline churn.

The browser smoke is intentionally named as jsdom evidence rather than a claim of cross-engine coverage. Real Chromium/WebKit/Firefox automation remains the first browser-harness expansion described in [`BROWSER_WORKER_HARNESS_PLAN.md`](./BROWSER_WORKER_HARNESS_PLAN.md).

## Determinism and artifacts

Production builds disable source maps and use content hashes. Budget validation resolves assets from `assets-manifest.json`, verifies the generated offline worker, and scans text artifacts for high-confidence private-key and provider-token formats. CI does not upload coverage, bundles, logs, snapshots, or source maps, avoiding unnecessary retention of potentially sensitive output. A future artifact addition must declare purpose, redaction, access, and retention.

## Flakes and retries

Tests and builds do not retry automatically. Retrying deterministic failures would hide state leakage and nondeterminism. Any quarantine must follow [`FLAKY_TEST_AND_QUARANTINE_POLICY.md`](./FLAKY_TEST_AND_QUARANTINE_POLICY.md); the current quarantine register is empty.

Network calls in product code require bounded retry, cancellation, jitter, and idempotency analysis where applicable. Dependency advisory lookup is intentionally a separate scheduled/PR authority job because it is the only baseline step that depends on current registry state.

## Completion evidence

Phase 0G closes only after:

1. immutable installation succeeds;
2. all six canonical jobs pass locally where reproducible;
3. production and development builds succeed;
4. every affected authority inventory is regenerated and its mutation tests pass;
5. the branch is published and all GitHub checks on the Phase 0G PR are green;
6. required-check and branch-protection status is verified directly or explicitly recorded as an external repository-setting limitation.
