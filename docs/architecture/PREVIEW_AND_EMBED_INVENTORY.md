# Preview and Embed Inventory

Status: **Phase 0D complete**

| Surface | Source | Policy |
|---|---|---|
| Status link card title, description, provider and image | Backend card metadata derived from remote pages | Text is rendered through React escaping; URLs are centrally classified. |
| Status card video/provider HTML | Remote `card.html` | Raw execution is blocked. The UI exposes a hardened external provider link instead. |
| External-video attachment carrying card HTML | Federated status/card payload | Uses the same blocked card renderer; no direct `dangerouslySetInnerHTML`. |
| Embed modal `/api/oembed` response | Local backend response for a requested status URL | HTML is sanitized, placed in empty-sandbox `srcDoc`, and cannot use scripts, same-origin privileges, nested frames, CSS, SVG or MathML. |
| Media captions/descriptions | Federated attachment text | React text nodes and component props; no HTML execution. |
| Preview images and media | Remote card/attachment URLs | HTTP/HTTPS destination policy; browser CSP remains defense in depth. |

No production oEmbed surface uses `document.write`. No sanitized rich-text policy permits `iframe`, `object`, `embed`, SVG or MathML.
