# Accessibility Test Baseline

Status: **Phase 0G enforced**

The required PR baseline verifies:

- login headings and explicit field labels;
- required username and password semantics;
- a named, keyboard-reachable password visibility control whose state label changes;
- protected and public deep-link behavior;
- keyboard-operable compose navigation;
- global `prefers-reduced-motion: reduce` behavior;
- inventoried focus, keyboard, labels, live regions, gestures, motion, RTL, and localization callsites.

Automated checks do not prove conformance. Manual screen-reader, zoom/reflow, contrast, forced-colors, switch-control, touch-target, cognitive-load, and cross-engine keyboard review remain required for migrated surfaces. New overlays must test initial focus, containment, Escape, return focus, background inertness, labels, and reduced-motion behavior.

The canonical command is `yarn test:browser-accessibility`.
