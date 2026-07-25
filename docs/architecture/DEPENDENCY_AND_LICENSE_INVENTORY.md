# Dependency and License Inventory

Status: **Current Phase 0A evidence**

Generated from `package.json`, `yarn.lock`, installed package metadata, repository import/configuration evidence, GitHub Actions workflows, and the committed npm advisory snapshot. Do not edit generated tables by hand; regenerate them with `scripts/generate-dependency-authority-inventory.js`.

## Authority and completeness

- Machine-readable authority: [`config/dependency-authority-inventory.json`](../../config/dependency-authority-inventory.json)
- Advisory snapshot: [`config/dependency-advisory-snapshot.json`](../../config/dependency-advisory-snapshot.json)
- Drift and license checker: [`scripts/check-dependency-authority-inventory.js`](../../scripts/check-dependency-authority-inventory.js)
- Resolved packages classified: **2015**
- Direct packages with an owner, purpose, context, and usage evidence: **206**
- Package names with multiple locked locators or versions: **232**
- Packages with install scripts: **4**
- Packages with native-binding indicators: **5**
- Packages with install-time network indicators: **0**
- Packages with network-capable package scripts: **45**
- Packages with code-generation/build script indicators: **662**
- GitHub Actions use sites reviewed: **26** (24 not commit-pinned)

Every lockfile locator has a classification, execution context, root reachability set, maintenance status, license disposition, install behavior, owner, and purpose in the machine-readable authority. A transitive package may inherit multiple roots and contexts.

The machine-readable `duplicatePackages` register records every package name with multiple locked locators or versions, including all roots that pull it into the graph. Duplicate presence is evidence for consolidation review, not proof that versions are interchangeable.

## Classification rules

| Classification | Meaning |
|---|---|
| runtime / runtime-transitive | Imported by browser or worker production source, or reachable from such a direct root |
| build-only / build-transitive | Used by build, repository automation, development tooling, or a transitive root in that class |
| test-only / test-transitive | Used only by test infrastructure or reachable only from a test root |
| development-unverified / unverified-transitive | Declared for development but no authoritative import or command use was found |
| unused-or-dynamically-referenced-unverified | Production-section declaration with no static evidence; removal or dynamic-use review is required |
| orphaned-lockfile-entry | Present in the lockfile but no direct-root path was reconstructed; it must not be treated as shipped without review |

## Direct dependency authority

| Package | Version | Classification | Context | Owner | Evidence sites | Replacement relevance |
|---|---:|---|---|---|---:|---|
| @babel/core | 7.29.0 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @babel/plugin-proposal-class-properties | 7.18.6 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @babel/plugin-proposal-decorators | 7.29.0 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @babel/plugin-proposal-object-rest-spread | 7.20.7 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @babel/plugin-syntax-dynamic-import | 7.8.3 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @babel/plugin-transform-react-inline-elements | 7.27.1 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @babel/plugin-transform-react-jsx-self | 7.27.1 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @babel/plugin-transform-react-jsx-source | 7.27.1 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @babel/plugin-transform-runtime | 7.29.0 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @babel/preset-env | 7.29.2 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @babel/preset-react | 7.28.5 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @babel/preset-typescript | 7.28.5 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @babel/runtime | 7.29.2 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @commitlint/cli | 19.8.1 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @commitlint/config-conventional | 19.8.1 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @emoji-mart/data | 1.2.1 | runtime | browser | frontend-runtime-maintainers | 2 | none-recorded |
| @emoji-mart/react | 1.1.1 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| @fontsource/inter | 4.5.15 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| @fontsource/roboto | 4.5.8 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @gamestdio/websocket | 0.3.2 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| @jedmao/redux-mock-store | 3.0.5 | test-only | test | test-infrastructure-maintainers | 1 | none-recorded |
| @jest/globals | 28.1.3 | test-only | test | test-infrastructure-maintainers | 1 | none-recorded |
| @lcdp/offline-plugin | 5.1.7 | runtime | browser, build | frontend-runtime-maintainers | 3 | none-recorded |
| @metamask/providers | 9.1.0 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @popperjs/core | 2.11.8 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @reach/menu-button | 0.16.2 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| @reach/popover | 0.16.2 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| @reach/portal | 0.16.2 | runtime | browser | frontend-runtime-maintainers | 3 | none-recorded |
| @reach/rect | 0.16.0 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| @reach/tabs | 0.16.4 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| @reach/tooltip | 0.16.2 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| @reduxjs/toolkit | 1.9.7 | runtime | browser | frontend-runtime-maintainers | 4 | none-recorded |
| @sentry/browser | 7.120.4 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @sentry/react | 7.120.4 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @sentry/tracing | 7.120.4 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @tabler/icons | 1.119.0 | runtime | browser, test | frontend-runtime-maintainers | 121 | none-recorded |
| @tailwindcss/forms | 0.4.1 | build-only | build | build-and-release-maintainers | 1 | none-recorded |
| @tailwindcss/typography | 0.5.19 | build-only | build | build-and-release-maintainers | 1 | none-recorded |
| @tanstack/react-query | 4.44.0 | runtime | browser, test | frontend-runtime-maintainers | 6 | none-recorded |
| @testing-library/jest-dom | 5.17.0 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @testing-library/react-hooks | 8.0.1 | test-only | test | test-infrastructure-maintainers | 2 | none-recorded |
| @testing-library/react | 12.1.5 | test-only | test | test-infrastructure-maintainers | 3 | none-recorded |
| @testing-library/user-event | 14.6.1 | test-only | test | test-infrastructure-maintainers | 10 | none-recorded |
| @types/escape-html | 1.0.4 | build-only | unverified | build-and-release-maintainers | 0 | none-recorded |
| @types/http-link-header | 1.0.7 | build-only | unverified | build-and-release-maintainers | 0 | none-recorded |
| @types/jest | 28.1.8 | build-only | build | build-and-release-maintainers | 2 | none-recorded |
| @types/lodash | 4.17.24 | build-only | unverified | build-and-release-maintainers | 0 | none-recorded |
| @types/object-assign | 4.0.33 | build-only | unverified | build-and-release-maintainers | 0 | none-recorded |
| @types/object-fit-images | 3.2.5 | build-only | unverified | build-and-release-maintainers | 0 | none-recorded |
| @types/qrcode.react | 1.0.5 | build-only | unverified | build-and-release-maintainers | 0 | none-recorded |
| @types/react-color | 3.0.13 | build-only | unverified | build-and-release-maintainers | 0 | none-recorded |
| @types/react-datepicker | 4.19.6 | build-only | unverified | build-and-release-maintainers | 0 | none-recorded |
| @types/react-helmet | 6.1.11 | build-only | unverified | build-and-release-maintainers | 0 | none-recorded |
| @types/react-motion | 0.0.32 | build-only | unverified | build-and-release-maintainers | 0 | none-recorded |
| @types/react-router-dom | 5.3.3 | build-only | unverified | build-and-release-maintainers | 0 | none-recorded |
| @types/react-sparklines | 1.7.5 | build-only | unverified | build-and-release-maintainers | 0 | none-recorded |
| @types/react-swipeable-views | 0.13.6 | build-only | unverified | build-and-release-maintainers | 0 | none-recorded |
| @types/react-toggle | 4.0.5 | build-only | unverified | build-and-release-maintainers | 0 | none-recorded |
| @types/redux-mock-store | 1.5.0 | build-only | unverified | build-and-release-maintainers | 0 | none-recorded |
| @types/semver | 7.7.1 | build-only | unverified | build-and-release-maintainers | 0 | none-recorded |
| @types/uuid | 8.3.4 | build-only | unverified | build-and-release-maintainers | 0 | none-recorded |
| @typescript-eslint/eslint-plugin | 5.62.0 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| @typescript-eslint/parser | 5.62.0 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| array-includes | 3.1.9 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| autoprefixer | 10.4.2 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| axios-mock-adapter | 1.22.0 | runtime | browser, test | frontend-runtime-maintainers | 3 | none-recorded |
| axios | 1.15.0 | runtime | browser, test | frontend-runtime-maintainers | 57 | review-required |
| babel-eslint | 10.1.0 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| babel-jest | 28.1.3 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| babel-loader | 8.4.1 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| babel-plugin-lodash | 3.3.4 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| babel-plugin-preval | 5.1.0 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| babel-plugin-react-intl | 7.9.4 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| babel-plugin-transform-react-remove-prop-types | 0.4.24 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| babel-plugin-transform-require-context | 0.1.1 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| blurhash | 1.1.5 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| bootstrap-icons | 1.13.1 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| bowser | 2.14.1 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| browserslist | 4.28.2 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| cheerio | 1.2.0 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| classnames | 2.5.1 | runtime | browser | frontend-runtime-maintainers | 104 | none-recorded |
| commit-and-tag-version | 12.7.1 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| copy-webpack-plugin | 9.1.0 | build-only | build | build-and-release-maintainers | 2 | none-recorded |
| core-js | 3.49.0 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| cross-env | 7.0.3 | build-only | build | build-and-release-maintainers | 1 | none-recorded |
| cryptocurrency-icons | 0.18.1 | runtime | browser | frontend-runtime-maintainers | 2 | none-recorded |
| css-loader | 6.11.0 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| cssnano | 5.1.15 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| danger | 11.3.1 | build-only | node | build-and-release-maintainers | 1 | none-recorded |
| detect-passive-events | 2.0.3 | runtime | browser | frontend-runtime-maintainers | 5 | none-recorded |
| dompurify | 3.4.12 | runtime | browser, build | frontend-runtime-maintainers | 2 | none-recorded |
| dotenv | 8.6.0 | build-only | build | build-and-release-maintainers | 1 | none-recorded |
| eld | 2.0.3 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| emoji-datasource | 5.0.0 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| emoji-mart | 5.6.0 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| entities | 3.0.1 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| es6-symbol | 3.1.4 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| escape-html | 1.0.3 | runtime | browser | frontend-runtime-maintainers | 4 | none-recorded |
| eslint-plugin-compat | 4.2.0 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| eslint-plugin-import | 2.32.0 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| eslint-plugin-jsdoc | 48.11.0 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| eslint-plugin-jsx-a11y | 6.10.2 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| eslint-plugin-promise | 5.2.0 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| eslint-plugin-react-hooks | 7.1.1 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| eslint-plugin-react | 7.37.5 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| eslint | 7.32.0 | build-only | build | build-and-release-maintainers | 1 | none-recorded |
| exif-js | 2.3.0 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| fake-indexeddb | 3.1.8 | test-only | test | test-infrastructure-maintainers | 1 | none-recorded |
| feather-icons | 4.29.2 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| fork-ts-checker-webpack-plugin | 7.3.0 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| history | 4.10.1 | runtime | browser | frontend-runtime-maintainers | 4 | none-recorded |
| html-webpack-harddisk-plugin | 2.0.0 | build-only | build | build-and-release-maintainers | 1 | none-recorded |
| html-webpack-plugin | 5.6.7 | build-only | build | build-and-release-maintainers | 1 | none-recorded |
| http-link-header | 1.1.3 | runtime | browser, test | frontend-runtime-maintainers | 2 | none-recorded |
| husky | 9.1.7 | build-only | build | build-and-release-maintainers | 1 | none-recorded |
| immutable | 4.3.8 | runtime | browser, build, node, test | frontend-runtime-maintainers | 233 | review-required |
| imports-loader | 4.0.1 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| intersection-observer | 0.12.2 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| intl-messageformat-parser | 6.4.4 | build-only | build | build-and-release-maintainers | 1 | none-recorded |
| intl-messageformat | 9.13.0 | runtime | browser, worker | service-worker-maintainers | 2 | none-recorded |
| intl-pluralrules | 1.3.1 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| intl | 1.2.5 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| is-nan | 1.3.2 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| iso-639-1 | 3.1.5 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| jest-environment-jsdom | 28.1.3 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| jest-junit | 14.0.1 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| jest | 28.1.3 | build-only | build | build-and-release-maintainers | 2 | none-recorded |
| jsdoc | 3.6.11 | build-only | build | build-and-release-maintainers | 1 | none-recorded |
| libphonenumber-js | 1.12.41 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| line-awesome | 1.3.0 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| lint-staged | 16.4.0 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| localforage | 1.10.0 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| lodash | 4.18.1 | runtime | browser, test, worker | service-worker-maintainers | 48 | review-required |
| mark-loader | 0.1.6 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| marky | 1.3.0 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| mini-css-extract-plugin | 2.10.2 | build-only | build | build-and-release-maintainers | 2 | none-recorded |
| object-assign | 4.1.1 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| object-fit-images | 3.2.4 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| object.values | 1.2.1 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| path-browserify | 1.0.1 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| postcss-loader | 7.0.0 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| postcss-object-fit-images | 1.1.2 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| postcss | 8.5.10 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| process | 0.11.10 | build-only | build | build-and-release-maintainers | 1 | none-recorded |
| prop-types | 15.8.1 | runtime | browser | frontend-runtime-maintainers | 37 | none-recorded |
| punycode | 2.3.1 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| qrcode.react | 3.2.0 | runtime | browser | frontend-runtime-maintainers | 2 | none-recorded |
| raf | 3.4.1 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| react-color | 2.19.3 | runtime | browser | frontend-runtime-maintainers | 3 | none-recorded |
| react-datepicker | 4.25.0 | runtime | browser, build, test | frontend-runtime-maintainers | 4 | none-recorded |
| react-dom | 17.0.2 | runtime | browser | frontend-runtime-maintainers | 6 | none-recorded |
| react-helmet | 6.1.0 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| react-hotkeys | 1.1.4 | runtime | browser | frontend-runtime-maintainers | 6 | none-recorded |
| react-immutable-proptypes | 2.2.0 | runtime | browser | frontend-runtime-maintainers | 24 | none-recorded |
| react-immutable-pure-component | 2.2.2 | runtime | browser | frontend-runtime-maintainers | 20 | none-recorded |
| react-inlinesvg | 3.0.3 | runtime | browser | frontend-runtime-maintainers | 2 | none-recorded |
| react-intl-translations-manager | 5.0.3 | build-only | build | build-and-release-maintainers | 1 | none-recorded |
| react-intl | 5.25.1 | runtime | browser, test | frontend-runtime-maintainers | 290 | none-recorded |
| react-motion | 0.5.2 | runtime | browser | frontend-runtime-maintainers | 11 | none-recorded |
| react-otp-input | 2.4.0 | runtime | browser | frontend-runtime-maintainers | 2 | none-recorded |
| react-overlays | 0.9.0 | runtime | browser | frontend-runtime-maintainers | 2 | none-recorded |
| react-popper | 2.3.0 | runtime | browser | frontend-runtime-maintainers | 6 | none-recorded |
| react-redux | 7.2.9 | runtime | browser, test | frontend-runtime-maintainers | 92 | none-recorded |
| react-router-dom | 5.3.0 | runtime | browser, test | frontend-runtime-maintainers | 108 | none-recorded |
| react-router-scroll-4 | 1.0.0-beta.2 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| react-simple-pull-to-refresh | 1.3.4 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| react-sparklines | 1.7.0 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| react-sticky-box | 1.0.2 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| react-swipeable-views | 0.14.1 | runtime | browser | frontend-runtime-maintainers | 3 | none-recorded |
| react-textarea-autosize | 8.5.9 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| react-toggle | 4.1.3 | runtime | browser | frontend-runtime-maintainers | 5 | none-recorded |
| react-virtuoso | 2.19.1 | runtime | browser | frontend-runtime-maintainers | 6 | none-recorded |
| react | 17.0.2 | runtime | browser, test | frontend-runtime-maintainers | 487 | none-recorded |
| redux-immutable | 4.0.0 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| redux-thunk | 2.4.2 | runtime | browser, test | frontend-runtime-maintainers | 4 | none-recorded |
| redux | 4.2.1 | runtime | browser, node, test | frontend-runtime-maintainers | 58 | none-recorded |
| requestidlecallback | 0.3.0 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| reselect | 4.1.8 | runtime | browser | frontend-runtime-maintainers | 12 | none-recorded |
| sass-loader | 13.0.0 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| sass | 1.41.0 | build-only | build | build-and-release-maintainers | 1 | none-recorded |
| semver | 7.7.4 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| stringz | 2.1.0 | runtime | browser | frontend-runtime-maintainers | 3 | none-recorded |
| stylelint-config-standard | 22.0.0 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| stylelint-scss | 3.21.0 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| stylelint | 13.13.1 | build-only | build | build-and-release-maintainers | 1 | none-recorded |
| substring-trie | 1.0.2 | runtime | browser | frontend-runtime-maintainers | 1 | none-recorded |
| tailwindcss | 3.4.19 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| terser-webpack-plugin | 5.4.0 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| tiny-queue | 0.2.1 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| ts-jest | 28.0.8 | development-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| ts-loader | 9.5.7 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| tslib | 2.8.1 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| twemoji | 14.0.2 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| typescript | 4.9.5 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| util | 0.12.5 | build-only | node | build-and-release-maintainers | 17 | none-recorded |
| uuid | 8.3.2 | runtime | browser | frontend-runtime-maintainers | 7 | none-recorded |
| webpack-assets-manifest | 5.2.1 | build-only | build | build-and-release-maintainers | 1 | none-recorded |
| webpack-bundle-analyzer | 4.10.2 | build-only | build | build-and-release-maintainers | 1 | none-recorded |
| webpack-cli | 4.10.0 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| webpack-deadcode-plugin | 0.1.17 | build-only | build | build-and-release-maintainers | 1 | none-recorded |
| webpack-dev-server | 4.9.1 | build-only | build | build-and-release-maintainers | 1 | none-recorded |
| webpack-merge | 5.10.0 | build-only | build | build-and-release-maintainers | 3 | none-recorded |
| webpack | 5.106.2 | build-only | build | build-and-release-maintainers | 3 | none-recorded |
| wicg-inert | 3.1.3 | unused-or-dynamically-referenced-unverified | unverified | dependency-governance-maintainers | 0 | review-required |
| yaml | 2.8.3 | build-only | build | build-and-release-maintainers | 1 | none-recorded |
| yargs | 16.2.0 | build-only | build | build-and-release-maintainers | 1 | none-recorded |

