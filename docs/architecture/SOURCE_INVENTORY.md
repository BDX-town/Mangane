# Mangane Verified Source Architecture Inventory

Status: **Current / Phase 0 in progress**

Last updated: 2026-07-23

This inventory records source-level findings verified directly from the repository. It complements `CURRENT_STATE.md` and the specialized security, authentication, content-safety and evidence-gate documents.

## 1. Application bootstrap

- webpack entry: `app/application.ts`;
- React mount: `app/soapbox/main.tsx` using React 17 `ReactDOM.render`;
- production service-worker update flow through `@lcdp/offline-plugin/runtime`;
- development share-target worker registration differs from production behavior.

## 2. Root provider hierarchy

The verified root hierarchy is:

```text
Redux Provider
  -> React Query QueryClientProvider
    -> head/theme/metadata
      -> initial data loading
        -> router/application
```

Startup loads account identity, instance/capability data, application configuration and optional verification configuration. Rendering can proceed after rejected initial loading, so downstream surfaces must tolerate partial state.

## 3. Routing

The application uses React Router 5 with BrowserRouter, Switch, Redirect, scroll restoration and a large centralized route matrix.

The route surface includes timelines, conversations, hashtags, lists, bookmarks, notifications, search, moderation, profiles, composer, scheduled posts, settings, administration, migration and legacy Mastodon/Pleroma/Gab/Soapbox compatibility paths.

Phase 3 requires a generated or audited route manifest; a small replacement route list would be unsafe.

## 4. Redux

The Redux root contains more than fifty domains spanning remote entities, session state, configuration, moderation, publishing and transient UI state.

On logout, most state is rebuilt while `instance`, `soapbox`, `custom_emojis` and `auth` are preserved at the root. The auth reducer separately removes the selected account and associated token records.

Redux logout does not prove React Query, browser persistence, service-worker caches, notifications, streams or media are purged.

## 5. React Query

One global QueryClient uses:

- `refetchOnWindowFocus: false`;
- one-minute stale time;
- infinite cache lifetime.

The executable full-tree gate currently records three direct query modules plus logout cancellation/clear. Aliased imports, wrappers, dynamic access, mutations, account/instance key scope and late-response fencing remain open.

## 6. Authentication and persistence

Verified authentication modules implement:

- OAuth app registration;
- client-credentials application token;
- password-grant user token;
- refresh action with an unresolved state-shape mismatch;
- MFA challenge;
- credential verification;
- multi-account switching;
- token revocation and logout.

The auth reducer persists the full authentication graph in localStorage, persists selected account identity in sessionStorage, migrates legacy keys and stores account snapshots through localForage IndexedDB.

## 7. API client

The shared Axios factory:

- attaches bearer credentials when present;
- permits configured `BACKEND_URL` to override account-derived origin after a broad URL check;
- parses JSON permissively;
- provides Link-header pagination helpers.

It does not centrally guarantee timeout, bounded response size, retry/backoff, cancellation, typed errors, rate-limit behavior, redirect policy, content-type enforcement or account/destination assertions.

## 8. Service worker and workers

The production service worker uses an inherited global cache name and custom push/share handlers.

### Push

Verified push behavior includes:

- bearer token accepted from push payload;
- authenticated notification fetch;
- bearer token retained in notification data;
- later favourite/repost actions using the retained token;
- grouped notifications and content-warning expansion.

### Share target

Verified share-target behavior includes:

- substring matching for `/share` POST requests;
- unbounded form-field reads;
- compose redirect carrying generated text in a query parameter.

## 9. HTML and content transformation

`app/soapbox/utils/html.ts` contains shared helpers that assign strings through detached-element `innerHTML`.

These helpers strip or alter markup but do not define a full sanitizer policy. Every rendering sink and caller remains to be inventoried.

## 10. Theme, accessibility and interaction

Verified inherited behavior includes:

- document language;
- dark mode and generated theme variables;
- reduced motion;
- underlined links;
- dyslexic font;
- demetrication;
- broad keyboard shortcuts;
- legacy deep-link and history behavior.

These are compatibility requirements for Framework7 and design-system work.

## 11. Test harness

The package scripts provide Jest, coverage, ESLint, Stylelint and webpack build commands.

Jest runs in jsdom and excludes the service-worker entry from coverage. Dedicated browser, accessibility, worker-security, dependency-audit, license and migration scripts are not established by the package manifest.

## 12. Subsystem status

| Subsystem | Status | Target handling |
|---|---|---|
| Bootstrap/providers | substantial inventory | split behind stable boundaries |
| Routing | partial inventory | manifest and Framework7 bridge |
| Redux | partial inventory | authority matrix and adapters |
| React Query | blocked | complete key and scope inventory |
| Authentication | substantial inventory | AccountScope and credential provider |
| Browser persistence | Phase 0C generated manifest and behavioral authority complete | preserve versioned lifecycle, scoped cleanup and deterministic purge during migrations |
| API client | shared client verified | typed transport contracts |
| Push/share workers | handlers verified | remove notification tokens and validate inputs |
| HTML safety | transformer boundary verified | sink and sanitizer inventory |
| Theme/accessibility | substantial inventory | preserve through tokens and shell migration |
| Tests/CI | partial inventory | workflow and baseline verification |
| Framework7 | absent/currently unverified | accepted Phase 3 target |
| Phosphor | absent/currently unverified | accepted Phase 2 target |
| Local canonical store | absent/unverified | accepted Phase 5 target |
| Hybrid search | absent/unverified | accepted later target |

## 13. Remaining mandatory inventories

1. complete repository tree and feature list;
2. React Query modules, keys, mutations and invalidations;
3. complete state-authority/duplication matrix;
4. API call sites, streaming, uploads and feature detection;
5. every browser store, cache, object URL and purge path;
6. every HTML sink, sanitizer, redirect, preview and embed;
7. Sentry initialization, consent and redaction;
8. icon, style and component imports;
9. exact CI workflows and baseline outcomes;
10. dependency advisories, reachability and licenses;
11. historical document and prior-requirement mapping;
12. backend capability and route manifests.

No later phase may treat an uncompleted inventory as settled.
