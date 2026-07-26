# Accessibility Behavior Matrix

Status: **Phase 0F complete / executable**

| Concern | Verified baseline | Gate / remaining requirement |
|---|---|---|
| Reduced motion | global `prefers-reduced-motion: reduce` disables repeated/non-essential animation and transition while preserving state completion | CI rejects removal; component tests remain required for new motion |
| Focus | programmatic focus, autofocus, tab stops, modal restoration, and menu focus are enumerated | migration must add behavioral tests for traps and restoration |
| Live updates | snackbar region is labeled, atomicity is explicit, and updates are assertive | new dynamic surfaces need an intentional live-region policy |
| Labels | `aria-label`, `aria-labelledby`, and `htmlFor` callsites are enumerated | icon-only actions require localized accessible names |
| Pointer targets | target baseline is 44 by 44 CSS pixels | current exceptions are migration debt; measure in screenshot/browser baselines |
| Contrast | target is WCAG 2.2 AA across generated light/dark themes; Phase 2 checks core semantic token pairs | rendered-theme contrast and cross-engine checks remain required for migrated surfaces |
| Responsive | active breakpoints are recorded from Tailwind | zoom, reflow, 320 CSS-pixel width, and text-spacing tests required |
| RTL/localization | RTL and localization callsites are enumerated | mirroring must not reverse semantic media controls; strings cannot be clipped |
| Dyslexic/demetrication | inherited optional modes remain compatibility behavior | Framework7/style migration may not silently remove them |

The inventory proves where behavior exists; it does not claim that every inherited component already conforms. Any known exception is debt, not permission to regress. Security-sensitive dialogs must keep usable focus and understandable errors without leaking private data into announcements.
