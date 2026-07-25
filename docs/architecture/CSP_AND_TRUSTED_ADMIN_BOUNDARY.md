# CSP and Trusted Administrator Boundary

Status: **Phase 0D complete**

Administrator privileges authorize content configuration; they do not bypass browser content safety. About/mobile pages, footer messages, home descriptions, announcements, branding URLs and other administrator-controlled values remain sanitized or URL-classified because a compromised account, imported configuration or upstream instance response can still be adversarial.

## CSP contract

The recommended proxy policy uses `default-src 'none'`, `script-src 'self'`, `object-src 'none'`, `base-uri 'none'`, `frame-ancestors 'none'`, and `form-action 'self'`. Images and media permit the documented remote schemes. The only application iframe is a sanitized empty-sandbox `srcDoc` preview.

Inline React style properties and existing stylesheets currently require `style-src 'self' 'unsafe-inline'`. Therefore CSP is defense in depth and not the CSS sanitization boundary; remote HTML style attributes and style elements are removed regardless of deployment headers.

CSP is delivered by the deployment proxy, not by the JavaScript bundle. Operators who replace the example proxy configuration own that deployment control. Runtime sanitization never assumes CSP is present.

## Trusted administrator rule

- Administrator-authored markup receives the same sanitizer as remote rich text.
- Administrator URLs receive the central destination classifier.
- Server/provider HTML is never trusted because it came through an authenticated endpoint.
- Sanitizer configuration cannot be relaxed through instance configuration.
- Raw scripts, styles, SVG, MathML, frames, forms and custom embed code require a later architecture review rather than an administrator opt-out.
