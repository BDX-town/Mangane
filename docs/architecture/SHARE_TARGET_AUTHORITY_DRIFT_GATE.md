# Share Target Authority Drift Gate

Status: **Current / Phase 0G hardened and behavior-tested**

This gate pins the verified inherited behavior of `app/soapbox/service_worker/share_target.js` and its development registration in `app/soapbox/main.tsx`.

The current worker:

- listens for service-worker `fetch` events;
- accepts only same-origin `POST /share` requests using exact origin and pathname checks;
- accepts only URL-encoded or multipart form content;
- reads `name`, `description`, and `link` from `request.formData()`;
- strips NUL bytes and bounds each accepted string before constructing a redirect;
- rejects declared payloads over 16 KiB, unsupported content types, and malformed form data;
- concatenates those fields into compose text;
- stores that text in a `URLSearchParams` value;
- returns a `303` redirect to `/statuses/compose?text=...`;
- is registered directly as `/share_target.js` with root scope during development.

A passing gate proves the listed routing, input-bounding, failure, and redirect behaviors through both adversarial drift checks and behavioral worker tests. It does not make shared URLs trusted or authorize file sharing.

Browsers do not guarantee that `Content-Length` is exposed to service workers, so an undeclared multipart body remains platform-controlled while parsing. The accepted text extracted from that body is bounded to 256 characters for the name, 4,096 for the description, and 2,048 for the link. The resulting redirect is therefore bounded indirectly; deployment-specific proxy URL limits remain unverified.

Shared values must remain inert compose text throughout decoding, routing, composer initialization, preview handling, rendering, and submission. A shared link must not gain trust merely because it entered through the platform share sheet.

Future file sharing requires a separate bounded storage contract covering MIME type, file size, filename normalization, metadata stripping, quota behavior, object URL lifetime, account and instance scope, one-time consumption, cleanup, and failure recovery.

The gate also leaves these matters explicitly unresolved:

- production service-worker bundling and manifest ownership;
- `FE_SUBDIRECTORY` and production rewrite behavior;
- downstream URL preview and navigation policy;
- exact deployment behavior across proxy-backed and subdirectory installations.

Run the checker with:

```sh
node scripts/check-share-target-authority-inventory.js
node --test scripts/__tests__/check-share-target-authority-inventory.test.js scripts/__tests__/share-target-worker.test.js
```
