# URL and Destination Policy Matrix

Status: **Phase 0D complete**

| Destination | Accepted values | Rejected values | Enforcement |
|---|---|---|---|
| Sanitized HTML links | Relative URLs; HTTP; HTTPS; mail; telephone | JavaScript, VBScript, data, blob, file, control characters, whitespace-obfuscated schemes and overlong values | `sanitizeUrl(..., 'navigation')` through DOMPurify hooks |
| Sanitized media sources | Relative URLs; HTTP; HTTPS | All non-HTTP schemes, including data and blob | `sanitizeUrl(..., 'media')` |
| Post-login/registration continuation | Same-origin relative path, query and fragment | Absolute URLs, protocol-relative URLs, malformed encoding and non-web schemes | `sanitizeRedirectPath()`; fail closed to `/` |
| OAuth provider navigation | Valid HTTP/HTTPS backend destination | Invalid, non-web or ambiguous destination | `sanitizeUrl()` before `window.location.assign()` |
| Remote interaction and custom registration | Valid HTTP/HTTPS destination | Invalid or dangerous schemes | `sanitizeUrl()` before `window.open(..., 'noopener,noreferrer')` |
| Preview/provider links | Valid classified navigation URL | Invalid URL produces no navigable `href` | `sanitizeUrl()` in the card renderer |
| Build-time backend URL | HTTP or HTTPS URL | Other protocols and malformed input | `build_config.js` protocol allowlist |
| React Router routes | Repository-defined local routes | External destinations | Router configuration; continuation paths receive the stricter redirect policy |
| Native dynamic anchors | Navigation-policy values above | Dangerous, malformed, whitespace-obfuscated and overlong destinations | Startup-installed capture guard blocks click/auxclick synchronously; `MutationObserver` removes unsafe dynamic `href` values and hardens new-tab relations |

The generated manifest inventories dynamic `href` expressions and imperative navigation. Every native dynamic anchor is governed by the central runtime policy in addition to callsite-specific validation. A URL parser or `new URL()` call alone is not an allowlist.