## License families

| License expression | Resolved packages | Evidence status | Obligations / disposition |
|---|---:|---|---|
| (BSD-3-Clause OR GPL-2.0) | 1 | declared | copyleft-source-and-license-compliance-review, retain-applicable-copyright-license-and-notice-text |
| (MIT OR Apache-2.0) | 2 | declared | retain-applicable-copyright-license-and-notice-text |
| (MIT OR CC0-1.0) | 5 | declared | retain-applicable-copyright-license-and-notice-text, retain-provenance-and-confirm-jurisdictional-treatment |
| (MPL-2.0 OR Apache-2.0) | 1 | declared | copyleft-source-and-license-compliance-review, retain-applicable-copyright-license-and-notice-text |
| (WTFPL OR MIT) | 1 | declared | retain-applicable-copyright-license-and-notice-text |
| 0BSD | 2 | declared | retain-provenance-and-confirm-jurisdictional-treatment |
| Apache 2 | 1 | non-spdx-or-ambiguous-declaration | retain-applicable-copyright-license-and-notice-text |
| Apache-2.0 | 47 | declared | retain-applicable-copyright-license-and-notice-text |
| Apache-2.0 AND MIT | 1 | declared | retain-applicable-copyright-license-and-notice-text |
| Apache-2.0 WITH LLVM-exception | 1 | declared | retain-applicable-copyright-license-and-notice-text |
| BlueOak-1.0.0 | 6 | declared | preserve-license-text-and-review-distribution-terms |
| BSD | 5 | non-spdx-or-ambiguous-declaration | retain-applicable-copyright-license-and-notice-text |
| BSD-2-Clause | 49 | declared | retain-applicable-copyright-license-and-notice-text |
| BSD-3-Clause | 41 | declared | retain-applicable-copyright-license-and-notice-text |
| BSD-3-Clause OR MIT | 1 | declared | retain-applicable-copyright-license-and-notice-text |
| CC-BY-3.0 | 1 | declared | provide-required-attribution |
| CC-BY-4.0 | 1 | declared | provide-required-attribution |
| CC-BY-4.0 OR MIT | 1 | declared | provide-required-attribution, retain-applicable-copyright-license-and-notice-text |
| CC0-1.0 | 5 | declared | retain-provenance-and-confirm-jurisdictional-treatment |
| ISC | 110 | declared | retain-applicable-copyright-license-and-notice-text |
| LicenseRef-TaffyDB-Ambiguous | 1 | conflict-requires-removal-or-counsel | legal-review-before-distribution |
| MIT | 1720 | declared, verified-from-distribution | retain-applicable-copyright-license-and-notice-text |
| MIT/X11 | 1 | non-spdx-or-ambiguous-declaration | retain-applicable-copyright-license-and-notice-text |
| MPL-2.0 | 3 | declared | copyleft-source-and-license-compliance-review |
| Public Domain | 1 | non-spdx-or-ambiguous-declaration | retain-provenance-and-confirm-jurisdictional-treatment |
| Python-2.0 | 1 | declared | retain-applicable-copyright-license-and-notice-text |
| Unlicense | 3 | declared | retain-provenance-and-confirm-jurisdictional-treatment |
| W3C-20150513 | 1 | declared | retain-applicable-copyright-license-and-notice-text |
| WTFPL OR ISC | 1 | declared | retain-applicable-copyright-license-and-notice-text |
| Zlib | 1 | declared | retain-applicable-copyright-license-and-notice-text |

Mangane remains AGPL-3.0-or-later. This inventory records dependency declarations; it is not legal advice. Copyleft, notice, attribution, custom-license, and license-conflict entries must be reviewed before distribution changes.

## Install, native, download, and code-generation exposure

