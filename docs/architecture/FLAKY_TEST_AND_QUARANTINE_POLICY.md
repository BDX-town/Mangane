# Flaky Test and Quarantine Policy

Status: **Phase 0G enforced baseline**

## Default

The accepted flake count is zero. Required tests do not retry, use `continue-on-error`, depend on execution order, share durable state, or treat a later pass as evidence that an earlier failure was harmless.

## Required quarantine record

A temporary quarantine requires all of:

- exact suite and test name;
- owning team and named tracking issue;
- failure signature and reproduction evidence;
- safety impact and coverage replacement;
- fixed expiry no more than 14 days away;
- deterministic isolation from required checks;
- removal criteria.

Expired, ownerless, issue-less, or coverage-free quarantines fail review. Security, privacy, auth, logout, migration, worker, accessibility, data-integrity, and IDOR regression tests may not be quarantined.

## Current register

No tests are quarantined and no retry allowance exists.

## Investigation standard

First preserve the failing output and seed, then reproduce with isolated state and repeated execution. Fix clocks, random seeds, ports, locale, timezone, network mocks, cleanup, and asynchronous settlement at the source. Increasing timeouts is acceptable only when a measured upper bound changed and the test remains deterministic.
