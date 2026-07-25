# Error Boundary and Emergency Recovery Authority Drift Gate

Status: **Current / bounded Phase 0 evidence**

This gate records the mounted-application error boundary and the bounded emergency browser-data recovery path. It does not claim that recovery is account-scoped or safe against browser termination at every stage.

## Verified ownership

- `app/soapbox/components/error_boundary.tsx` owns mounted React render-error capture, the fallback screen and development-only diagnostics, then delegates emergency clearing to `app/soapbox/persistence/emergency-reset.ts`.
- `app/soapbox/persistence/emergency-reset.ts` owns bounded origin-wide query, storage, cache, notification and worker cleanup plus recovery navigation.
- `app/soapbox/persistence/bounded-step.ts` owns the shared completed, failed and timed-out step-result contract used by account purge and emergency reset.
- `app/soapbox/storage/kv_store.ts` owns the `soapbox` localForage IndexedDB store named `keyvaluepairs`.
- `app/soapbox/containers/soapbox.tsx` places `ErrorBoundary` inside the root providers and outside `BrowserRouter`.

## Current behavior

`componentDidCatch` records the thrown error and component stack, then asynchronously loads Bowser. Production suppresses the error text and browser details. Development exposes error plus component-stack text in a selectable textarea and copies through `document.execCommand('copy')`.

The user-facing emergency action now:

1. always prevents the reset link's default navigation;
2. cancels and clears the global React Query client;
3. clears origin `localStorage`, `sessionStorage` and the configured localForage/IndexedDB store;
4. deletes every visible Cache Storage entry;
5. closes native notifications, unsubscribes push and unregisters every visible service-worker registration;
6. repeats the authoritative storage clearing after asynchronous worker/cache cleanup to remove late writes;
7. navigates through the configured frontend basename.

Every stage is awaited, time-bounded and failure-isolated. The sanitized report contains only step names and completed, failed or timed-out status. The action is still labeled as clearing cookies and browser data, but it does not explicitly expire cookies.

## Security and reliability boundary

A passing gate does **not** prove interruption-proof sensitive-state purge. Bootstrap failures before React mount are outside this boundary. A timed-out browser operation may continue after navigation, browser termination may interrupt the final pass, object URLs created outside the required tracked registry cannot be enumerated by browser APIs, and origin-wide clearing is deliberately broader than account/instance removal.

Non-production diagnostics may contain private content in error messages or component stacks. Later observability work must establish redaction before any remote capture or sharing.

## Required later remediation

- replace the misleading clear-cookies wording with an exact, tested recovery contract;
- provide durable recovery journaling that can resume an interrupted origin reset before ordinary hydration;
- verify worker, notification, Cache Storage and IndexedDB behavior in real browsers;
- bind recovery to account, instance, deployment, and storage-schema generations;
- provide pre-mount bootstrap recovery;
- replace deprecated copy behavior with an accessible Clipboard API path and explicit failure feedback;
- add adversarial tests proving no stale response or worker can repopulate cleared state.

## Enforcement

`node scripts/check-error-recovery-authority-inventory.js` validates every manifest field and executable source evidence after comments are removed. Focused dependency-free tests prove inert evidence, purge drift, awaited IndexedDB cleanup, root-boundary removal, navigation drift, and blocker removal fail closed. Jest tests prove ordering, failure isolation, timeouts, final-pass cleanup and concurrent-reset deduplication. The dedicated workflow and Architecture inventory workflow both run with read-only permissions.
