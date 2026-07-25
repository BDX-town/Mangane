# Push Worker Authority Drift Gate

Status: **Current / bounded Phase 0 evidence**

This gate pins the currently verified security-relevant behavior of `app/soapbox/service_worker/web_push_notifications.ts`.

It verifies that the current worker:

- accepts an `access_token` in push-derived data;
- attaches that token as a bearer credential to same-origin API requests;
- combines bearer authentication with `credentials: 'include'`;
- copies the token into native notification data;
- later reuses notification-resident credentials for reblog and favourite actions;
- passes stored notification destinations directly to `openWindow` or `WindowClient.navigate`;
- owns the `push`, `notificationclick` and account-purge message handlers;
- hashes a logout-supplied token into a restart-durable Cache Storage revocation journal, acknowledges persistence, closes matching notifications and rejects later push or action use before and after network work.

A passing gate does **not** mean this behavior is safe or accepted target architecture. Credential-bearing notification data is a release-blocking legacy boundary that must be removed in the PWA hardening work. The gate exists so the behavior cannot silently change, disappear from documentation, or be mistaken for a completed security contract.

The following remain explicit blockers:

- complete push-subscription creation, rotation and revocation inventory;
- account and instance binding for subscriptions, payloads and grouped notifications;
- instance-switch cleanup of retained native notifications (cross-tab logout and worker-restart revocation are covered);
- versioned payload validation and strict size limits;
- timeout, cancellation, bounded-response, retry and content-type rules;
- safe same-origin notification destination policy;
- replacement of notification-resident bearer tokens with scoped session or action-capability handling.

The executable checker is `scripts/check-push-worker-authority-inventory.js`. Focused regression tests use Node's built-in test runner and the dedicated workflow is read-only.
