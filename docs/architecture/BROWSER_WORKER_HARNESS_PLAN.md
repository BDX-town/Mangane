# Browser and Worker Harness Plan

Status: **Phase 0G baseline established; cross-engine expansion staged**

## Current executable layers

| Layer | Harness | Proven behavior |
|---|---|---|
| DOM/browser smoke | Jest + jsdom + Testing Library | labeled required login fields, keyboard-reachable password visibility, protected-route redirect, public status deep link, compose navigation |
| Accessibility authority | Node mutation tests | reduced-motion global import and declarations; keyboard, focus, label, live-region and gesture inventory drift |
| Share worker | Node `vm` sandbox | exact same-origin `POST /share`, path confusion rejection, content-type rejection, declared-size rejection, malformed-form handling, NUL stripping and field bounds |
| Push/cache worker | adversarial authority tests | bearer boundary, restart-durable token revocation, logout acknowledgement, notification cleanup, service-worker entry and cache configuration |
| Integrated worker build | production webpack | actual OfflinePlugin entry compiles and produces the bounded `sw.js` artifact |

## Next harness expansion

Add a locally served, backend-fixtured Playwright matrix for Chromium, Firefox, and WebKit. It must cover direct navigation and reload of public/protected deep links, login/OTP failure, logout and account switch across two origins, offline boot, service-worker update/rollback, Cache Storage corruption, push revocation after worker restart, reduced motion, keyboard-only navigation, focus restoration, and automated accessibility scans.

The harness must use ephemeral browser profiles, synthetic credentials, isolated origins, deterministic clocks, bounded ports, and cleanup that fails closed. It must never contact a real Fediverse instance or store real tokens in traces, video, screenshots, logs, or reports.

Cross-engine work is an expansion, not a reason to label the current jsdom evidence as a real-browser matrix.
