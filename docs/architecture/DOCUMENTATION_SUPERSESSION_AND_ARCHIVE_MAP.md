# Documentation Supersession and Archive Map

Status: **Current Phase 0H supporting evidence**

Last updated: 2026-07-25

## Superseded operational documents

| Document | Reason it cannot control current work | Replacement |
|---|---|---|
| `docs/administration/deploy-at-scale.md` | Assumes Soapbox artifacts and deployment ownership | [`README.md`](../../README.md) |
| `docs/administration/install-subdomain.md` | Uses inherited Soapbox naming and installation flow | [`README.md`](../../README.md) |
| `docs/administration/mastodon.md` | Downloads Soapbox GitLab artifacts into Soapbox-specific paths | [`README.md`](../../README.md) |
| `docs/administration/removing.md` | Removes Soapbox paths rather than a verified Mangane deployment | [`README.md`](../../README.md) |
| `docs/development/build-config.md` | Mixes current environment keys with inherited Soapbox product and OAuth examples | [`CURRENT_STATE.md`](./CURRENT_STATE.md) |
| `docs/development/developing-backend.md` | Describes broad Soapbox backend expectations without the complete Mangane capability authority | [`BACKEND_CAPABILITY_MATRIX.md`](./BACKEND_CAPABILITY_MATRIX.md) |
| `docs/development/how-it-works.md` | Is an inherited Soapbox overview without current source evidence | [`CURRENT_STATE.md`](./CURRENT_STATE.md) |
| `docs/development/running-locally.md` | Clones the former Soapbox GitLab repository and references its toolchain | [`README.md`](../../README.md) |

These files are preserved for provenance and recovery of potentially useful details. Their banners prohibit treating commands or architecture claims as current.

## Historical records

| Document | Preserved purpose |
|---|---|
| [`CHANGELOG.md`](../../CHANGELOG.md) | Release chronology and links as emitted at the time |
| [`docs/history.md`](../history.md) | Upstream project history and inherited product context |

Historical links and names are evidence of provenance, not current repository ownership.

## Active authority

The complete classification is generated in [`config/documentation-authority-registry.json`](../../config/documentation-authority-registry.json). This map is intentionally limited to documents whose warnings and replacements require human-readable explanation.
