# Share Target Authority Drift Gate

Status: **Current / bounded Phase 0 evidence**

This gate pins the verified inherited behavior of `app/soapbox/service_worker/share_target.js` and its development registration in `app/soapbox/main.tsx`.

The current worker:

- listens for service-worker `fetch` events;
- classifies requests using `POST` plus URL substring matching rather than an exact origin and pathname contract;
- reads `name`, `description`, and `link` from `request.formData()`;
- concatenates those fields into compose text;
- stores that text in a `URLSearchParams` value;
- returns a `303` redirect to `/statuses/compose?text=...`;
- is registered directly as `/share_target.js` with root scope during development.

A passing gate does **not** mean this worker is safe or accepted target architecture. It records the current boundary so routing, accepted fields, text construction, and redirect behavior cannot silently drift while Phase 4 replacement work remains blocked.

The existing implementation has unbounded form parsing and redirect construction. It does not establish total request size, field length, parameter count, redirect URL length, content-type validation, exact origin/path ownership, deterministic malformed-form behavior, or safe temporary storage.

Shared values must remain inert compose text throughout decoding, routing, composer initialization, preview handling, rendering, and submission. A shared link must not gain trust merely because it entered through the platform share sheet.

Future file sharing requires a separate bounded storage contract covering MIME type, file size, filename normalization, metadata stripping, quota behavior, object URL lifetime, account and instance scope, one-time consumption, cleanup, and failure recovery.

The gate also leaves these matters explicitly unresolved:

- production service-worker bundling and manifest ownership;
- `FE_SUBDIRECTORY` and production rewrite behavior;
- downstream URL preview and navigation policy;
- malformed multipart and unsupported content-type handling;
- exact deployment behavior across proxy-backed and subdirectory installations.

Run the checker with:

```sh
node scripts/check-share-target-authority-inventory.js
node --test scripts/__tests__/check-share-target-authority-inventory.test.js
```
