# Telemetry and Secret Exposure Matrix

Status: **Phase 0E complete / executable**

Last verified: 2026-07-25

The row-level authority is `config/sentry-authority-inventory.json`. It currently classifies 131 callsites across console diagnostics, build environment reads, browser notifications, clipboard handling, error boundaries, developer tooling, source-map configuration, and CI artifact upload. Telemetry-capture callsites are zero.

| Surface | Potential data | Phase 0E boundary | Retention / deletion |
|---|---|---|---|
| Sentry and remote telemetry | errors, URLs, identity, request metadata, private content | Dependencies, DSN, initialization and capture absent; drift fails CI | No collection or remote retention |
| Application console | errors, server objects, streaming events, account data | Production dynamic output disabled; development arguments redacted before serialization | Browser-local and ephemeral |
| Error boundary | thrown error and React component stack | Raw detail visible only outside production; no transmission | Component memory until reload/reset |
| Network/Axios errors | headers, bodies, URLs, tokens, responses | No remote capture; development console is recursively redacted and bounded | Browser-local and ephemeral |
| Redux DevTools | actions, auth state, entity/private state | Disabled when `NODE_ENV === 'production'` | Development-tool policy only |
| React Query DevTools | keys, cached data, errors | No runtime DevTools component discovered | None |
| Service workers/notifications | action token, URL, post metadata | No diagnostic capture; sensitive persistence/revocation remains governed by Phase 0C | Phase 0C purge contract |
| URLs and query strings | OAuth codes, tokens, private routes | Diagnostics strip URL credentials, query, and fragment; navigation policy is Phase 0D | No telemetry copy |
| Build environment | build paths, backend URL, mode | Webpack exposes only `NODE_ENV`; former `SENTRY_DSN` input removed | Build process only |
| Production source maps | source code and embedded build values | `devtool: false`; `.map` excluded from offline cache | Not generated |
| CI artifact | architecture inventory paths/counts | Static source metadata only; no runtime/user content or environment dump | GitHub retention: 30 days |
| Tests and fixtures | deterministic fake API/account data | Classified separately; no upload workflow for fixtures, snapshots, coverage, or Jest output | Runner workspace only |
| Clipboard/support | pasted files and development error detail | Clipboard-data access is local; no automatic remote support submission | Browser event lifetime |

Forbidden diagnostics include bearer tokens, authorization/cookie headers, secrets, passwords, MFA/OTP values, OAuth codes, sessions, bodies, drafts, direct messages, private content, search history, and sensitive URL parameters.

Redaction occurs before development console serialization. Getter-only properties are replaced, cycles are marked, oversized structures are truncated, and inspection failure returns `[REDACTED]`. Production diagnostics are dropped; no path falls back to the original value.
