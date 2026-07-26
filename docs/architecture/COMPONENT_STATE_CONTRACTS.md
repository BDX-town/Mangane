# Foundational Component State Contracts

Status: **Phase 2C implementation contract**

Last updated: 2026-07-26

## Purpose

These additive foundations standardize interaction and accessibility without
rewriting existing product surfaces. Native elements remain the source of
keyboard, focus, disabled, and navigation behavior. CSS state is never a
substitute for authorization, account ownership checks, or server validation.

## State matrix

| Control | Supported states | Semantic contract |
|---|---|---|
| `avatar` | `default`, `fallback` | An image uses caller-provided alternative text. Invalid sizes fail closed to the existing 42px default. Decorative avatars must use an empty alternative. |
| `button` | `default`, `hover`, `focus-visible`, `disabled`, `loading`, `pressed` | Actions render a native button; navigation renders one link without a nested button. Loading is busy and unavailable. Toggle state uses `aria-pressed`. |
| `card-shell` | `default` | A caller selects a `div`, `article`, or labelled `section` according to the content relationship. |
| `chip` | `default`, `hover`, `focus-visible`, `disabled`, `selected` | A static label is a span. An interactive filter is a button whose selected state uses `aria-pressed`. |
| `field` | `default`, `focus-visible`, `disabled`, `error` | Labels target a stable field id. Hints and errors use `aria-describedby`; invalid fields use `aria-invalid`; errors are announced as alerts. |
| `icon-button` | `default`, `hover`, `focus-visible`, `disabled`, `loading`, `pressed` | A required accessible name labels the button. A semantic bundled icon is decorative. Loading and toggle semantics match the text button. |
| `list-row` | `default`, `hover`, `focus-visible`, `disabled`, `selected` | Static content is a div, an action is a button, and navigation is a link. Selected actions use `aria-pressed`; selected navigation uses `aria-current`. |
| `menu-trigger` | `default`, `hover`, `focus-visible`, `disabled`, `expanded` | Reach MenuButton owns disclosure, keyboard, expanded, and popup semantics. The trigger requires a visible-to-assistive-technology label. |
| `segmented-control` | `default`, `focus-visible`, `disabled`, `selected` | A labelled radiogroup uses radio roles, one roving tab stop, arrow/Home/End movement, disabled-item skipping, and explicit selection. |

## Interaction requirements

- Pointer and keyboard activation share native event behavior.
- Visible focus uses the semantic focus-ring token and remains visible in
  forced-colors mode.
- Interactive targets use at least the WCAG 2.2 AA minimum; primary rows and
  buttons use a 44px target.
- Reduced-motion preference removes non-essential transition travel and delay
  while preserving immediate state changes.
- A transient surface may use `useFocusReturn`. It restores focus only when the
  captured element is still connected; it never accepts an arbitrary selector.
- Disabled links prevent navigation and leave the tab order. Server-side
  authorization must still reject prohibited operations.

## Examples

```tsx
<Button loading onClick={save}>Save</Button>
<IconButton icon='question' label='Help' />
<ListRow to='/settings' selected>Settings</ListRow>
<Chip selected onClick={toggleFollowing}>Following</Chip>
<Card as='section' aria-label='Account summary'>...</Card>
```

```tsx
<SegmentedControl
  ariaLabel='Timeline density'
  value={density}
  onChange={setDensity}
  options={[
    { label: 'Compact', value: 'compact' },
    { label: 'Comfortable', value: 'comfortable' },
  ]}
/>
```

## Compatibility, migration, and rollback

Existing Button raw-icon, IconButton raw-SVG, card div, and avatar defaults
remain available so migrations can be reviewed surface by surface. New code
should prefer semantic icons, native intent, explicit labels, and the state
contracts above. Do not copy these controls into feature folders.

Migration requires focused keyboard and accessibility tests plus rendered
evidence where visual behavior changes. Slice 2D supplies the cross-engine
visual baseline and broader automated accessibility harness; source shape alone
does not prove runtime conformance.

Rollback is a revert of these additive controls, exports, styles, contract
inventory, and tests. There is no database, cache, service-worker, network,
authentication, or persisted-state migration.

## Security and privacy

The controls render React nodes and bundled semantic icons; they do not accept
raw HTML, script, remote icon URLs, or dynamic module names. No new data,
telemetry, credential, account, authorization, or IDOR boundary is introduced.
Callers remain responsible for output-safe content, validated navigation
destinations, and server-enforced object ownership.
