# Phase 2 Design Foundation

Status: **In progress**

Last updated: 2026-07-26

## Outcome

Phase 2 establishes one product-language authority before broad presentation
migration. It is intentionally split into independently reviewable slices:

| Slice | Scope | Status |
|---|---|---|
| 2A | Semantic tokens, display modes, compatibility aliases, and drift gates | Complete — [PR 48](https://github.com/outlaw-dame/Mangane/pull/48) |
| 2B | Phosphor dependency, typed semantic icon registry, migration map, and raw-import gate | Complete — [PR 49](https://github.com/outlaw-dame/Mangane/pull/49) |
| 2C | Foundational controls and documented state contracts | Complete — [PR 50](https://github.com/outlaw-dame/Mangane/pull/50) |
| 2D | Automated accessibility harness, cross-engine visual baselines, and manual review evidence | Planned |

Phase 2 is not complete until every roadmap deliverable and exit criterion is
merged, verified in CI, and free of unresolved review findings.

## Visual and interaction direction

Visual thesis: a calm, content-led editorial social system with restrained
surfaces, rigorous spacing, one clear accent, and typography doing more work
than borders or decoration.

Component examples progress from foundation to states, compatibility, and
migration. Motion explains focus, selection, insertion, removal, and spatial
continuity; reduced-motion variants preserve state changes without travel or
delay.

## Slice 2A contract

### Current behavior

Inherited Sass variables, runtime theme custom properties, and Tailwind values
form a documented multi-source authority. Light and dark classes exist, and a
global reduced-motion rule clamps non-essential animation. Increased contrast,
forced colors, semantic product tokens, and Framework7 compatibility variables
do not yet share one contract.

### Target behavior

- `config/design-tokens.json` is the canonical source for typography, spacing,
  radius, elevation, motion, breakpoint, and semantic color values.
- `app/styles/design-tokens.generated.scss` is deterministic generated output
  and may not be edited by hand.
- Tailwind consumes the canonical breakpoint source and exposes additive
  design-system utilities backed by generated custom properties.
- Light, dark, increased-contrast, forced-colors, and reduced-motion modes have
  explicit generated behavior.
- Core foreground/background pairs are checked against WCAG AA contrast
  thresholds.
- Framework7 custom properties alias semantic Mangane tokens. This proves the
  style boundary without importing Framework7 or implementing the Phase 3
  application shell.

### Security and privacy

Token names and values are validated before generation. Values containing CSS
declaration boundaries, at-rules, URLs, expressions, or multiline payloads fail
closed. Framework7 aliases can reference only known semantic Mangane color
tokens. The token source contains no user, account, instance, telemetry, or
credential data.

Instance branding remains on the inherited runtime path during this additive
slice. New semantic colors do not ingest untrusted instance values until a
separate contrast-preserving brand policy is reviewed and tested.

### Migration and rollback

Existing selectors and runtime theme generation remain available. New code may
adopt the `--ds-*` contract and matching Tailwind utilities incrementally.
Rollback is a revert of the generated-token import, Tailwind extensions, and
their source/checker; no persisted data or migration is involved.

### Risks and controls

- Generated/source drift fails `check:design-tokens`.
- Unsafe token input fails schema validation.
- Core contrast regression fails both focused tests and the authority checker.
- Breakpoint drift is shared with Tailwind instead of copied.
- Framework7 scope creep is prevented by aliases without runtime imports.
- Visual equivalence is not inferred from source shape; rendered cross-engine
  baselines remain required in slice 2D.

## Slice 2B contract

### Current behavior

The inherited application has four overlapping icon renderers and 393
production callsites across Tabler, Line Awesome, and repository assets.
Bootstrap Icons and Feather remain installed without verified production
callsites. Product meaning is encoded in provider filenames or font strings,
and direct provider imports are not prevented.

### Target behavior

- `@phosphor-icons/react` is an exact, lockfile-governed runtime dependency.
- `app/soapbox/components/ui/icon/semantic-icon-registry.ts` is the only
  production module allowed to import Phosphor.
- Components request a typed product meaning through `SemanticIcon`, not a
  provider component, filename, remote URL, or arbitrary markup value.
- Unlabelled icons are decorative and hidden from assistive technology.
  Meaningful standalone icons require an explicit accessible label.
- Unknown dynamic configuration fails closed to an allowlisted local fallback;
  it cannot resolve a module, script, URL, or SVG payload.
- `config/icon-migration-baseline.json` records every raw provider import.
  The baseline may shrink through reviewed migrations, but a new raw import or
  unreviewed count change fails CI.
- `ValidationCheckmark` is the bounded runtime proof. Broader component and
  navigation migrations remain separate reviewable work.

### Security and privacy

The registry is a frozen, static mapping of typed names to bundled React
components. Lookup uses an own-property check so values such as `__proto__`
cannot traverse the object prototype. There is no dynamic `require`, remote
fetch, inline SVG string, raw HTML sink, user/account data, telemetry, or
authorization behavior in this slice.

Icons do not replace server authorization or encode confidential state.
Provider updates remain pinned and pass dependency, build, secret-scan, and
review gates before merge.

### Migration and rollback

Legacy renderers and imports remain operational while their reviewed baseline
shrinks. Each migration must map by product meaning, preserve visible state,
accessible names, RTL behavior, size, focus, and hit targets, then reconcile
the generated design inventory and the hand-reviewed import baseline.

Rollback is a revert of the representative consumer, semantic adapter,
dependency, baseline, and CI steps. No persisted data, network contract,
account scope, database, or service-worker state is changed.

### Risks and controls

- Provider mixing is limited by a single Phosphor import boundary and a
  fail-closed raw-import checker.
- Bundle growth is measured by the existing production budget; the package's
  side-effect-free browser ESM entry preserves named-export tree shaking.
- Accessibility semantics are component-tested for decorative and labelled
  icons.
- The Jest adapter exists only because the package's current CommonJS export
  target is empty under the local Node runtime. Production and development
  webpack builds exercise the real browser ESM modules.
- Provider removal is forbidden until its production and raw-import counts are
  zero and visual/accessibility evidence exists.

## Slice 2C contract

### Current behavior

The inherited shared UI layer contains usable buttons, cards, fields, avatars,
and Reach menu primitives, but state behavior is inconsistent. Button links
nest an interactive button inside a link, field errors are not programmatically
associated, raw internal props can reach DOM elements, and the required list
row, chip, segmented control, labelled menu trigger, and safe focus-return
utility do not exist as shared contracts.

### Target behavior

- The public UI layer exposes the nine foundational controls recorded in
  `config/foundational-control-contracts.json`.
- Action, navigation, toggle, selection, radio-group, field-description, image,
  landmark, and menu-disclosure intent use native or established accessible
  semantics.
- Disabled, loading, pressed, selected, error, focus-visible, forced-colors,
  and reduced-motion behavior is explicit and tested where applicable.
- Button and row targets are at least 44px. Focus indication uses the canonical
  semantic focus token and survives forced-colors mode.
- `useFocusReturn` restores focus only to a still-connected captured element.
- [`COMPONENT_STATE_CONTRACTS.md`](./COMPONENT_STATE_CONTRACTS.md) documents
  states, examples, compatibility, migration, security, and rollback.

### Security and privacy

The foundations add no network, persistence, telemetry, authentication,
database, service-worker, or object-authorization behavior. They accept React
content and allowlisted bundled semantic icons, not raw HTML, scripts, remote
icon URLs, or dynamic module names. UI disabled state is not treated as an
authorization boundary; protected operations still require server-side
identity, ownership, and scope enforcement.

### Migration and rollback

Existing raw-icon and default rendering paths remain available for incremental
surface migration. New consumers should use semantic icons and choose controls
by interaction intent rather than appearance. Each presentation migration must
preserve routing, labels, keyboard behavior, focus, pointer targets, reduced
motion, and existing error behavior.

Rollback reverts the additive controls, exports, styles, executable contract,
and tests. No stored data or remote contract requires rollback or cleanup.

### Risks and controls

- Invalid nested interaction is prevented by rendering one link for navigation.
- Loading actions are disabled and announced busy, preventing duplicate local
  activation; server idempotency remains the operation owner's responsibility.
- Field errors and hints are attached through stable ids without unsafe markup.
- The segmented control skips disabled items and wraps through enabled options.
- Contract drift, missing evidence, unsafe repository paths, duplicate states,
  missing focus/motion/forced-colors handling, and `transition: all` fail CI.
- Cross-engine visual equivalence and the broader automated accessibility
  harness remain explicit slice 2D work.

## Phase 2 completion checklist

- [x] Color, typography, spacing, radius, elevation, motion, and breakpoint tokens.
- [x] Light, dark, increased-contrast, and forced-colors handling.
- [x] Phosphor dependency and typed semantic icon registry.
- [x] Migration map for every inherited icon provider.
- [x] Foundational button, icon button, list row, card shell, chip, segmented
      control, field, avatar, and menu trigger.
- [x] Focus-management and reduced-motion utilities.
- [ ] Accessibility test harness and cross-engine visual regression baseline.
- [x] Component state documentation and examples.
- [x] Foundational components meet WCAG 2.2 AA targets.
- [x] New raw icon-library imports are rejected outside the registry.
- [x] Design tokens are verified in legacy and bounded Framework7-compatible
      surfaces.
