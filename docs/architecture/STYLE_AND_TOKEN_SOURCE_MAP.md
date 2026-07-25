# Style and Token Source Map

Status: **Phase 0F complete / executable**

| Authority | Responsibility | Disposition |
|---|---|---|
| `app/styles/application.scss` | global import order and Tailwind layers | canonical global entry |
| `app/styles/variables.scss` | inherited Sass values | retain during compatibility migration |
| `app/styles/themes.scss` | runtime theme custom properties | canonical runtime theme bridge |
| `tailwind.config.js` | breakpoints, semantic color names, typography, motion | canonical utility configuration |
| `tailwind/colors.js` | validated CSS-variable color matrix generation | canonical generator |
| `app/styles/accessibility.scss` | accessibility overrides and reduced-motion policy | accessibility-critical |
| `app/styles/components/*` | inherited global component styles | compatibility-critical; migrate incrementally |
| co-located feature styles | feature-specific behavior | owner is the containing feature |
| inline styles | runtime geometry/color only | inventoried exception; avoid for stable tokens |

The manifest records every style file and disposition. The active breakpoints are `581px`, `768px`, `976px`, and `1280px`; changing them is a responsive compatibility change. RTL remains a distinct compatibility layer. Contrast decisions must use rendered theme values, not Sass/Tailwind names alone.

New stable colors, spacing, radii, typography, elevation, or motion values belong in the canonical token path rather than one-off CSS. Theme variables require light/dark and high-contrast review. Style deletion requires proving its selectors and compatibility behavior are obsolete.
