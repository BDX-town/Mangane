# Bootstrap and Root Provider Authority Drift Gate

Status: **Current / bounded Phase 0 evidence**

This gate records and enforces the inherited application startup and root-provider boundary. It does not endorse the current bootstrap as the final Mangane architecture.

## Verified ownership

- `app/application.ts` owns manifest/image/style loading, polyfill startup and deferred loading of `app/soapbox/main`.
- `app/soapbox/main.tsx` owns DOM readiness, the `soapbox` mount target, React 17 mounting and service-worker runtime installation.
- `app/soapbox/containers/soapbox.tsx` owns module-level initialization, initial backend loading and the root provider hierarchy.

## Pinned startup sequence

1. The application loads its manifest and styles.
2. Polyfills complete before the main module is required.
3. The main module waits for `ready()`.
4. React mounts `<Soapbox />` into `#soapbox`.
5. Module initialization creates developer globals, preloads state and checks onboarding in that order.
6. The root provider hierarchy remains Redux Provider → QueryClientProvider → SoapboxHead → SoapboxLoad → SoapboxMount.
7. Initial backend loading fetches authenticated identity before instance capabilities and Soapbox configuration.
8. Optional verification configuration loads only when Pepe verification is enabled and no authenticated account exists.

## Current failure behavior

The gate intentionally records current behavior that later phases must reconcile:

- polyfill rejection is written to the browser console and does not produce a structured recovery surface;
- a missing mount element has no explicit fail-closed handling;
- initial backend-load rejection still marks the loader complete, allowing partial state to render;
- locale import rejection is swallowed while `localeLoading` remains true, which can leave the application permanently loading;
- module-level initialization side effects have no teardown contract;
- startup requests do not expose cancellation or stale-response protection.

A passing gate means only that these inherited contracts have not drifted silently.

## Security and reliability blockers

Before the provider and startup architecture can be treated as production-ready, later phases must provide:

- explicit bootstrap error classes and a user-visible recovery path;
- mount-target validation;
- cancellable, generation-bound initial requests that cannot repopulate stale account or instance state;
- deterministic account-switch and teardown behavior;
- locale fallback behavior that cannot deadlock startup;
- removal or containment of module-import side effects;
- React 18/concurrent-rendering compatibility evidence;
- tests proving root error coverage before and after mount.

## Enforcement

`node scripts/check-bootstrap-provider-authority-inventory.js` validates the manifest and exact source-backed startup contracts. Focused adversarial tests run with Node's built-in test runner. The dedicated workflow and the broader Architecture inventory workflow both execute the gate with read-only permissions.

Any intentional change must update code, tests, the manifest and this document in the same pull request. Unknowns may only be removed when replacement evidence and the later-phase contract are committed together.
