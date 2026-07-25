# HTML Safety Authority Drift Gate

Status: **Phase 0D verified**

The generated authority manifest inventories every production React HTML sink, DOM HTML write, parser, iframe, sanitizer call, dynamic link destination and imperative navigation under `app/soapbox`.

CI fails when:

- source callsites drift without regenerating the manifest;
- a React HTML sink is not protected by `safeHtml` or a sanitizing shared wrapper;
- a new DOM write/parser appears outside the explicitly inert text/transform modules;
- another iframe surface appears;
- oEmbed returns to `document.write`, loses its empty sandbox, or stops using sanitized `srcDoc`;
- the pinned DOMPurify version or policy evidence changes;
- the sanitizer allows CSS, SVG, MathML, embedded documents, forms or dangerous destination schemes without explicit gate reconciliation.
- startup stops installing the native-link navigation policy, or its capture/observer fail-closed layers are weakened.

The checker is `scripts/check-html-safety-authority-inventory.js`. Its mutation tests are `scripts/__tests__/check-html-safety-authority-inventory.test.js`. Browser adversarial tests live in `app/soapbox/utils/__tests__/html-safety.test.ts`, `url-policy.test.ts`, and `navigation-policy.test.ts`.

`unescapeHTML`, `stripCompatibilityFeatures`, `emojify`, DOM parsing for search text, and compose mention extraction remain classified as transformation or inert parsing—not sanitization.
