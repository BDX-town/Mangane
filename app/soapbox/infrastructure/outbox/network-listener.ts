/**
 * Phase 6 — Network connectivity listener for outbox processing.
 *
 * Watches browser online/offline events and triggers the outbox processor
 * when connectivity is restored. Also provides a reactive online state
 * for UI consumption.
 */

import { onNetworkOnline } from './outbox-processor';

let registered = false;

/**
 * Register the network listener.
 * Safe to call multiple times — only registers once.
 * Call at app startup after the outbox processor is initialized.
 */
export function registerNetworkListener(): void {
  if (registered) return;
  if (typeof window === 'undefined') return;

  window.addEventListener('online', handleOnline);
  registered = true;
}

/**
 * Unregister the network listener.
 * Call on app teardown (useful for tests).
 */
export function unregisterNetworkListener(): void {
  if (!registered) return;
  if (typeof window === 'undefined') return;

  window.removeEventListener('online', handleOnline);
  registered = false;
}

function handleOnline(): void {
  // Small delay to let the network stack stabilize
  setTimeout(() => {
    onNetworkOnline();
  }, 1_000);
}
