# Style and Token Source Map

Status: **Phase 0F complete / executable**

| Authority | Responsibility | Disposition |
|---|---|---|
| `app/styles/application.scss` | global import order and Tailwind layers | canonical global entry |
| `config/design-tokens.json` | semantic product tokens, display modes, breakpoints, and Framework7 aliases | canonical Phase 2 token source |
| `app/styles/design-tokens.generated.scss` | deterministic runtime custom properties generated from the canonical source | generated; never edit by hand |
| `app/styles/variables.scss` | inherited Sass values | retain during compatibility migration |
| `app/styles/themes.scss` | inherited runtime theme and instance-brand custom properties | compatibility bridge |
| `tailwind.config.js` | utilities backed by canonical tokens plus inherited color utilities | canonical utility bridge |
| `tailwind/colors.js` | validated CSS-variable color matrix generation | canonical generator |
| `app/styles/accessibility.scss` | accessibility overrides and reduced-motion policy | accessibility-critical |
| `app/styles/components/*` | inherited global component styles | compatibility-critical; migrate incrementally |
| co-located feature styles | feature-specific behavior | owner is the containing feature |
| inline styles | runtime geometry/color only | inventoried exception; avoid for stable tokens |

The manifest records every style file and disposition. The active breakpoints are `581px`, `768px`, `976px`, and `1280px`; changing them is a responsive compatibility change. RTL remains a distinct compatibility layer. Contrast decisions must use rendered theme values, not Sass/Tailwind names alone.

New stable colors, spacing, radii, typography, elevation, or motion values belong in `config/design-tokens.json` rather than one-off CSS. Run `yarn generate:design-tokens` after an intentional source edit and commit the generated result. Theme variables require light/dark, increased-contrast, and forced-colors review. Style deletion requires proving its selectors and compatibility behavior are obsolete.
