# Error Boundary and Emergency Recovery Authority Drift Gate

Status: **Current / bounded Phase 0 evidence**

This gate records the inherited mounted-application error boundary and emergency browser-data recovery path. It does not claim that recovery is complete, scoped, private, or safe for every deployment.

## Verified ownership

- `app/soapbox/components/error_boundary.tsx` owns mounted React render-error capture, the fallback screen, development-only diagnostics, browser-data clearing, service-worker unregistration, and return-home navigation.
- `app/soapbox/storage/kv_store.ts` owns the `soapbox` localForage IndexedDB store named `keyvaluepairs`.
- `app/soapbox/containers/soapbox.tsx` places `ErrorBoundary` inside the root providers and outside `BrowserRouter`.

## Current behavior

`componentDidCatch` records the thrown error and component stack, then asynchronously loads Bowser. Production suppresses the error text and browser details. Development exposes error plus component-stack text in a selectable textarea and copies through `document.execCommand('copy')`.

The user-facing emergency action currently:

1. synchronously clears all `localStorage` and `sessionStorage` for the origin;
2. invokes `KVStore.clear()` without awaiting or observing its result;
3. only prevents the link's default navigation when service workers are supported;
4. attempts to unregister every service-worker registration;
5. navigates to `/` whether unregistration succeeds or fails.

The action is labeled as clearing cookies and browser data, but this source does not explicitly clear cookies or Cache Storage.

## Security and reliability boundary

A passing gate does **not** prove deterministic sensitive-state purge. Bootstrap failures before React mount are outside this boundary. IndexedDB clearing can race navigation, Cache Storage is not explicitly cleared, service-worker failures are collapsed into navigation, and origin-wide storage clearing is not account- or instance-scoped.

The hard-coded `/` destination also does not honor `FE_SUBDIRECTORY`, so subdirectory deployments require explicit recovery conformance.

Non-production diagnostics may contain private content in error messages or component stacks. Later observability work must establish redaction before any remote capture or sharing.

## Required later remediation

- replace the misleading clear-cookies wording with an exact, tested recovery contract;
- await and verify all asynchronous purge operations;
- enumerate and clear the required Cache Storage, worker, notification, query-cache, Redux, object-URL, and persistent-store surfaces;
- bind recovery to account, instance, deployment, and storage-schema generations;
- use basename-aware navigation and define rollback behavior;
- provide pre-mount bootstrap recovery;
- replace deprecated copy behavior with an accessible Clipboard API path and explicit failure feedback;
- add adversarial tests proving no stale response or worker can repopulate cleared state.

## Enforcement

`node scripts/check-error-recovery-authority-inventory.js` validates every manifest field and executable source evidence after comments are removed. Focused dependency-free tests prove inert evidence, purge drift, root-boundary removal, navigation drift, and blocker removal fail closed. The dedicated workflow and Architecture inventory workflow both run with read-only permissions.
