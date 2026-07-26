# Screenshot and Interaction Baseline Plan

Status: **Phase 0 baseline accepted; cross-engine visual execution belongs to Phase 2**

Before a Framework7, token, or component replacement, capture deterministic baselines for:

1. signed-out/login, timeline, status detail, composer, search, notifications, profile, settings, admin capability gate, empty/error/loading states;
2. phone (`390x844`), narrow reflow (`320x800`), tablet (`768x1024`), and desktop (`1440x900`);
3. light/dark themes, 200% zoom, long localized strings, RTL, reduced motion, and keyboard-only operation;
4. modal/sheet open-close focus restoration, menu traversal, toast announcement, media controls, swipe plus button alternative, and offline/error recovery.

Fixtures must use synthetic public content and non-secret tokens. Stabilize time, animation, fonts, network, and random identifiers. Mask only genuinely nondeterministic regions and review every mask. Store approved artifacts with bounded retention and no credentials/private content.

Acceptance requires screenshot diffs plus interaction assertions for accessible name/role/state, tab order, focus destination, Escape behavior, live-region updates, 44-pixel targets, no horizontal loss at reflow, and reduced-motion behavior. A visual match cannot override a failed semantic or interaction assertion.
