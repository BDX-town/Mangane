# Design and Component Inventory

Status: **Phase 0F complete / executable**

Last updated: 2026-07-25

`config/design-component-authority-inventory.json` is the canonical generated inventory. It enumerates every production component and supporting UI module under shared components, features, and pages; every Sass/CSS entry; every discovered icon callsite; and keyboard, focus, gesture, motion, labeling, live-region, RTL, localization, and inline-style surfaces. `config/component-ownership-manifest.json` is the review-friendly ownership projection.

## Classification and ownership

Every component has an owner, shared/feature scope, and at least one disposition. Shared design-system primitives are reusable; inherited shared components are compatibility-critical; interaction-bearing modules are accessibility-critical; overlays and navigation require migration adapters; and icon consumers are Phosphor migration candidates. “Obsolete” is never inferred from import shape or dead-code tooling: removal requires reachability evidence, compatibility review, and a separate change.

Known duplicate authorities are explicit in the manifest:

- four icon rendering/button paths require a migration adapter;
- legacy and design-system button paths must converge behind the design system;
- Sass variables/themes and Tailwind color generation remain a documented multi-source token authority until Phase 2.

Framework7 is an accepted target and has no current source imports. It may not replace an inventoried surface unless routes, labels, keyboard access, focus restoration, reduced motion, gesture alternatives, and pointer targets are preserved and tested.

## Executable evidence

Run `yarn generate:design-authority`, review both generated manifests, then run `yarn check:design-authority` and `yarn test:design-authority`. CI performs the check plus adversarial mutation tests. Unreconciled component, style, icon, keyboard/focus, or Framework7 drift fails.
