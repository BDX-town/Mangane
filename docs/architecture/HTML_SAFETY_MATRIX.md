# HTML Safety Matrix

Status: **Phase 0D complete / executable**

Last verified: 2026-07-25

## Authority

The row-level source of truth is [`config/html-safety-authority-inventory.json`](../../config/html-safety-authority-inventory.json). It is generated from production source and currently classifies 157 callsites: 44 React HTML sinks, 43 dynamic link destinations, nine imperative navigations, five parser uses, three DOM writes, two iframe boundaries, and 51 calls into the sanitizer boundary.

`scripts/check-html-safety-authority-inventory.js` regenerates the model in memory and fails on any unreviewed sink, parser/write surface, iframe, sanitizer-policy change, or line-level inventory drift.

## Rendering matrix

| Surface family | Origin and trust | Transformation chain | Security boundary | Sink and behavior | Tests |
|---|---|---|---|---|---|
| Status bodies, quotes, replies, conversations, edits and translations | Federated remote-user HTML; untrusted | `emojify` and optional compatibility/greentext transforms | DOMPurify 3.4.12 at state normalization and again at principal sinks | React `dangerouslySetInnerHTML`; HTML profile only; links hardened | malformed markup, handlers, encoded schemes, SVG/MathML and sanitizer regression corpus |
| Content warnings and poll labels | Federated remote-user text plus emoji markup; untrusted | escape text, then `emojify` | DOMPurify inline policy at normalization and sink | Inline-only tags; no data attributes or CSS | inline-policy and emoji-normalizer tests |
| Account names, bios and fields | Remote-user account/profile HTML; untrusted | escaped display names or server bio/field HTML, then `emojify` | DOMPurify at account normalization; shared `Text`/`Permalink` components sanitize again | React HTML sinks; verified links receive `nofollow noopener noreferrer ugc` | account normalizer and adversarial corpus |
| Announcements and notification-associated content | Instance administrator or federated entity HTML; privileged but untrusted | `emojify` | DOMPurify at announcement normalization and sink | React HTML sink | announcement tests and adversarial corpus |
| About/mobile pages and configurable footer/home HTML | Local administrator-authored files/config; trusted role, untrusted markup | Fetch/config interpolation; optional `emojify` | DOMPurify at the render sink | Rich or inline HTML policy; scripts, forms, frames and style removed | adversarial corpus |
| Onboarding localized rich text | Repository/localization supply chain; reviewed but not inherently safe | `react-intl` formatting | DOMPurify inline policy | Inline React HTML sink | adversarial corpus |
| Reports and feed suggestions | Remote-user plain text; untrusted | None | HTML rendering removed | React text nodes only | full Jest suite |
| Link preview metadata and dynamic anchors | Remote third-party/backend/config metadata; untrusted | Text trimming and attachment normalization | React text escaping plus centralized URL classification; document capture and mutation guard for native anchors | Text/image/link attributes; unsafe navigation is synchronously blocked and unsafe dynamic `href` values are removed | URL and navigation-policy tests |
| Preview-card HTML | Remote oEmbed/provider HTML; untrusted | Former iframe parser/autoplay mutation removed | **Blocked** | Raw `card.html` is never inserted; the user gets a hardened provider link | sink-discovery gate |
| oEmbed preview modal | Local backend response containing embed HTML; untrusted | DOMPurify rich policy | Empty-sandbox `srcDoc`; scripts, nested iframes, SVG/MathML and CSS removed | Sandboxed iframe; no `document.write`, no same-origin capability | drift gate and adversarial corpus |
| Plaintext/compatibility helpers | Arbitrary HTML; untrusted | Browser inert parsing, text extraction or narrow node removal | **Not sanitizers**; callers must sanitize later or consume text only | `innerHTML`/`DOMParser` in four explicitly classified modules | test proving compatibility transformer preserves scripts |

## Sanitizer policy

- Package: `dompurify` exactly `3.4.12`.
- Rich content uses the HTML profile only.
- Forbidden tags include `script`, `style`, `svg`, `math`, `iframe`, `object`, `embed`, `form`, `template`, `base`, `link`, and `meta`.
- Forbidden attributes include `style`, `srcdoc`, `srcset`, `formaction`, `xlink:href`, `xmlns`, `ping`, and form binding.
- HTML event attributes are removed by DOMPurify.
- Link destinations allow HTTP, HTTPS, mail and telephone schemes.
- Media attributes allow only HTTP and HTTPS.
- Blob, data, file, JavaScript and VBScript schemes are blocked in sanitized HTML.
- Sanitized anchors receive `target="_blank"` and `rel="nofollow noopener noreferrer ugc"`.
- Native anchors are rechecked synchronously on click/auxclick and by a `MutationObserver`; unsafe destinations lose `href`, while `_blank` destinations receive `nofollow noopener noreferrer`.
- Inline content has a smaller tag allowlist and does not permit data attributes.

Transformation helpers such as `emojify`, `addGreentext`, `unescapeHTML`, and `stripCompatibilityFeatures` are not security boundaries.

## Completion evidence

- Every production HTML sink is represented in the generated manifest.
- Every executable HTML sink is sanitized, routed through a sanitizing shared component, or blocked.
- CSS, SVG, MathML, iframe and namespace behavior is explicit.
- URL, redirect, and native-anchor runtime policy is centralized.
- New raw sinks and DOM writes fail CI.
- The adversarial corpus exercises malformed markup, handler attributes, dangerous/encoded schemes, namespaces, CSS, SVG, MathML, forms, templates and iframe payloads.
