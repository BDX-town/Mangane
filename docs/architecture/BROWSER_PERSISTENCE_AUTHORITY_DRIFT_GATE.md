# Browser Persistence Authority Drift Gate

Status: **Phase 0C verified**

`config/browser-persistence-authority-inventory.json` binds the completed lifecycle contract to executable source evidence. The checker requires exactly twelve reviewed surfaces:

- fail-closed serialized authentication authority and account-specific credential cleanup;
- IndexedDB account snapshot deletion;
- durable account lifecycle generations;
- stateful HTTP response generation fencing;
- WebSocket/polling generation fencing and disconnect ownership;
- token-free BroadcastChannel/storage-event purge propagation;
- normal-transition OfflinePlugin cache cleanup;
- restart-durable service-worker token revocation;
- central object-URL ownership;
- ordered resumable account purge;
- bounded origin emergency reset.

The generated `config/persistence-manifest.json` remains the exhaustive production callsite authority. A source-level API addition changes that manifest and fails CI. The behavioral inventory prevents a discovered callsite from being described as safe while its cleanup or fencing code has disappeared.

Security meaning: a passing gate proves the enumerated Phase 0C behaviors remain source-bound and the focused adversarial tests pass. It does not make JavaScript-readable inherited credentials encrypted, replace server-controlled HttpOnly cookie cleanup, or guarantee that a browser process cannot be terminated during cleanup. Those constraints are explicit in the inventory and are not silent gaps.

Run:

```sh
node scripts/check-browser-persistence-authority-inventory.js
node scripts/check-persistence-manifest.js
node --test scripts/__tests__/check-browser-persistence-authority-inventory.test.js scripts/__tests__/check-persistence-manifest.test.js
```

The dedicated workflow runs with read-only repository permissions. Its adversarial fixtures remove credential writes, required surfaces, lifecycle invariants, durable worker evidence, and safe paths to prove the gate fails closed.
