# Documentation Authority Registry

Status: **Canonical Phase 0H authority**

Last updated: 2026-07-25

## Purpose

[`config/documentation-authority-registry.json`](../../config/documentation-authority-registry.json) is the exhaustive repository Markdown registry. It is generated from every `.md` file outside dependency, build, coverage, temporary, and vendored directories and records each document's title, authority identifier, classification, replacement, inherited-branding references, declared status, and content digest.

The executable authority is:

- [`scripts/generate-documentation-authority-registry.js`](../../scripts/generate-documentation-authority-registry.js), which regenerates the complete registry;
- [`scripts/check-documentation-authority.js`](../../scripts/check-documentation-authority.js), which fails closed on document, classification, digest, link, banner, title, or Phase 0 status drift;
- [`scripts/__tests__/check-documentation-authority.test.js`](../../scripts/__tests__/check-documentation-authority.test.js), which mutation-tests missing registration, unsafe or broken links, stale status claims, hidden supersession, and incomplete historical requirement records.

## Classification contract

| Classification | Meaning | May control implementation? |
|---|---|---|
| `canonical` | Governing repository, architecture, roadmap, evidence, or closure authority | Yes, within its declared scope |
| `current-supporting-evidence` | Verified or operational evidence subordinate to canonical documents | Only as evidence, not as a conflicting policy |
| `accepted-target` | Approved future architecture that is not necessarily implemented | Only as a target; never as a current-state claim |
| `historical` | Preserved chronology or rationale | No |
| `superseded` | Unsafe or stale instructions replaced by a named current document | No |

No document is silently deleted to remove a conflict. Historical and superseded files remain searchable, carry a visible warning, and have an explicit disposition. The registry is the complete index; hand-maintained lists in prose are navigation aids only.

## Canonical hierarchy

1. [`README.md`](../../README.md) owns current repository identity and verified entry commands.
2. [`README.md`](./README.md) in this directory owns the architecture-document hierarchy.
3. [`CURRENT_STATE.md`](./CURRENT_STATE.md) and generated inventories own verified inherited behavior.
4. Accepted-target documents own future architecture only.
5. [`IMPLEMENTATION_ROADMAP_V2.md`](./IMPLEMENTATION_ROADMAP_V2.md) owns sequencing.
6. [`ARCHITECTURAL_DECISIONS.md`](./ARCHITECTURAL_DECISIONS.md) owns material decisions and supersession history.
7. [`PHASE_0_CLOSURE_REPORT.md`](./PHASE_0_CLOSURE_REPORT.md) owns the Phase 0-to-Phase 1 handoff.

If two active documents appear to conflict, the narrower source-backed authority controls current behavior, the roadmap controls sequencing, and an ADR is required to change a material target.

## Inherited branding

`Soapbox` references are not automatically defects: source paths, configuration keys, compatibility routes, package history, and provenance may legitimately retain the name. They are recorded as inherited-branding references so they cannot be mistaken for current product identity. Operational instructions that point to Soapbox repositories, artifacts, or filesystem layouts are classified as superseded and visibly blocked from current use.
