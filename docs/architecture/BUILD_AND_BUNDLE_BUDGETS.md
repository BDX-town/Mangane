# Build and Bundle Budgets

Status: **Phase 0G enforced**

The machine-readable authority is [`config/build-budget.json`](../../config/build-budget.json), enforced by [`scripts/check-build-baseline.js`](../../scripts/check-build-baseline.js).

| Production artifact | Hard limit |
|---|---:|
| application JavaScript | 4,250,000 bytes |
| shared runtime JavaScript | 350,000 bytes |
| application CSS | 450,000 bytes |
| service worker | 500,000 bytes |

Production source maps are prohibited. The application entrypoint must retain exactly two JavaScript assets and one CSS asset until the budget contract is reconciled. The OfflinePlugin service-worker manifest binding and generated `sw.js` must exist.

Budgets are ceilings, not targets. A smaller build passes without updating the baseline; an increase requires source-level attribution, performance review, and explicit budget reconciliation. Development builds are compile-gated but not byte-budgeted because source maps and debugging structure intentionally change their size.
