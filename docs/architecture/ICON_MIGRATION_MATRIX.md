# Icon Migration Matrix

Status: **Semantic authority complete / surface migration active**

The exhaustive production callsite matrix is
`config/design-component-authority-inventory.json` under `icons`. Each record
includes source path, line, provider, symbol, and disposition.
`config/icon-migration-baseline.json` separately records every raw import,
including tests and styles, so new raw provider imports fail closed.

Phase 2B completed the icon authority, adapter, safety contract, and shrinking
baseline. It did not claim repository-wide provider replacement. Actual icon
migration follows the owning presentation phases so semantics, active states,
accessible names, layout, and rollback are reviewed with the surface that uses
them.

| Provider/source | Current use | Disposition | Migration requirement |
|---|---|---|---|
| `@phosphor-icons/react` | Canonical typed React components | Retain only inside `semantic-icon-registry.ts` | Product consumers request semantic names through `SemanticIcon` |
| Framework7 `iconF7` strings | Provider-specific shell icon names | Prohibited in Mangane-owned shell navigation | Use `SemanticIcon` children and semantic selected weights |
| `@tabler/icons/*.svg` | SVG modules through `Icon`/`SvgIcon` | Phosphor migration candidate | Map by meaning, not filename; preserve label and decorative semantics |
| named `@tabler/icons` exports | direct React icon components | Phosphor migration candidate | Move behind the canonical adapter before changing provider |
| Bootstrap Icons | Installed with no verified production callsite | Removal candidate, verification required | Do not remove until dependency and build evidence confirms zero runtime use |
| Feather Icons | Installed with no verified production callsite | Removal candidate, verification required | Do not remove until dependency and build evidence confirms zero runtime use |
| repository SVG assets | brand, product, and custom imagery | retain/custom-asset review | Do not substitute branded or semantically unique assets automatically |
| Cryptocurrency Icons | Specialized repository-style asset imports | Retain/custom-asset review | Keep outside product affordance mapping unless an equivalent branded asset is approved |
| Line Awesome string props | legacy `Icon` and `Column` identifiers | Phosphor migration candidate | Replace string lookup through an exhaustive typed mapping |
| icon renderers/buttons | overlapping compatibility paths | migration adapter required | Preserve size, stroke, RTL, disabled, focus, title, and hit target behavior |

The accepted product semantics currently include `home`, `explore`, `local`,
`compose`, `notifications`, `profile`, `search`, `settings`, `lists`,
`hybrid-search`, `gist`, `topic`, `entity`, `context`, `semantic-filter`,
`interpolator`, `local-intelligence`, `why-this-result`, `reply`, `repost`,
`like`, `bookmark`, and `share`. Bounded foundation states add `success`,
`pending`, and `question`.

New semantics are added only by an owning feature slice with tests. A semantic
name is a product contract, not a synonym for a provider filename.

## Migration order

1. Framework7 shell navigation and shell-owned recovery controls.
2. Phase 8 feed cards, primary navigation, engagement actions, and active states.
3. Phase 9 conversation branches, focused path, chronology, and reader controls.
4. Phase 10 composer, article, formatted-note, authored-sequence, and recovery controls.
5. Search, Explore, notifications, profiles, settings, administration, and lower-use legacy screens through their owning phases.
6. Remove legacy renderers and dependencies only after generated zero-use evidence and visual/accessibility parity.

## Removal and rollback gates

No provider may be removed until its generated production and raw-import counts
reach zero and visual/accessible-name baselines pass. Dynamic icon
configuration is untrusted presentation data: unknown values must fall back to
a bounded non-executable local icon, never markup, a URL, or a remote script.

A migration PR must keep the previous path revertible, update the generated
inventories, test decorative and meaningful semantics, test selected state where
applicable, and avoid mixing unrelated surfaces merely to reduce a global count.
