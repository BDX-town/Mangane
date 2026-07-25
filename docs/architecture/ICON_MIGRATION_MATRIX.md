# Icon Migration Matrix

Status: **Phase 0F complete / executable**

The exhaustive callsite matrix is `config/design-component-authority-inventory.json` under `icons`. Each record includes source path, line, provider, symbol, and disposition.

| Current source | Current use | Disposition | Migration requirement |
|---|---|---|---|
| `@tabler/icons/*.svg` | SVG modules through `Icon`/`SvgIcon` | Phosphor migration candidate | Map by meaning, not filename; preserve label and decorative semantics |
| named `@tabler/icons` exports | direct React icon components | Phosphor migration candidate | Move behind the canonical adapter before changing provider |
| repository SVG assets | brand, product, and custom imagery | retain/custom-asset review | Do not substitute branded or semantically unique assets automatically |
| Line Awesome string props | legacy `Icon` and `Column` identifiers | Phosphor migration candidate | Replace string lookup through an exhaustive typed mapping |
| icon renderers/buttons | four overlapping component paths | migration adapter required | Preserve size, stroke, RTL, disabled, focus, title, and hit target behavior |

No provider may be removed until the generated count reaches zero for that provider and visual/accessible-name baselines pass. Dynamic icon configuration is untrusted presentation data: unknown values must fall back to a bounded non-executable icon, never markup or a remote script.
