# Icon Migration Matrix

Status: **Phase 2B in progress / executable**

The exhaustive production callsite matrix is
`config/design-component-authority-inventory.json` under `icons`. Each record
includes source path, line, provider, symbol, and disposition.
`config/icon-migration-baseline.json` separately records every raw import,
including tests and styles, so new raw provider imports fail closed.

| Provider/source | Current use | Disposition | Migration requirement |
|---|---|---|---|
| `@phosphor-icons/react` | Canonical typed React components | Retain only inside `semantic-icon-registry.ts` | Product consumers request semantic names through `SemanticIcon` |
| `@tabler/icons/*.svg` | SVG modules through `Icon`/`SvgIcon` | Phosphor migration candidate | Map by meaning, not filename; preserve label and decorative semantics |
| named `@tabler/icons` exports | direct React icon components | Phosphor migration candidate | Move behind the canonical adapter before changing provider |
| Bootstrap Icons | Installed with no verified production callsite | Removal candidate, verification required | Do not remove until dependency and build evidence confirms zero runtime use |
| Feather Icons | Installed with no verified production callsite | Removal candidate, verification required | Do not remove until dependency and build evidence confirms zero runtime use |
| repository SVG assets | brand, product, and custom imagery | retain/custom-asset review | Do not substitute branded or semantically unique assets automatically |
| Cryptocurrency Icons | Specialized repository-style asset imports | Retain/custom-asset review | Keep outside product affordance mapping unless an equivalent branded asset is approved |
| Line Awesome string props | legacy `Icon` and `Column` identifiers | Phosphor migration candidate | Replace string lookup through an exhaustive typed mapping |
| icon renderers/buttons | four overlapping component paths | migration adapter required | Preserve size, stroke, RTL, disabled, focus, title, and hit target behavior |

The accepted product semantics are `home`, `explore`, `compose`,
`notifications`, `profile`, `search`, `hybrid-search`, `gist`, `topic`,
`entity`, `context`, `semantic-filter`, `interpolator`,
`local-intelligence`, `why-this-result`, `reply`, `repost`, `like`,
`bookmark`, and `share`. Bounded foundation states add `success`, `pending`,
and `question`.

No provider may be removed until its generated production and raw-import counts
reach zero and visual/accessible-name baselines pass. Dynamic icon
configuration is untrusted presentation data: unknown values must fall back to
a bounded non-executable local icon, never markup, a URL, or a remote script.
