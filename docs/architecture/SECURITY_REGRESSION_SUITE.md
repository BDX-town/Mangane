# Security Regression Suite

Status: **Phase 0G enforced**

`yarn test:security-regression` is the canonical security suite. It combines:

- HTML sanitization, Trusted Types-compatible handling, URL and navigation policy;
- diagnostics redaction and the prohibition on service-worker console logging;
- credential storage corruption, account-scoped purge, cross-tab logout, durable lifecycle fencing, cache cleanup, emergency reset, and object URL revocation;
- exact same-origin share-target routing, bounded text, content-type/size/malformed-input rejection, and inert compose redirection;
- push-token bearer boundaries, restart-durable revocation, notification action rejection, logout acknowledgement, and service-worker cache authority.

Mutation tests remove or weaken security bindings and require the gate to fail. Tests use synthetic data only. Generated production assets are separately scanned for private-key, AWS access-key, GitHub token, and OpenAI key formats.

This suite is a regression boundary, not a claim that the application is vulnerability-free. Live authorization/IDOR testing requires isolated test accounts and server fixtures; no test may enumerate or mutate data belonging to real users.