| Package | Version | Install script | Native | Install network | Any-script network | Code generation | Root reachability |
|---|---:|---:|---:|---:|---:|---:|---|
| @adobe/css-tools | 4.4.4 | false | false | false | false | true | @testing-library/jest-dom |
| @babel/compat-data | 7.29.0 | false | false | false | true | true | @babel/core, @babel/plugin-proposal-object-rest-spread, @babel/plugin-transform-runtime, @babel/preset-env, @jest/globals, babel-jest, babel-plugin-react-intl, eslint-plugin-react-hooks, jest, stylelint |
| @babel/preset-modules | 0.1.6-no-external-plugins | false | false | false | false | true | @babel/preset-env |
| @bcoe/v8-coverage | 0.2.3 | false | false | false | false | true | jest |
| @discoveryjs/json-ext | 0.5.7 | false | false | false | false | true | webpack-bundle-analyzer, webpack-cli |
| @emoji-mart/data | 1.2.1 | false | false | false | false | true | @emoji-mart/data |
| @emoji-mart/react | 1.1.1 | false | false | false | false | true | @emoji-mart/react |
| @es-joy/jsdoccomment | 0.46.0 | false | false | false | false | true | eslint-plugin-jsdoc |
| @eslint-community/eslint-utils | 4.9.1 | false | false | false | false | true | @typescript-eslint/eslint-plugin |
| @eslint-community/regexpp | 4.12.2 | false | false | false | false | true | @typescript-eslint/eslint-plugin |
| @eslint/eslintrc | 0.4.3 | false | false | false | false | true | eslint |
| @gamestdio/websocket | 0.3.2 | false | false | false | false | true | @gamestdio/websocket |
| @gitbeaker/core | 35.8.1 | false | false | false | false | true | danger |
| @gitbeaker/node | 35.8.1 | false | false | false | false | true | danger |
| @gitbeaker/requester-utils | 35.8.1 | false | false | false | false | true | danger |
| @humanwhocodes/config-array | 0.5.0 | false | false | false | false | true | eslint |
| @icons/material | 0.2.4 | false | false | false | false | true | react-color |
| @isaacs/fs-minipass | 4.0.1 | false | false | false | false | true | @jest/globals, @lcdp/offline-plugin, babel-jest, fork-ts-checker-webpack-plugin, jest, sass, tailwindcss, webpack-dev-server |
| @jedmao/redux-mock-store | 3.0.5 | false | false | false | false | true | @jedmao/redux-mock-store |
| @jridgewell/gen-mapping | 0.3.13 | false | false | false | false | true | @babel/core, @babel/plugin-proposal-class-properties, @babel/plugin-proposal-decorators, @babel/plugin-transform-runtime, @babel/preset-env, @babel/preset-react, @babel/preset-typescript, @jest/globals, babel-eslint, babel-jest, babel-plugin-lodash, babel-plugin-react-intl, eslint-plugin-react-hooks, html-webpack-plugin, jest, stylelint, tailwindcss, terser-webpack-plugin, webpack |
| @jridgewell/remapping | 2.3.5 | false | false | false | false | true | @babel/core, @jest/globals, babel-jest, babel-plugin-react-intl, eslint-plugin-react-hooks, jest, stylelint |
| @jridgewell/resolve-uri | 3.1.2 | false | false | false | false | true | @babel/core, @babel/plugin-proposal-class-properties, @babel/plugin-proposal-decorators, @babel/plugin-transform-runtime, @babel/preset-env, @babel/preset-react, @babel/preset-typescript, @jest/globals, babel-eslint, babel-jest, babel-plugin-lodash, babel-plugin-react-intl, eslint-plugin-react-hooks, html-webpack-plugin, jest, stylelint, tailwindcss, terser-webpack-plugin, webpack |
| @jridgewell/source-map | 0.3.11 | false | false | false | false | true | html-webpack-plugin, terser-webpack-plugin, webpack |
| @jridgewell/sourcemap-codec | 1.5.5 | false | false | false | false | true | @babel/core, @babel/plugin-proposal-class-properties, @babel/plugin-proposal-decorators, @babel/plugin-transform-runtime, @babel/preset-env, @babel/preset-react, @babel/preset-typescript, @jest/globals, babel-eslint, babel-jest, babel-plugin-lodash, babel-plugin-react-intl, eslint-plugin-react-hooks, html-webpack-plugin, jest, stylelint, tailwindcss, terser-webpack-plugin, webpack |
| @jridgewell/trace-mapping | 0.3.31 | false | false | false | false | true | @babel/core, @babel/plugin-proposal-class-properties, @babel/plugin-proposal-decorators, @babel/plugin-transform-runtime, @babel/preset-env, @babel/preset-react, @babel/preset-typescript, @jest/globals, babel-eslint, babel-jest, babel-plugin-lodash, babel-plugin-react-intl, eslint-plugin-react-hooks, html-webpack-plugin, jest, stylelint, tailwindcss, terser-webpack-plugin, webpack |
| @lcdp/offline-plugin | 5.1.7 | false | false | false | false | true | @lcdp/offline-plugin |
| @leichtgewicht/ip-codec | 2.0.5 | false | false | false | false | true | webpack-dev-server |
| @metamask/object-multiplex | 1.3.0 | false | false | false | false | true | @metamask/providers |
| @metamask/providers | 9.1.0 | false | false | false | false | true | @metamask/providers |
| @metamask/safe-event-emitter | 2.0.0 | false | false | false | false | true | @metamask/providers |
| @nodelib/fs.scandir | 2.1.5 | false | false | false | false | true | @typescript-eslint/eslint-plugin, @typescript-eslint/parser, copy-webpack-plugin, stylelint, tailwindcss, webpack-deadcode-plugin |
| @nodelib/fs.stat | 2.0.5 | false | false | false | false | true | @typescript-eslint/eslint-plugin, @typescript-eslint/parser, copy-webpack-plugin, stylelint, tailwindcss, webpack-deadcode-plugin |
| @nodelib/fs.walk | 1.2.8 | false | false | false | false | true | @typescript-eslint/eslint-plugin, @typescript-eslint/parser, copy-webpack-plugin, stylelint, tailwindcss, webpack-deadcode-plugin |
| @popperjs/core | 2.11.8 | false | false | false | false | true | @popperjs/core, @types/react-datepicker, react-datepicker |
| @reach/observe-rect | 1.2.0 | false | false | false | false | true | @reach/menu-button, @reach/popover, @reach/rect, @reach/tooltip |
| @reduxjs/toolkit | 1.9.7 | false | false | false | false | true | @reduxjs/toolkit |
| @sinclair/typebox | 0.24.51 | false | false | false | false | true | @jest/globals, @types/jest, babel-jest, jest, jest-environment-jsdom, ts-jest |
| @sindresorhus/is | 4.6.0 | false | false | false | false | true | danger |
| @sinonjs/commons | 1.8.6 | false | false | false | false | true | @jest/globals, jest, jest-environment-jsdom |
| @stylelint/postcss-css-in-js | 0.37.3 | false | false | false | false | true | stylelint |
| @szmarczak/http-timer | 4.0.6 | false | false | false | false | true | danger |
| @tabler/icons | 1.119.0 | false | false | false | false | true | @tabler/icons |
| @tailwindcss/forms | 0.4.1 | false | false | false | false | true | @tailwindcss/forms |
| @tailwindcss/typography | 0.5.19 | false | false | false | false | true | @tailwindcss/typography |
| @tanstack/query-core | 4.44.0 | false | false | false | false | true | @tanstack/react-query |
| @tanstack/react-query | 4.44.0 | false | false | false | false | true | @tanstack/react-query |
| @testing-library/dom | 8.20.1 | false | false | false | false | true | @testing-library/react |
| @testing-library/jest-dom | 5.17.0 | false | false | false | false | true | @testing-library/jest-dom |
| @testing-library/react-hooks | 8.0.1 | false | false | false | false | true | @testing-library/react-hooks |
| @testing-library/react | 12.1.5 | false | false | false | false | true | @testing-library/react |
| @testing-library/user-event | 14.6.1 | false | false | false | false | true | @testing-library/user-event |
| @tootallnate/once | 2.0.0 | false | false | false | false | true | danger, jest-environment-jsdom |
| @typescript-eslint/eslint-plugin | 5.62.0 | false | false | false | false | true | @typescript-eslint/eslint-plugin |
| @typescript-eslint/parser | 5.62.0 | false | false | false | false | true | @typescript-eslint/parser |
| @typescript-eslint/scope-manager | 5.62.0 | false | false | false | false | true | @typescript-eslint/eslint-plugin, @typescript-eslint/parser |
| @typescript-eslint/type-utils | 5.62.0 | false | false | false | false | true | @typescript-eslint/eslint-plugin |
| @typescript-eslint/types | 5.62.0 | false | false | false | false | true | @typescript-eslint/eslint-plugin, @typescript-eslint/parser |
| @typescript-eslint/typescript-estree | 5.62.0 | false | false | false | false | true | @typescript-eslint/eslint-plugin, @typescript-eslint/parser |
| @typescript-eslint/utils | 5.62.0 | false | false | false | false | true | @typescript-eslint/eslint-plugin |
| @typescript-eslint/visitor-keys | 5.62.0 | false | false | false | false | true | @typescript-eslint/eslint-plugin, @typescript-eslint/parser |
| @virtuoso.dev/react-urx | 0.2.13 | false | false | false | false | true | react-virtuoso |
| @virtuoso.dev/urx | 0.2.13 | false | false | false | false | true | react-virtuoso |
| @webassemblyjs/floating-point-hex-parser | 1.13.2 | false | false | false | false | true | webpack |
| @xtuc/long | 4.2.2 | false | false | false | false | true | webpack |
| acorn-walk | 7.2.0 | false | false | false | false | true | jest-environment-jsdom |
| acorn-walk | 8.3.5 | false | false | false | false | true | webpack-bundle-analyzer |
| acorn | 5.7.4 | false | false | false | false | true | @lcdp/offline-plugin |
| acorn | 7.4.1 | false | false | false | false | true | eslint, jest-environment-jsdom |
| acorn | 8.16.0 | false | false | false | false | true | eslint-plugin-jsdoc, html-webpack-plugin, jest-environment-jsdom, terser-webpack-plugin, webpack, webpack-bundle-analyzer |
| agent-base | 6.0.2 | false | false | false | false | true | danger, jest-environment-jsdom |
| ajv-formats | 2.1.1 | false | false | false | false | true | babel-plugin-react-intl, mini-css-extract-plugin, terser-webpack-plugin, webpack, webpack-dev-server |
| ajv-keywords | 3.5.2 | false | false | false | false | true | babel-loader, babel-plugin-react-intl, copy-webpack-plugin, fork-ts-checker-webpack-plugin, webpack-assets-manifest |
| ajv-keywords | 5.1.0 | false | false | false | false | true | babel-plugin-react-intl, mini-css-extract-plugin, terser-webpack-plugin, webpack, webpack-dev-server |
| ajv | 6.14.0 | false | false | false | false | true | babel-loader, babel-plugin-react-intl, copy-webpack-plugin, eslint, fork-ts-checker-webpack-plugin, webpack-assets-manifest |
| ajv | 8.18.0 | false | false | false | false | true | @commitlint/cli, babel-plugin-react-intl, eslint, mini-css-extract-plugin, stylelint, terser-webpack-plugin, webpack, webpack-dev-server |
| are-docs-informative | 0.0.2 | false | false | false | false | true | eslint-plugin-jsdoc |
| aria-query | 5.1.3 | false | false | false | false | true | @testing-library/react |
| aria-query | 5.3.2 | false | false | false | false | true | @testing-library/jest-dom, eslint-plugin-jsx-a11y |
| array-buffer-byte-length | 1.0.2 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| array-includes | 3.1.9 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| array.prototype.findlast | 1.2.5 | false | false | false | false | true | eslint-plugin-react |
| array.prototype.findlastindex | 1.2.6 | false | false | false | false | true | eslint-plugin-import |
| array.prototype.flat | 1.3.3 | false | false | false | false | true | eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| array.prototype.flatmap | 1.3.3 | false | false | false | false | true | eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| array.prototype.tosorted | 1.1.4 | false | false | false | false | true | eslint-plugin-react |
| arraybuffer.prototype.slice | 1.0.4 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| ast-metadata-inferer | 0.8.1 | false | false | false | false | true | eslint-plugin-compat |
| ast-types-flow | 0.0.8 | false | false | false | false | true | eslint-plugin-jsx-a11y |
| async-function | 1.0.0 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| available-typed-arrays | 1.0.7 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, util |
| axe-core | 4.11.3 | false | false | false | false | true | eslint-plugin-jsx-a11y |
| axios-mock-adapter | 1.22.0 | false | false | false | false | true | axios-mock-adapter |
| axios | 1.15.0 | false | false | false | false | true | axios |
| axobject-query | 4.1.0 | false | false | false | false | true | eslint-plugin-jsx-a11y |
| babel-loader | 8.4.1 | false | false | false | false | true | babel-loader |
| babel-plugin-constant-folding | 1.0.1 | false | false | false | false | true | @lcdp/offline-plugin |
| babel-plugin-dead-code-elimination | 1.0.2 | false | false | false | false | true | @lcdp/offline-plugin |
| babel-plugin-eval | 1.0.1 | false | false | false | false | true | @lcdp/offline-plugin |
| babel-plugin-inline-environment-variables | 1.0.1 | false | false | false | false | true | @lcdp/offline-plugin |
| babel-plugin-istanbul | 6.1.1 | false | false | false | false | true | @jest/globals, babel-jest, jest |
| babel-plugin-jscript | 1.0.4 | false | false | false | false | true | @lcdp/offline-plugin |
| babel-plugin-lodash | 3.3.4 | false | false | false | false | true | babel-plugin-lodash |
| babel-plugin-macros | 3.1.0 | false | false | false | false | true | babel-plugin-preval |
| babel-plugin-member-expression-literals | 1.0.1 | false | false | false | false | true | @lcdp/offline-plugin |
| babel-plugin-preval | 5.1.0 | false | false | false | false | true | babel-plugin-preval |
| babel-plugin-property-literals | 1.0.1 | false | false | false | false | true | @lcdp/offline-plugin |
| babel-plugin-proto-to-assign | 1.0.4 | false | false | false | false | true | @lcdp/offline-plugin |
| babel-plugin-react-constant-elements | 1.0.3 | false | false | false | false | true | @lcdp/offline-plugin |
| babel-plugin-react-display-name | 1.0.3 | false | false | false | false | true | @lcdp/offline-plugin |
| babel-plugin-remove-console | 1.0.1 | false | false | false | false | true | @lcdp/offline-plugin |
| babel-plugin-remove-debugger | 1.0.1 | false | false | false | false | true | @lcdp/offline-plugin |
| babel-plugin-runtime | 1.0.7 | false | false | false | false | true | @lcdp/offline-plugin |
| babel-plugin-transform-react-remove-prop-types | 0.4.24 | false | false | false | false | true | babel-plugin-transform-react-remove-prop-types |
| babel-plugin-undeclared-variables-check | 1.0.2 | false | false | false | false | true | @lcdp/offline-plugin |
| babel-plugin-undefined-to-void | 1.1.6 | false | false | false | false | true | @lcdp/offline-plugin |
| bail | 1.0.5 | false | false | false | false | true | stylelint |
| base64-arraybuffer-es6 | 0.7.0 | false | false | false | true | true | fake-indexeddb |
| baseline-browser-mapping | 2.10.20 | false | false | false | false | true | @babel/core, @babel/plugin-proposal-object-rest-spread, @babel/plugin-transform-runtime, @babel/preset-env, @jest/globals, autoprefixer, babel-jest, babel-plugin-react-intl, browserslist, cssnano, eslint-plugin-compat, eslint-plugin-react-hooks, jest, stylelint, webpack |
| before-after-hook | 2.2.3 | false | false | false | false | true | danger |
| big.js | 3.2.0 | false | false | false | true | true | @lcdp/offline-plugin |
| big.js | 5.2.2 | false | false | false | false | true | babel-loader |
| bluebird | 2.11.0 | false | false | false | false | true | @lcdp/offline-plugin |
| bluebird | 3.7.2 | false | false | false | false | true | jsdoc |
| blurhash | 1.1.5 | false | false | false | false | true | blurhash |
| bonjour-service | 1.3.0 | false | false | false | false | true | webpack-dev-server |
| bowser | 2.14.1 | false | false | false | false | true | bowser |
| bs-logger | 0.2.6 | false | false | false | false | true | ts-jest |
| call-bind-apply-helpers | 1.0.2 | false | false | false | false | true | @testing-library/react, array-includes, axios, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, is-nan, jest-environment-jsdom, object.values, react-intl-translations-manager, util, webpack-dev-server |
| call-bind | 1.0.9 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, is-nan, object.values, react-intl-translations-manager, util |
| call-bound | 1.0.4 | false | false | false | false | true | @testing-library/react, array-includes, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, object.values, react-intl-translations-manager, util, webpack-dev-server |
| camel-case | 4.1.2 | false | false | false | false | true | html-webpack-plugin |
| caniuse-api | 3.0.0 | false | false | false | false | true | cssnano |
| catharsis | 0.9.0 | false | false | false | false | true | jsdoc |
| character-entities-legacy | 1.1.4 | false | false | false | false | true | stylelint |
| character-entities | 1.2.4 | false | false | false | false | true | stylelint |
| character-reference-invalid | 1.1.4 | false | false | false | false | true | stylelint |
| cheerio-select | 2.1.0 | false | false | false | true | true | cheerio |
| cheerio | 1.2.0 | false | false | false | false | true | cheerio |
| chokidar | 3.6.0 | false | false | false | false | true | fork-ts-checker-webpack-plugin, sass, tailwindcss, webpack-dev-server |
| chownr | 3.0.0 | false | false | false | false | true | @jest/globals, @lcdp/offline-plugin, babel-jest, fork-ts-checker-webpack-plugin, jest, sass, tailwindcss, webpack-dev-server |
| chrome-trace-event | 1.0.4 | false | false | false | false | true | webpack |
| ci-info | 3.9.0 | false | false | false | false | true | @jest/globals, @types/jest, babel-jest, jest, jest-environment-jsdom, ts-jest |
| ci-info | 4.4.0 | false | false | false | false | true | @testing-library/jest-dom |
| cjs-module-lexer | 1.4.3 | false | false | false | false | true | jest |
| cliui | 7.0.4 | false | false | false | false | true | commit-and-tag-version, yargs |
| cliui | 8.0.1 | false | false | false | false | true | @commitlint/cli, commit-and-tag-version, jest |
| co | 4.6.0 | false | false | false | false | true | jest |
| collect-v8-coverage | 1.0.3 | false | false | false | false | true | jest |
| colord | 2.9.3 | false | false | false | false | true | cssnano |
| colorette | 2.0.20 | false | false | false | false | true | lint-staged, webpack-cli, webpack-dev-server |
| comment-parser | 1.4.1 | false | false | false | false | true | eslint-plugin-jsdoc |
| copy-webpack-plugin | 9.1.0 | false | false | false | false | true | copy-webpack-plugin |
| core-js | 3.49.0 | true | false | false | false | false | core-js, danger, fake-indexeddb, feather-icons |
| core-util-is | 1.0.3 | false | false | false | false | true | @lcdp/offline-plugin, @metamask/providers, commit-and-tag-version, webpack-dev-server |
| cosmiconfig-typescript-loader | 6.3.0 | false | false | false | false | true | @commitlint/cli |
| cosmiconfig | 7.1.0 | false | false | false | false | true | babel-plugin-preval, fork-ts-checker-webpack-plugin, postcss-loader, stylelint |
| cosmiconfig | 9.0.1 | false | false | false | false | true | @commitlint/cli |
| css-declaration-sorter | 6.4.1 | false | false | false | false | true | cssnano |
| css-loader | 6.11.0 | false | false | false | false | true | css-loader |
| css-select | 4.3.0 | false | false | false | false | true | cssnano, html-webpack-plugin |
| css-select | 5.2.2 | false | false | false | true | true | cheerio |
| css-tree | 1.1.3 | false | false | false | false | true | cssnano |
| css-what | 6.2.2 | false | false | false | false | true | cheerio, cssnano, html-webpack-plugin |
| cssesc | 3.0.0 | false | false | false | false | true | @tailwindcss/typography, css-loader, cssnano, stylelint, stylelint-scss, tailwindcss |
| csso | 4.2.0 | false | false | false | false | true | cssnano |
| cssstyle | 2.3.0 | false | false | false | false | true | jest-environment-jsdom |
| csstype | 3.2.3 | false | false | false | false | true | @types/qrcode.react, @types/react-datepicker, @types/react-helmet, @types/react-motion, @types/react-router-dom, @types/react-sparklines, @types/react-swipeable-views, @types/react-toggle, react-intl, react-redux |
| danger | 11.3.1 | false | false | false | false | true | danger |
| data-view-buffer | 1.0.2 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| data-view-byte-length | 1.0.2 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| data-view-byte-offset | 1.0.1 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| dedent | 0.7.0 | false | false | false | false | true | jest |
| deep-equal | 2.2.3 | false | false | false | false | true | @testing-library/react |
| deepmerge | 4.3.1 | false | false | false | false | true | fork-ts-checker-webpack-plugin, jest, webpack-assets-manifest |
| defer-to-connect | 2.0.1 | false | false | false | false | true | danger |
| define-data-property | 1.1.4 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, is-nan, object.values, react-intl-translations-manager, util |
| define-properties | 1.2.1 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, is-nan, object.values |
| defined | 1.0.1 | false | false | false | false | true | @lcdp/offline-plugin |
| detect-browser | 5.3.0 | false | false | false | false | true | @metamask/providers |
| detect-it | 4.0.1 | false | false | false | false | true | detect-passive-events |
| detect-passive-events | 2.0.3 | false | false | false | false | true | detect-passive-events |
| dlv | 1.1.3 | false | false | false | false | true | tailwindcss |
| doctrine | 3.0.0 | false | false | false | false | true | eslint |
| dom-accessibility-api | 0.5.16 | false | false | false | false | true | @testing-library/jest-dom, @testing-library/react |
| dom-converter | 0.2.0 | false | false | false | false | true | html-webpack-plugin |
| dom-serializer | 1.4.1 | false | false | false | false | true | cssnano, html-webpack-plugin |
| dom-serializer | 2.0.0 | false | false | false | false | true | cheerio |
| domelementtype | 2.3.0 | false | false | false | false | true | cheerio, cssnano, html-webpack-plugin, stylelint |
| domexception | 1.0.1 | false | false | false | false | true | fake-indexeddb |
| domexception | 4.0.0 | false | false | false | false | true | jest-environment-jsdom |
| domhandler | 4.3.1 | false | false | false | false | true | cssnano, html-webpack-plugin |
| domhandler | 5.0.3 | false | false | false | false | true | cheerio |
| dompurify | 3.4.12 | false | false | false | false | true | dompurify |
| domutils | 2.8.0 | false | false | false | false | true | cssnano, html-webpack-plugin |
| domutils | 3.2.2 | false | false | false | true | true | cheerio |
| dot-case | 3.0.4 | false | false | false | false | true | html-webpack-plugin |
| dunder-proto | 1.0.1 | false | false | false | false | true | @testing-library/react, array-includes, axios, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, is-nan, jest-environment-jsdom, object.values, react-intl-translations-manager, util, webpack-dev-server |
| electron-to-chromium | 1.5.344 | false | false | false | false | true | @babel/core, @babel/plugin-proposal-object-rest-spread, @babel/plugin-transform-runtime, @babel/preset-env, @jest/globals, autoprefixer, babel-jest, babel-plugin-react-intl, browserslist, cssnano, eslint-plugin-compat, eslint-plugin-react-hooks, jest, stylelint, webpack |
| emoji-mart | 5.6.0 | false | false | false | false | true | emoji-mart |
| emoji-regex | 10.6.0 | false | false | false | false | true | lint-staged |
| emoji-regex | 8.0.0 | false | false | false | false | true | @commitlint/cli, commit-and-tag-version, eslint, jest, stylelint, yargs |
| emoji-regex | 9.2.2 | false | false | false | false | true | eslint-plugin-jsx-a11y |
| encoding-sniffer | 0.2.1 | false | false | false | false | true | cheerio |
| enhanced-resolve | 5.20.1 | false | false | false | false | true | ts-loader, webpack |
| entities | 2.1.0 | false | false | false | false | true | jsdoc |
| entities | 2.2.0 | false | false | false | false | true | cssnano, html-webpack-plugin, stylelint |
| entities | 3.0.1 | false | false | false | false | true | entities |
| entities | 4.5.0 | false | false | false | true | true | cheerio |
| entities | 6.0.1 | false | false | false | false | true | cheerio |
| entities | 7.0.1 | false | false | false | false | true | cheerio |
| envinfo | 7.21.0 | false | false | false | false | true | webpack-cli |
| es-abstract | 1.24.2 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| es-define-property | 1.0.1 | false | false | false | false | true | @testing-library/react, array-includes, axios, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, is-nan, jest-environment-jsdom, object.values, react-intl-translations-manager, util, webpack-dev-server |
| es-errors | 1.3.0 | false | false | false | false | true | @babel/plugin-transform-runtime, @babel/preset-env, @lcdp/offline-plugin, @testing-library/react, array-includes, axios, babel-eslint, babel-plugin-preval, commit-and-tag-version, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, is-nan, jest, jest-environment-jsdom, object.values, react-intl-translations-manager, stylelint, tailwindcss, util, webpack-cli, webpack-dev-server |
| es-get-iterator | 1.1.3 | false | false | false | false | true | @testing-library/react |
| es-iterator-helpers | 1.3.2 | false | false | false | false | true | eslint-plugin-react |
| es-module-lexer | 1.7.0 | false | false | false | false | true | eslint-plugin-jsdoc |
| es-module-lexer | 2.0.0 | false | false | false | false | true | webpack |
| es-object-atoms | 1.1.1 | false | false | false | false | true | @testing-library/react, array-includes, axios, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, is-nan, jest-environment-jsdom, object.values, react-intl-translations-manager, util, webpack-dev-server |
| es-set-tostringtag | 2.1.0 | false | false | false | false | true | array-includes, axios, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, jest-environment-jsdom |
| es-shim-unscopables | 1.1.0 | false | false | false | false | true | eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| es-to-primitive | 1.3.0 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| es5-ext | 0.10.64 | true | false | false | false | false | es6-symbol |
| escalade | 3.2.0 | false | false | false | false | true | @babel/core, @babel/plugin-proposal-object-rest-spread, @babel/plugin-transform-runtime, @babel/preset-env, @commitlint/cli, @jest/globals, autoprefixer, babel-jest, babel-plugin-react-intl, browserslist, commit-and-tag-version, cssnano, eslint-plugin-compat, eslint-plugin-react-hooks, jest, stylelint, webpack, yargs |
| escodegen | 2.1.0 | false | false | false | false | true | jest-environment-jsdom |
| eslint-import-resolver-node | 0.3.10 | false | false | false | false | true | eslint-plugin-import |
| eslint-module-utils | 2.12.1 | false | false | false | false | true | eslint-plugin-import |
| eslint-plugin-compat | 4.2.0 | false | false | false | false | true | eslint-plugin-compat |
| eslint-plugin-import | 2.32.0 | false | false | false | false | true | eslint-plugin-import |
| eslint-plugin-jsdoc | 48.11.0 | false | false | false | false | true | eslint-plugin-jsdoc |
| eslint-plugin-jsx-a11y | 6.10.2 | false | false | false | false | true | eslint-plugin-jsx-a11y |
| eslint-plugin-react-hooks | 7.1.1 | false | false | false | false | true | eslint-plugin-react-hooks |
| eslint-plugin-react | 7.37.5 | false | false | false | false | true | eslint-plugin-react |
| eslint-scope | 5.1.1 | false | false | false | false | true | @typescript-eslint/eslint-plugin, eslint, webpack |
| eslint-utils | 2.1.0 | false | false | false | false | true | eslint |
| eslint-visitor-keys | 1.3.0 | false | false | false | false | true | babel-eslint, eslint |
| eslint-visitor-keys | 2.1.0 | false | false | false | false | true | eslint |
| eslint-visitor-keys | 3.4.3 | false | false | false | false | true | @typescript-eslint/eslint-plugin, @typescript-eslint/parser |
| eslint-visitor-keys | 4.2.1 | false | false | false | false | true | eslint-plugin-jsdoc |
| eslint | 7.32.0 | false | false | false | false | true | eslint |
| espree | 10.4.0 | false | false | false | false | true | eslint-plugin-jsdoc |
| espree | 7.3.1 | false | false | false | false | true | eslint |
| esprima-fb | 15001.1001.0-dev-harmony-fb | false | false | false | false | true | @lcdp/offline-plugin |
| esprima | 2.7.3 | false | false | false | false | true | @lcdp/offline-plugin |
| esprima | 3.1.3 | false | false | false | false | true | @lcdp/offline-plugin |
| esprima | 4.0.1 | false | false | false | false | true | @jest/globals, babel-jest, eslint, jest, jest-environment-jsdom |
| esquery | 1.7.0 | false | false | false | false | true | eslint, eslint-plugin-jsdoc |
| esutils | 2.0.3 | false | false | false | false | true | @babel/preset-env, @lcdp/offline-plugin, eslint, eslint-plugin-import, eslint-plugin-react, jest-environment-jsdom |
| eth-rpc-errors | 4.0.3 | false | false | false | false | true | @metamask/providers |
| eventemitter3 | 4.0.7 | false | false | false | false | true | webpack-dev-server |
| eventemitter3 | 5.0.4 | false | false | false | false | true | lint-staged |
| exponential-backoff | 3.1.3 | false | false | false | false | true | @jest/globals, @lcdp/offline-plugin, babel-jest, fork-ts-checker-webpack-plugin, jest, sass, tailwindcss, webpack-dev-server |
| extension-port-stream | 2.1.1 | false | false | false | false | true | @metamask/providers |
| fake-indexeddb | 3.1.8 | false | false | false | false | true | fake-indexeddb |
| fast-deep-equal | 3.1.3 | false | false | false | false | true | @commitlint/cli, axios-mock-adapter, babel-loader, babel-plugin-react-intl, copy-webpack-plugin, eslint, fork-ts-checker-webpack-plugin, mini-css-extract-plugin, stylelint, terser-webpack-plugin, webpack, webpack-assets-manifest, webpack-dev-server |
| fast-glob | 3.3.3 | false | false | false | false | true | @typescript-eslint/eslint-plugin, @typescript-eslint/parser, copy-webpack-plugin, stylelint, tailwindcss, webpack-deadcode-plugin |
| fast-json-patch | 3.1.1 | false | false | false | false | true | danger |
| fast-levenshtein | 2.0.6 | false | false | false | false | true | eslint |
| fast-xml-builder | 1.1.5 | false | false | false | false | true | commit-and-tag-version |
| fast-xml-parser | 5.7.1 | false | false | false | false | true | commit-and-tag-version |
| fastest-levenshtein | 1.0.16 | false | false | false | false | true | stylelint, webpack-cli |
| fdir | 6.5.0 | false | false | false | false | true | @jest/globals, @lcdp/offline-plugin, babel-jest, fork-ts-checker-webpack-plugin, jest, sass, tailwindcss, webpack-dev-server |
| feather-icons | 4.29.2 | false | false | false | false | true | feather-icons |
| flatted | 3.4.2 | false | false | false | false | true | eslint, stylelint |
| for-each | 0.3.5 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, util |
| fork-ts-checker-webpack-plugin | 7.3.0 | false | false | false | false | true | fork-ts-checker-webpack-plugin |
| form-data | 4.0.5 | false | false | false | false | true | axios, danger, jest-environment-jsdom |
| fs-monkey | 1.1.0 | false | false | false | false | true | fork-ts-checker-webpack-plugin, webpack-dev-server |
| fsevents | 1.2.13 | true | true | false | false | false | @lcdp/offline-plugin |
| fsevents | 2.3.3 | false | true | false | false | true | @jest/globals, babel-jest, fork-ts-checker-webpack-plugin, jest, sass, tailwindcss, webpack-dev-server |
| fsevents | 1.2.13 | true | true | false | false | false | @lcdp/offline-plugin |
| fsevents | 2.3.3 | false | true | false | false | true | @jest/globals, babel-jest, fork-ts-checker-webpack-plugin, jest, sass, tailwindcss, webpack-dev-server |
| function-bind | 1.1.2 | false | false | false | false | true | @babel/plugin-transform-runtime, @babel/preset-env, @lcdp/offline-plugin, @testing-library/react, array-includes, axios, babel-eslint, babel-plugin-preval, commit-and-tag-version, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, is-nan, jest, jest-environment-jsdom, object.values, react-intl-translations-manager, stylelint, tailwindcss, util, webpack-cli, webpack-dev-server |
| function.prototype.name | 1.1.8 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| functions-have-names | 1.2.3 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| generator-function | 2.0.1 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, util |
| get-caller-file | 2.0.5 | false | false | false | false | true | @commitlint/cli, commit-and-tag-version, jest, yargs |
| get-east-asian-width | 1.5.0 | false | false | false | false | true | lint-staged |
| get-intrinsic | 1.3.0 | false | false | false | false | true | @testing-library/react, array-includes, axios, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, is-nan, jest-environment-jsdom, object.values, react-intl-translations-manager, util, webpack-dev-server |
| get-proto | 1.0.1 | false | false | false | false | true | @testing-library/react, array-includes, axios, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, is-nan, jest-environment-jsdom, object.values, react-intl-translations-manager, util, webpack-dev-server |
| get-symbol-description | 1.1.0 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| glob | 5.0.15 | false | false | false | false | true | @lcdp/offline-plugin |
| glob | 7.2.3 | false | false | false | false | true | @jest/globals, babel-jest, babel-plugin-lodash, eslint, jest, react-intl-translations-manager, stylelint, webpack-dev-server |
| globalthis | 1.0.4 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| gonzales-pe | 4.3.0 | false | false | false | false | true | stylelint |
| gopd | 1.2.0 | false | false | false | false | true | @testing-library/react, array-includes, axios, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, is-nan, jest-environment-jsdom, object.values, react-intl-translations-manager, util, webpack-dev-server |
| got | 11.8.6 | false | false | false | false | true | danger |
| graphemer | 1.4.0 | false | false | false | false | true | @typescript-eslint/eslint-plugin |
| handlebars | 4.7.9 | false | false | false | false | true | commit-and-tag-version |
| has-bigints | 1.1.0 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| has-property-descriptors | 1.0.2 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, is-nan, object.values, react-intl-translations-manager, util |
| has-proto | 1.2.0 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| has-symbols | 1.1.0 | false | false | false | false | true | @testing-library/react, array-includes, axios, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, is-nan, jest-environment-jsdom, object.values, react-intl-translations-manager, util, webpack-dev-server |
| has-tostringtag | 1.0.2 | false | false | false | false | true | @testing-library/react, array-includes, axios, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, jest-environment-jsdom, util |
| hasown | 2.0.3 | false | false | false | false | true | @babel/plugin-transform-runtime, @babel/preset-env, @lcdp/offline-plugin, @testing-library/react, array-includes, axios, babel-eslint, babel-plugin-preval, commit-and-tag-version, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, is-nan, jest, jest-environment-jsdom, object.values, react-intl-translations-manager, stylelint, tailwindcss, util, webpack-cli, webpack-dev-server |
| he | 1.2.0 | false | false | false | false | true | html-webpack-plugin |
| history | 4.10.1 | false | false | false | false | true | history, react-router-dom |
| hoist-non-react-statics | 3.3.2 | false | false | false | false | true | @sentry/react, react-intl, react-redux, react-router-dom |
| hosted-git-info | 4.1.0 | false | false | false | false | true | commit-and-tag-version, stylelint |
| html-entities | 2.6.0 | false | false | false | false | true | webpack-dev-server |
| html-escaper | 2.0.2 | false | false | false | false | true | jest, webpack-bundle-analyzer |
| html-minifier-terser | 6.1.0 | false | false | false | false | true | html-webpack-plugin |
| html-webpack-harddisk-plugin | 2.0.0 | false | false | false | false | true | html-webpack-harddisk-plugin |
| html-webpack-plugin | 5.6.7 | false | false | false | false | true | html-webpack-plugin |
| htmlparser2 | 10.1.0 | false | false | false | false | true | cheerio |
| htmlparser2 | 6.1.0 | false | false | false | false | true | html-webpack-plugin |
| http-proxy-agent | 5.0.0 | false | false | false | false | true | danger, jest-environment-jsdom |
| http-proxy-middleware | 2.0.9 | false | false | false | false | true | webpack-dev-server |
| https-proxy-agent | 5.0.1 | false | false | false | false | true | danger, jest-environment-jsdom |
| icss-utils | 5.1.0 | false | false | false | false | true | css-loader |
| ignore | 4.0.6 | false | false | false | false | true | eslint |
| ignore | 5.3.2 | false | false | false | false | true | @typescript-eslint/eslint-plugin, @typescript-eslint/parser, copy-webpack-plugin, stylelint |
| immediate | 3.0.6 | false | false | false | false | true | @sentry/browser, @sentry/react, localforage |
| immer | 9.0.21 | false | false | false | false | true | @reduxjs/toolkit |
| import-meta-resolve | 4.2.0 | false | false | false | false | true | @commitlint/cli |
| imports-loader | 4.0.1 | false | false | false | false | true | imports-loader |
| ini | 1.3.8 | false | false | false | false | true | commit-and-tag-version, danger, stylelint |
| internal-slot | 1.1.0 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| intl-pluralrules | 1.3.1 | false | false | false | false | true | intl-pluralrules |
| intl | 1.2.5 | false | false | false | false | true | intl |
| ipaddr.js | 2.3.0 | false | false | false | false | true | webpack-dev-server |
| is-accessor-descriptor | 1.0.1 | false | false | false | false | true | @lcdp/offline-plugin |
| is-alphabetical | 1.0.4 | false | false | false | false | true | stylelint |
| is-alphanumerical | 1.0.4 | false | false | false | false | true | stylelint |
| is-arguments | 1.2.0 | false | false | false | false | true | @testing-library/react, util |
| is-array-buffer | 3.0.5 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| is-async-function | 2.1.1 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| is-bigint | 1.1.0 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| is-boolean-object | 1.2.2 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| is-callable | 1.2.7 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, util |
| is-core-module | 2.16.1 | false | false | false | false | true | @babel/plugin-transform-runtime, @babel/preset-env, @lcdp/offline-plugin, babel-eslint, babel-plugin-preval, commit-and-tag-version, eslint-plugin-import, eslint-plugin-react, jest, stylelint, tailwindcss, webpack-cli |
| is-data-descriptor | 1.0.1 | false | false | false | false | true | @lcdp/offline-plugin |
| is-data-view | 1.0.2 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| is-date-object | 1.1.0 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| is-decimal | 1.0.4 | false | false | false | false | true | stylelint |
| is-descriptor | 0.1.7 | false | false | false | false | true | @lcdp/offline-plugin |
| is-descriptor | 1.0.3 | false | false | false | false | true | @lcdp/offline-plugin |
| is-extglob | 1.0.0 | false | false | false | false | true | @lcdp/offline-plugin |
| is-finalizationregistry | 1.1.1 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| is-generator-function | 1.1.2 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, util |
| is-hexadecimal | 1.0.4 | false | false | false | false | true | stylelint |
| is-map | 2.0.3 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| is-nan | 1.3.2 | false | false | false | false | true | is-nan |
| is-negative-zero | 2.0.3 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| is-number-object | 1.1.1 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| is-plain-object | 5.0.0 | false | false | false | false | true | danger |
| is-potential-custom-element-name | 1.0.1 | false | false | false | false | true | jest-environment-jsdom |
| is-regex | 1.2.1 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, util |
| is-set | 2.0.3 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| is-shared-array-buffer | 1.0.4 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| is-string | 1.1.1 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| is-symbol | 1.1.1 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| is-typed-array | 1.1.15 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, util |
| is-weakmap | 2.0.2 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| is-weakref | 1.1.1 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| is-weakset | 2.0.4 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| isexe | 4.0.0 | false | false | false | false | true | @jest/globals, @lcdp/offline-plugin, babel-jest, fork-ts-checker-webpack-plugin, jest, sass, tailwindcss, webpack-dev-server |
| iso-639-1 | 3.1.5 | false | false | false | false | true | iso-639-1 |
| istanbul-reports | 3.2.0 | false | false | false | false | true | jest |
| iterator.prototype | 1.1.5 | false | false | false | false | true | eslint-plugin-react |
| jiti | 1.21.7 | false | false | false | false | true | tailwindcss |
| jiti | 2.6.1 | false | false | false | false | true | @commitlint/cli |
| js-tokens | 1.0.1 | false | false | false | false | true | @lcdp/offline-plugin |
| js-tokens | 4.0.0 | false | false | false | false | true | @babel/core, @babel/plugin-proposal-class-properties, @babel/plugin-proposal-decorators, @babel/plugin-transform-runtime, @babel/preset-env, @babel/preset-react, @babel/preset-typescript, @commitlint/cli, @jest/globals, @reach/menu-button, @reach/popover, @reach/rect, @reach/tabs, @reach/tooltip, @testing-library/jest-dom, @testing-library/react, @types/jest, @types/react-datepicker, babel-eslint, babel-jest, babel-plugin-lodash, babel-plugin-preval, babel-plugin-react-intl, babel-plugin-transform-require-context, commit-and-tag-version, eslint, eslint-plugin-react, eslint-plugin-react-hooks, fork-ts-checker-webpack-plugin, history, jest, jest-environment-jsdom, postcss-loader, prop-types, react, react-color, react-datepicker, react-dom, react-helmet, react-hotkeys, react-immutable-proptypes, react-motion, react-overlays, react-popper, react-redux, react-router-dom, react-router-scroll-4, react-sparklines, react-swipeable-views, stylelint |
| js-yaml | 4.1.1 | false | false | false | false | true | @commitlint/cli |
| js2xmlparser | 4.0.2 | false | false | false | false | true | jsdoc |
| jsdoc-type-pratt-parser | 4.0.0 | false | false | false | false | true | eslint-plugin-jsdoc |
| jsdom | 19.0.0 | false | false | false | false | true | jest-environment-jsdom |
| jsesc | 3.1.0 | false | false | false | false | true | @babel/core, @babel/plugin-proposal-class-properties, @babel/plugin-proposal-decorators, @babel/plugin-transform-runtime, @babel/preset-env, @babel/preset-react, @babel/preset-typescript, @jest/globals, babel-eslint, babel-jest, babel-plugin-lodash, babel-plugin-react-intl, eslint-plugin-react-hooks, jest, stylelint |
| json-parse-even-better-errors | 2.3.1 | false | false | false | false | true | @commitlint/cli, babel-plugin-preval, commit-and-tag-version, fork-ts-checker-webpack-plugin, jest, postcss-loader, stylelint |
| json-rpc-engine | 6.1.0 | false | false | false | false | true | @metamask/providers |
| json-rpc-middleware-stream | 3.0.0 | false | false | false | false | true | @metamask/providers |
| json-stable-stringify | 1.3.0 | false | false | false | false | true | react-intl-translations-manager |
| json-with-bigint | 3.5.8 | false | false | false | false | true | danger |
| json5 | 0.4.0 | false | false | false | false | true | @lcdp/offline-plugin |
| json5 | 0.5.1 | false | false | false | false | true | @lcdp/offline-plugin |
| json5 | 1.0.2 | false | false | false | false | true | eslint-plugin-import |
| json5 | 2.2.3 | false | false | false | false | true | @babel/core, @jest/globals, babel-jest, babel-loader, babel-plugin-react-intl, danger, eslint-plugin-react-hooks, jest, stylelint, ts-jest |
| jsonify | 0.0.1 | false | false | false | false | true | react-intl-translations-manager |
| jsx-ast-utils | 3.3.5 | false | false | false | false | true | eslint-plugin-jsx-a11y, eslint-plugin-react |
| keyv | 4.5.4 | false | false | false | false | true | danger, eslint, stylelint |
| kind-of | 3.2.2 | false | false | false | false | true | @lcdp/offline-plugin |
| kind-of | 4.0.0 | false | false | false | false | true | @lcdp/offline-plugin |
| kind-of | 6.0.3 | false | false | false | false | true | @lcdp/offline-plugin, commit-and-tag-version, stylelint, webpack-cli, webpack-merge |
| klona | 2.0.6 | false | false | false | false | true | postcss-loader, sass-loader |
| known-css-properties | 0.21.0 | false | false | false | true | true | stylelint |
| language-tags | 1.0.9 | false | false | false | false | true | eslint-plugin-jsx-a11y |
| libphonenumber-js | 1.12.41 | false | false | false | false | true | libphonenumber-js |
| lie | 3.1.1 | false | false | false | false | true | @sentry/browser, @sentry/react, localforage |
| lilconfig | 2.1.0 | false | false | false | false | true | cssnano |
| lines-and-columns | 1.2.4 | false | false | false | false | true | @commitlint/cli, babel-plugin-preval, commit-and-tag-version, fork-ts-checker-webpack-plugin, jest, postcss-loader, stylelint, tailwindcss |
| linkify-it | 3.0.3 | false | false | false | false | true | jsdoc |
| listr2 | 9.0.5 | false | false | false | false | true | lint-staged |
| localforage | 1.10.0 | false | false | false | false | true | @sentry/browser, @sentry/react, localforage |
| lodash-es | 4.18.1 | false | false | false | true | false | react-color |
| lodash.camelcase | 4.3.0 | false | false | false | true | false | @commitlint/cli |
| lodash.debounce | 4.0.8 | false | false | false | true | false | @babel/plugin-transform-runtime, @babel/preset-env |
| lodash.find | 4.6.0 | false | false | false | true | false | danger |
| lodash.get | 4.4.2 | false | false | false | true | false | webpack-assets-manifest |
| lodash.has | 4.5.2 | false | false | false | true | false | webpack-assets-manifest |
| lodash.includes | 4.3.0 | false | false | false | true | false | danger |
| lodash.isboolean | 3.0.3 | false | false | false | true | false | danger, react-hotkeys |
| lodash.isequal | 4.5.0 | false | false | false | true | false | react-hotkeys |
| lodash.isinteger | 4.0.4 | false | false | false | true | false | danger |
| lodash.ismatch | 4.4.0 | false | false | false | true | false | commit-and-tag-version |
| lodash.isnumber | 3.0.3 | false | false | false | true | false | danger |
| lodash.isobject | 3.0.2 | false | false | false | true | false | danger, react-hotkeys |
| lodash.isplainobject | 4.0.6 | false | false | false | true | false | @commitlint/cli, danger |
| lodash.isstring | 4.0.1 | false | false | false | true | false | danger |
| lodash.kebabcase | 4.1.1 | false | false | false | true | false | @commitlint/cli |
| lodash.keys | 4.2.0 | false | false | false | true | false | danger |
| lodash.mapvalues | 4.6.0 | false | false | false | true | false | danger |
| lodash.memoize | 4.1.2 | false | false | false | true | false | cssnano, danger, eslint-plugin-compat, ts-jest |
| lodash.merge | 4.6.2 | false | false | false | true | false | @commitlint/cli, eslint |
| lodash.mergewith | 4.6.2 | false | false | false | true | false | @commitlint/cli |
| lodash.once | 4.1.1 | false | false | false | true | false | danger |
| lodash.snakecase | 4.1.1 | false | false | false | true | false | @commitlint/cli |
| lodash.startcase | 4.4.0 | false | false | false | true | false | @commitlint/cli |
| lodash.truncate | 4.4.2 | false | false | false | true | false | eslint, stylelint |
| lodash.uniq | 4.5.0 | false | false | false | true | false | @commitlint/cli, cssnano |
| lodash.upperfirst | 4.3.1 | false | false | false | true | false | @commitlint/cli |
| lodash | 3.10.1 | false | false | false | true | false | @lcdp/offline-plugin |
| lodash | 4.18.1 | false | false | false | true | false | @testing-library/jest-dom, babel-plugin-lodash, fake-indexeddb, html-webpack-plugin, jsdoc, lodash, react-color, stylelint, stylelint-scss |
| longest-streak | 2.0.4 | false | false | false | false | true | stylelint |
| lower-case | 2.0.2 | false | false | false | false | true | html-webpack-plugin |
| lru-cache | 6.0.0 | false | false | false | false | true | commit-and-tag-version, stylelint |
| make-error | 1.3.6 | false | false | false | false | true | ts-jest |
| markdown-it-anchor | 8.6.7 | false | false | false | false | true | jsdoc |
| markdown-it | 12.3.2 | false | false | false | false | true | jsdoc |
| marked | 4.3.0 | false | false | false | false | true | jsdoc |
| marky | 1.3.0 | false | false | false | false | true | marky |
| math-intrinsics | 1.1.0 | false | false | false | false | true | @testing-library/react, array-includes, axios, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, is-nan, jest-environment-jsdom, object.values, react-intl-translations-manager, util, webpack-dev-server |
| mathml-tag-names | 2.1.3 | false | false | false | false | true | stylelint |
| mdast-util-from-markdown | 0.8.5 | false | false | false | false | true | stylelint |
| mdast-util-to-markdown | 0.6.5 | false | false | false | false | true | stylelint |
| mdast-util-to-string | 2.0.0 | false | false | false | false | true | stylelint |
| memfs-or-file-map-to-github-branch | 1.3.0 | false | false | false | false | true | danger |
| memfs | 3.6.0 | false | false | false | false | true | fork-ts-checker-webpack-plugin, webpack-dev-server |
| meow | 12.1.1 | false | false | false | false | true | @commitlint/cli |
| micromark | 2.11.4 | false | false | false | false | true | stylelint |
| mime-db | 1.52.0 | false | false | false | false | true | axios, danger, jest-environment-jsdom, webpack-dev-server |
| mime-db | 1.54.0 | false | false | false | false | true | webpack, webpack-dev-server |
| mime | 1.6.0 | false | false | false | false | true | webpack-dev-server |
| mime | 3.0.0 | false | false | false | false | true | danger |
| mini-create-react-context | 0.4.1 | false | false | false | false | true | react-router-dom |
| mini-css-extract-plugin | 2.10.2 | false | false | false | false | true | mini-css-extract-plugin |
| minimatch | 2.0.10 | false | false | false | false | true | @lcdp/offline-plugin |
| minimatch | 5.1.9 | false | false | false | false | true | @lcdp/offline-plugin |
| minimist | 1.2.8 | false | false | false | false | true | @commitlint/cli, @lcdp/offline-plugin, commit-and-tag-version, danger, eslint-plugin-import, react-intl-translations-manager, stylelint |
| minipass | 7.1.3 | false | false | false | false | true | @jest/globals, @lcdp/offline-plugin, babel-jest, fork-ts-checker-webpack-plugin, jest, sass, tailwindcss, webpack-dev-server |
| minizlib | 3.1.0 | false | false | false | false | true | @jest/globals, @lcdp/offline-plugin, babel-jest, fork-ts-checker-webpack-plugin, jest, sass, tailwindcss, webpack-dev-server |
| mrmime | 2.0.1 | false | false | false | false | true | webpack-bundle-analyzer |
| nan | 2.26.2 | false | true | false | false | false | @lcdp/offline-plugin |
| natural-compare-lite | 1.4.0 | false | false | false | false | true | @typescript-eslint/eslint-plugin |
| natural-compare | 1.4.0 | false | false | false | false | true | @jest/globals, eslint, jest |
| no-case | 3.0.4 | false | false | false | false | true | html-webpack-plugin |
| node-exports-info | 1.6.0 | false | false | false | false | true | eslint-plugin-import, eslint-plugin-react |
| node-fetch | 2.7.0 | false | false | false | false | true | danger |
| node-forge | 1.4.0 | false | false | false | false | true | webpack-dev-server |
| node-gyp | 12.3.0 | false | false | false | true | false | @jest/globals, @lcdp/offline-plugin, babel-jest, fork-ts-checker-webpack-plugin, jest, sass, tailwindcss, webpack-dev-server |
| node-releases | 2.0.37 | false | false | false | false | true | @babel/core, @babel/plugin-proposal-object-rest-spread, @babel/plugin-transform-runtime, @babel/preset-env, @jest/globals, autoprefixer, babel-jest, babel-plugin-react-intl, browserslist, cssnano, eslint-plugin-compat, eslint-plugin-react-hooks, jest, stylelint, webpack |
| normalize-package-data | 3.0.3 | false | false | false | false | true | commit-and-tag-version, stylelint |
| nth-check | 2.1.1 | false | false | false | true | true | cheerio, cssnano, html-webpack-plugin |
| object-fit-images | 3.2.4 | false | false | false | false | true | object-fit-images |
| object-hash | 3.0.0 | false | false | false | false | true | tailwindcss |
| object-inspect | 1.13.4 | false | false | false | false | true | @testing-library/react, array-includes, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, webpack-dev-server |
| object-is | 1.1.6 | false | false | false | false | true | @testing-library/react |
| object.assign | 4.1.7 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| object.entries | 1.1.9 | false | false | false | false | true | eslint-plugin-import, eslint-plugin-react |
| object.fromentries | 2.0.8 | false | false | false | false | true | eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| object.groupby | 1.0.3 | false | false | false | false | true | eslint-plugin-import |
| object.values | 1.2.1 | false | false | false | false | true | eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, object.values |
| override-require | 1.1.1 | false | false | false | false | true | danger |
| own-keys | 1.0.1 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| param-case | 3.0.4 | false | false | false | false | true | html-webpack-plugin |
| parse-diff | 0.7.1 | false | false | false | false | true | danger |
| parse-entities | 2.0.0 | false | false | false | false | true | stylelint |
| parse-github-url | 1.0.4 | false | false | false | false | true | danger |
| parse-glob | 3.0.4 | false | false | false | false | true | @lcdp/offline-plugin |
| parse-imports | 2.2.1 | false | false | false | false | true | eslint-plugin-jsdoc |
| parse5-htmlparser2-tree-adapter | 7.1.0 | false | false | false | false | true | cheerio |
| parse5-parser-stream | 7.1.2 | false | false | false | false | true | cheerio |
| parse5 | 7.3.0 | false | false | false | false | true | cheerio |
| pascal-case | 3.1.2 | false | false | false | false | true | html-webpack-plugin |
| performance-now | 0.2.0 | false | false | false | false | true | react-motion |
| performance-now | 2.1.0 | false | false | false | false | true | raf, react-motion |
| possible-typed-array-names | 1.1.0 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, util |
| postcss-calc | 8.2.4 | false | false | false | false | true | cssnano |
| postcss-loader | 7.0.0 | false | false | false | false | true | postcss-loader |
| postcss-media-query-parser | 0.2.3 | false | false | false | false | true | stylelint, stylelint-scss |
| postcss-modules-extract-imports | 3.1.0 | false | false | false | false | true | css-loader |
| postcss-modules-local-by-default | 4.2.0 | false | false | false | false | true | css-loader |
| postcss-modules-scope | 3.2.1 | false | false | false | false | true | css-loader |
| postcss-modules-values | 4.0.0 | false | false | false | false | true | css-loader |
| postcss-safe-parser | 4.0.2 | false | false | false | false | true | stylelint |
| postcss-sass | 0.4.4 | false | false | false | false | true | stylelint |
| postcss-selector-parser | 6.0.10 | false | false | false | false | true | @tailwindcss/typography |
| postcss-selector-parser | 6.1.2 | false | false | false | false | true | cssnano, stylelint, stylelint-scss, tailwindcss |
| postcss-selector-parser | 7.1.1 | false | false | false | false | true | css-loader |
| pretty-error | 4.0.0 | false | false | false | false | true | html-webpack-plugin |
| prompts | 2.4.2 | false | false | false | false | true | jest |
| prop-types-extra | 1.1.1 | false | false | false | false | true | react-overlays |
| prop-types | 15.8.1 | false | false | false | false | true | @reach/menu-button, @reach/popover, @reach/rect, @reach/tabs, @reach/tooltip, eslint-plugin-react, prop-types, react-color, react-datepicker, react-helmet, react-hotkeys, react-motion, react-overlays, react-redux, react-router-dom, react-sparklines, react-swipeable-views |
| psl | 1.15.0 | false | false | false | false | true | jest-environment-jsdom |
| punycode | 2.3.1 | false | false | false | false | true | babel-loader, babel-plugin-react-intl, copy-webpack-plugin, eslint, fake-indexeddb, fork-ts-checker-webpack-plugin, jest-environment-jsdom, punycode, webpack-assets-manifest |
| q | 1.5.1 | false | false | false | false | true | @lcdp/offline-plugin |
| qrcode.react | 3.2.0 | false | false | false | false | true | qrcode.react |
| qs | 6.14.2 | false | false | false | false | true | webpack-dev-server |
| qs | 6.15.1 | false | false | false | false | true | danger |
| quote | 0.4.0 | false | false | false | false | true | postcss-object-fit-images |
| react-color | 2.19.3 | false | false | false | false | true | react-color |
| react-datepicker | 4.25.0 | false | false | false | false | true | react-datepicker |
| react-error-boundary | 3.1.4 | false | false | false | false | true | @testing-library/react-hooks |
| react-event-listener | 0.6.7 | false | false | false | false | true | react-swipeable-views |
| react-from-dom | 0.6.2 | false | false | false | false | true | react-inlinesvg |
| react-helmet | 6.1.0 | false | false | false | false | true | react-helmet |
| react-hotkeys | 1.1.4 | false | false | false | false | true | react-hotkeys |
| react-immutable-proptypes | 2.2.0 | false | false | false | false | true | react-immutable-proptypes |
| react-immutable-pure-component | 2.2.2 | false | false | false | false | true | react-immutable-pure-component |
| react-inlinesvg | 3.0.3 | false | false | false | true | true | react-inlinesvg |
| react-intl-translations-manager | 5.0.3 | false | false | false | false | true | react-intl-translations-manager |
| react-lifecycles-compat | 3.0.4 | false | false | false | false | true | react-overlays |
| react-motion | 0.5.2 | false | false | false | false | true | react-motion |
| react-onclickoutside | 6.13.2 | false | false | false | false | true | react-datepicker |
| react-otp-input | 2.4.0 | false | false | false | false | true | react-otp-input |
| react-overlays | 0.9.0 | false | false | false | false | true | react-overlays |
| react-popper | 2.3.0 | false | false | false | false | true | @types/react-datepicker, react-datepicker, react-popper |
| react-redux | 7.2.9 | false | false | false | false | true | react-redux |
| react-router-dom | 5.3.0 | false | false | false | false | true | react-router-dom |
| react-router-scroll-4 | 1.0.0-beta.2 | false | false | false | false | true | react-router-scroll-4 |
| react-router | 5.2.1 | false | false | false | false | true | react-router-dom |
| react-side-effect | 2.1.2 | false | false | false | false | true | react-helmet |
| react-simple-pull-to-refresh | 1.3.4 | false | false | false | false | true | react-simple-pull-to-refresh |
| react-sparklines | 1.7.0 | false | false | false | false | true | react-sparklines |
| react-sticky-box | 1.0.2 | false | false | false | false | true | react-sticky-box |
| react-swipeable-views-core | 0.14.1 | false | false | false | false | true | react-swipeable-views |
| react-swipeable-views-utils | 0.14.1 | false | false | false | false | true | react-swipeable-views |
| react-swipeable-views | 0.14.1 | false | false | false | false | true | react-swipeable-views |
| react-textarea-autosize | 8.5.9 | false | false | false | false | true | react-textarea-autosize |
| react-toggle | 4.1.3 | false | false | false | false | true | react-toggle |
| react-virtuoso | 2.19.1 | false | false | false | false | true | react-virtuoso |
| reactcss | 1.2.3 | false | false | false | false | true | react-color |
| realistic-structured-clone | 2.0.4 | false | false | false | false | true | fake-indexeddb |
| redux-immutable | 4.0.0 | false | false | false | false | true | redux-immutable |
| redux-thunk | 2.4.2 | false | false | false | false | true | @reduxjs/toolkit, redux-thunk |
| redux | 4.2.1 | false | false | false | false | true | @reduxjs/toolkit, @types/redux-mock-store, react-redux, redux |
| reflect.getprototypeof | 1.0.10 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| regenerate-unicode-properties | 10.2.2 | false | false | false | false | true | @babel/preset-env |
| regexp.prototype.flags | 1.5.4 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| regexpp | 3.2.0 | false | false | false | false | true | eslint |
| regexpu-core | 6.4.0 | false | false | false | false | true | @babel/preset-env |
| regexpu | 1.3.0 | false | false | false | false | true | @lcdp/offline-plugin |
| renderkid | 3.0.0 | false | false | false | false | true | html-webpack-plugin |
| reselect | 4.1.8 | false | false | false | false | true | @reduxjs/toolkit, reselect |
| resize-observer-polyfill | 1.5.1 | false | false | false | false | true | react-sticky-box |
| resolve-pathname | 3.0.0 | false | false | false | false | true | history, react-router-dom |
| resolve.exports | 1.1.1 | false | false | false | false | true | jest |
| resolve | 1.22.12 | false | false | false | false | true | @babel/plugin-transform-runtime, @babel/preset-env, @lcdp/offline-plugin, babel-eslint, babel-plugin-preval, commit-and-tag-version, jest, stylelint, tailwindcss, webpack-cli |
| resolve | 2.0.0-next.6 | false | false | false | false | true | eslint-plugin-import, eslint-plugin-react |
| resolve | 1.22.12 | false | false | false | false | true | @babel/plugin-transform-runtime, @babel/preset-env, @lcdp/offline-plugin, babel-eslint, babel-plugin-preval, commit-and-tag-version, jest, stylelint, tailwindcss, webpack-cli |
| resolve | 2.0.0-next.6 | false | false | false | false | true | eslint-plugin-import, eslint-plugin-react |
| safe-array-concat | 1.1.3 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| safe-push-apply | 1.0.0 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| safe-regex-test | 1.1.0 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, util |
| sass-loader | 13.0.0 | false | false | false | false | true | sass-loader |
| saxes | 5.0.1 | false | false | false | false | true | jest-environment-jsdom |
| schema-utils | 2.7.1 | false | false | false | false | true | babel-loader, babel-plugin-react-intl |
| schema-utils | 3.3.0 | false | false | false | false | true | copy-webpack-plugin, fork-ts-checker-webpack-plugin, webpack-assets-manifest |
| schema-utils | 4.3.3 | false | false | false | false | true | babel-plugin-react-intl, mini-css-extract-plugin, terser-webpack-plugin, webpack, webpack-dev-server |
| scroll-behavior | 0.9.12 | false | false | false | false | true | react-router-scroll-4 |
| set-function-length | 1.2.2 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, is-nan, object.values, react-intl-translations-manager, util |
| set-function-name | 2.0.2 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| set-proto | 1.0.0 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| setprototypeof | 1.2.0 | false | false | false | false | true | webpack-dev-server |
| shallow-equal | 1.2.1 | false | false | false | false | true | react-swipeable-views |
| side-channel-list | 1.0.1 | false | false | false | false | true | @testing-library/react, array-includes, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, webpack-dev-server |
| side-channel-map | 1.0.1 | false | false | false | false | true | @testing-library/react, array-includes, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, webpack-dev-server |
| side-channel-weakmap | 1.0.2 | false | false | false | false | true | @testing-library/react, array-includes, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, webpack-dev-server |
| side-channel | 1.1.0 | false | false | false | false | true | @testing-library/react, array-includes, danger, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, webpack-dev-server |
| signal-exit | 3.0.7 | false | false | false | false | true | @jest/globals, babel-jest, jest, stylelint, webpack-assets-manifest, webpack-dev-server |
| signal-exit | 4.1.0 | false | false | false | false | true | lint-staged |
| slashes | 3.0.12 | false | false | false | false | true | eslint-plugin-jsdoc |
| source-map-js | 1.2.1 | false | false | false | false | true | css-loader, postcss, tailwindcss |
| source-map-resolve | 0.5.3 | false | false | false | false | true | @lcdp/offline-plugin |
| source-map-support | 0.5.13 | false | false | false | false | true | jest |
| source-map-support | 0.5.21 | false | false | false | false | true | html-webpack-plugin, terser-webpack-plugin, webpack |
| source-map | 0.1.32 | false | false | false | false | true | @lcdp/offline-plugin |
| source-map | 0.5.7 | false | false | false | false | true | @lcdp/offline-plugin, postcss-object-fit-images |
| source-map | 0.6.1 | false | false | false | false | true | commit-and-tag-version, cssnano, html-webpack-plugin, imports-loader, jest, jest-environment-jsdom, stylelint, terser-webpack-plugin, webpack |
| spdx-exceptions | 2.5.0 | false | false | false | false | true | commit-and-tag-version, eslint-plugin-jsdoc, stylelint |
| spdx-license-ids | 3.0.23 | false | false | false | false | true | commit-and-tag-version, eslint-plugin-jsdoc, stylelint |
| specificity | 0.4.1 | false | false | false | false | true | stylelint |
| stable | 0.1.8 | false | false | false | false | true | @lcdp/offline-plugin, cssnano |
| stack-utils | 2.0.6 | false | false | false | false | true | @jest/globals, @testing-library/jest-dom, @types/jest, jest, jest-environment-jsdom |
| statuses | 1.5.0 | false | false | false | false | true | webpack-dev-server |
| statuses | 2.0.2 | false | false | false | false | true | webpack-dev-server |
| stop-iteration-iterator | 1.1.0 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| string-argv | 0.3.2 | false | false | false | false | true | lint-staged |
| string.prototype.matchall | 4.0.12 | false | false | false | false | true | eslint-plugin-react |
| string.prototype.trim | 1.2.10 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| string.prototype.trimend | 1.0.9 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| string.prototype.trimstart | 1.0.8 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| stringz | 2.1.0 | false | false | false | false | true | stringz |
| stylelint-config-recommended | 5.0.0 | false | false | false | false | true | stylelint-config-standard |
| stylelint-config-standard | 22.0.0 | false | false | false | false | true | stylelint-config-standard |
| stylelint-scss | 3.21.0 | false | false | false | false | true | stylelint-scss |
| stylelint | 13.13.1 | false | false | false | false | true | stylelint |
| sucrase | 3.35.1 | false | false | false | false | true | tailwindcss |
| supports-hyperlinks | 2.3.0 | false | false | false | false | true | jest |
| supports-preserve-symlinks-flag | 1.0.0 | false | false | false | false | true | @babel/plugin-transform-runtime, @babel/preset-env, @lcdp/offline-plugin, babel-eslint, babel-plugin-preval, commit-and-tag-version, eslint-plugin-import, eslint-plugin-react, jest, stylelint, tailwindcss, webpack-cli |
| svgo | 2.8.2 | false | false | false | false | true | cssnano |
| table | 6.9.0 | false | false | false | false | true | eslint, stylelint |
| tailwindcss | 3.4.19 | false | false | false | false | true | tailwindcss |
| tar | 7.5.13 | false | false | false | false | true | @jest/globals, @lcdp/offline-plugin, babel-jest, fork-ts-checker-webpack-plugin, jest, sass, tailwindcss, webpack-dev-server |
| terser-webpack-plugin | 5.4.0 | false | false | false | false | true | terser-webpack-plugin, webpack |
| terser | 5.46.1 | false | false | false | false | true | html-webpack-plugin, terser-webpack-plugin, webpack |
| tiny-invariant | 1.3.3 | false | false | false | false | true | history, react-router-dom |
| tiny-warning | 1.0.3 | false | false | false | false | true | @reach/menu-button, @reach/popover, @reach/portal, @reach/rect, @reach/tabs, @reach/tooltip, history, react-router-dom |
| tinyexec | 1.1.1 | false | false | false | false | true | @commitlint/cli, lint-staged |
| tinyglobby | 0.2.16 | false | false | false | false | true | @jest/globals, @lcdp/offline-plugin, babel-jest, fork-ts-checker-webpack-plugin, jest, sass, tailwindcss, webpack-dev-server |
| totalist | 3.0.1 | false | false | false | false | true | webpack-bundle-analyzer |
| tr46 | 0.0.3 | false | false | false | false | true | danger |
| tr46 | 2.1.0 | false | false | false | false | true | fake-indexeddb |
| tr46 | 3.0.0 | false | false | false | false | true | jest-environment-jsdom |
| trough | 1.0.5 | false | false | false | false | true | stylelint |
| ts-interface-checker | 0.1.13 | false | false | false | false | true | tailwindcss |
| ts-jest | 28.0.8 | false | false | false | false | true | ts-jest |
| ts-loader | 9.5.7 | false | false | false | false | true | ts-loader |
| tsconfig-paths | 3.15.0 | false | false | false | false | true | eslint-plugin-import |
| tsutils | 3.21.0 | false | false | false | false | true | @typescript-eslint/eslint-plugin, @typescript-eslint/parser |
| twemoji-parser | 14.0.0 | false | false | false | false | true | twemoji |
| twemoji | 14.0.2 | false | false | false | false | true | twemoji |
| type-detect | 4.0.8 | false | false | false | false | true | @jest/globals, jest, jest-environment-jsdom |
| typed-array-buffer | 1.0.3 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| typed-array-byte-length | 1.0.3 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| typed-array-byte-offset | 1.0.4 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| typed-array-length | 1.0.7 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| typescript | 4.9.5 | false | false | false | false | true | babel-plugin-react-intl, typescript |
| typescript | 4.9.5 | false | false | false | false | true | babel-plugin-react-intl, typescript |
| typeson-registry | 1.0.0-alpha.39 | false | false | false | true | true | fake-indexeddb |
| typeson | 6.1.0 | false | false | false | true | true | fake-indexeddb |
| unbox-primitive | 1.1.0 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| underscore | 1.13.8 | false | false | false | false | true | jsdoc |
| undici | 6.25.0 | false | false | false | false | true | @jest/globals, @lcdp/offline-plugin, babel-jest, fork-ts-checker-webpack-plugin, jest, sass, tailwindcss, webpack-dev-server |
| undici | 7.25.0 | false | false | false | false | true | cheerio |
| unicode-match-property-value-ecmascript | 2.2.1 | false | false | false | false | true | @babel/preset-env |
| unicode-property-aliases-ecmascript | 2.2.0 | false | false | false | true | true | @babel/preset-env |
| unified | 9.2.2 | false | false | false | false | true | stylelint |
| unist-util-find-all-after | 3.0.2 | false | false | false | false | true | stylelint |
| unist-util-is | 4.1.0 | false | false | false | false | true | stylelint |
| unist-util-stringify-position | 2.0.3 | false | false | false | false | true | stylelint |
| uri-js | 4.4.1 | false | false | false | false | true | babel-loader, babel-plugin-react-intl, copy-webpack-plugin, eslint, fork-ts-checker-webpack-plugin, webpack-assets-manifest |
| url-parse | 1.5.10 | false | false | false | false | true | jest-environment-jsdom |
| use-composed-ref | 1.4.0 | false | false | false | false | true | react-textarea-autosize |
| use-isomorphic-layout-effect | 1.2.1 | false | false | false | false | true | react-textarea-autosize |
| use-latest | 1.3.0 | false | false | false | false | true | react-textarea-autosize |
| utila | 0.4.0 | false | false | false | false | true | html-webpack-plugin |
| uuid | 8.3.2 | false | false | false | false | true | jest-junit, uuid, webpack-dev-server |
| value-equal | 1.0.1 | false | false | false | false | true | history, react-router-dom |
| vfile-message | 2.0.4 | false | false | false | false | true | stylelint |
| vfile | 4.2.1 | false | false | false | false | true | stylelint |
| webextension-polyfill-ts | 0.25.0 | false | false | false | false | true | @metamask/providers |
| webextension-polyfill | 0.12.0 | false | false | false | false | true | @metamask/providers |
| webextension-polyfill | 0.7.0 | false | false | false | false | true | @metamask/providers |
| webpack-bundle-analyzer | 4.10.2 | false | false | false | false | true | webpack-bundle-analyzer |
| webpack-dev-middleware | 5.3.4 | false | false | false | false | true | webpack-dev-server |
| webpack-dev-server | 4.9.1 | false | false | false | false | true | webpack-dev-server |
| webpack-merge | 5.10.0 | false | false | false | false | true | webpack-cli, webpack-merge |
| webpack | 5.106.2 | false | false | false | false | true | webpack |
| whatwg-encoding | 2.0.0 | false | false | false | false | true | jest-environment-jsdom |
| whatwg-encoding | 3.1.1 | false | false | false | false | true | cheerio |
| whatwg-url | 10.0.0 | false | false | false | false | true | jest-environment-jsdom |
| whatwg-url | 11.0.0 | false | false | false | false | true | jest-environment-jsdom |
| whatwg-url | 5.0.0 | false | false | false | false | true | danger |
| whatwg-url | 8.7.0 | false | false | false | false | true | fake-indexeddb |
| which-boxed-primitive | 1.1.1 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| which-builtin-type | 1.2.1 | false | false | false | false | true | array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| which-collection | 1.0.2 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react |
| which-typed-array | 1.1.20 | false | false | false | false | true | @testing-library/react, array-includes, eslint-plugin-import, eslint-plugin-jsx-a11y, eslint-plugin-react, util |
| which | 2.0.2 | false | false | false | false | true | cross-env, eslint, jest, webpack-cli, webpack-dev-server |
| wicg-inert | 3.1.3 | false | false | false | false | true | wicg-inert |
| write-file-atomic | 3.0.3 | false | false | false | false | true | stylelint |
| write-file-atomic | 4.0.2 | false | false | false | false | true | @jest/globals, babel-jest, jest |
| xcase | 2.0.1 | false | false | false | false | true | danger |
| xmlchars | 2.2.0 | false | false | false | false | true | jest-environment-jsdom |
| xmlcreate | 2.0.4 | false | false | false | false | true | jsdoc |
| y18n | 5.0.8 | false | false | false | false | true | @commitlint/cli, commit-and-tag-version, jest, yargs |
| yallist | 5.0.0 | false | false | false | false | true | @jest/globals, @lcdp/offline-plugin, babel-jest, fork-ts-checker-webpack-plugin, jest, sass, tailwindcss, webpack-dev-server |
| yaml | 1.10.3 | false | false | false | false | true | babel-plugin-preval, cssnano, fork-ts-checker-webpack-plugin, postcss-loader, stylelint |
| yaml | 2.8.3 | false | false | false | false | true | commit-and-tag-version, lint-staged, yaml |
| yargs-parser | 20.2.9 | false | false | false | true | true | commit-and-tag-version, stylelint, yargs |
| yargs-parser | 21.1.1 | false | false | false | true | true | @commitlint/cli, commit-and-tag-version, jest, ts-jest |
| yargs | 16.2.0 | false | false | false | false | true | commit-and-tag-version, yargs |
| yargs | 17.7.2 | false | false | false | false | true | @commitlint/cli, commit-and-tag-version, jest |
| zod-validation-error | 4.0.2 | false | false | false | false | true | eslint-plugin-react-hooks |
| zod | 4.3.6 | false | false | false | false | true | eslint-plugin-react-hooks |
| zwitch | 1.0.5 | false | false | false | false | true | stylelint |

The repository itself also runs `scripts/download-twemoji-assets.js` during `postinstall`, performing an unverified GitHub download piped into `tar`. That is a supply-chain and reproducibility blocker queued for remediation; the Phase 0A CI gate uses `--mode=skip-build` so inventory validation cannot execute dependency or repository install scripts.

## GitHub Actions supply-chain review

All action use sites are enumerated in the machine-readable inventory. Non-SHA refs are findings, not implicit approvals. New, removed, or changed use sites fail the checker until the authority is regenerated and reviewed. The dedicated Phase 0A workflow pins its checkout action by commit.
