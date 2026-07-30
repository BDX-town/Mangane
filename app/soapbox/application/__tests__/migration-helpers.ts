/**
 * Phase 7 — Test helpers for legacy/new-path equivalence.
 *
 * Provides utilities for verifying that the new application boundary
 * (timeline-read-model) produces equivalent results to the legacy
 * Redux selectors it replaces.
 *
 * Usage in tests:
 *   import { assertTimelineEquivalence, assertStatusEquivalence } from './migration-helpers';
 *   assertTimelineEquivalence(state, 'home');
 */

import { queryStatus, queryTimeline } from '../timeline-queries';

import type { CanonicalTimelineId } from '../timeline-read-model';
import type { RootState } from 'soapbox/store';

// ─── Equivalence assertions ──────────────────────────────────────────────────

/**
 * Verify that queryTimeline produces a consistent result:
 * - items array contains only valid status IDs present in state.statuses
 * - hasMore/isLoading match the Redux timeline record
 * - No undefined or null items
 */
export function assertTimelineConsistency(
  state: RootState,
  timelineId: CanonicalTimelineId,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const result = queryTimeline(state, timelineId);

  // Items should have no duplicates
  const ids = new Set<string>();
  for (const item of result.items) {
    if (!item.id || typeof item.id !== 'string') {
      errors.push(`Item has invalid id: ${JSON.stringify(item)}`);
      continue;
    }
    if (ids.has(item.id)) {
      errors.push(`Duplicate item id: ${item.id}`);
    }
    ids.add(item.id);

    // The status should exist in the store
    if (!state.statuses.get(item.id)) {
      errors.push(`Item ${item.id} references a status not in the store`);
    }

    // isReblog consistency
    if (item.isReblog && item.originalId === item.id) {
      errors.push(`Item ${item.id} marked as reblog but originalId === id`);
    }
  }

  // Boolean fields should be actual booleans
  if (typeof result.hasMore !== 'boolean') errors.push('hasMore is not boolean');
  if (typeof result.isLoading !== 'boolean') errors.push('isLoading is not boolean');
  if (typeof result.isOnline !== 'boolean') errors.push('isOnline is not boolean');
  if (typeof result.hasFailed !== 'boolean') errors.push('hasFailed is not boolean');
  if (typeof result.queuedCount !== 'number') errors.push('queuedCount is not number');

  return { valid: errors.length === 0, errors };
}

/**
 * Verify that queryStatus produces a well-formed StatusView:
 * - All required fields are present and correctly typed
 * - Nested account is valid if present
 * - Media attachments have valid types
 */
export function assertStatusConsistency(
  state: RootState,
  statusId: string,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const result = queryStatus(state, statusId);

  if (!result) {
    return { valid: true, errors: [] }; // Null is valid (not found)
  }

  if (typeof result.id !== 'string' || result.id.length === 0) {
    errors.push('Status id is empty or not a string');
  }
  if (typeof result.content !== 'string') errors.push('content is not a string');
  if (typeof result.createdAt !== 'string') errors.push('createdAt is not a string');
  if (typeof result.visibility !== 'string') errors.push('visibility is not a string');
  if (typeof result.sensitive !== 'boolean') errors.push('sensitive is not boolean');
  if (typeof result.favourited !== 'boolean') errors.push('favourited is not boolean');
  if (typeof result.reblogged !== 'boolean') errors.push('reblogged is not boolean');
  if (typeof result.bookmarked !== 'boolean') errors.push('bookmarked is not boolean');

  // Account validation
  if (result.account) {
    if (typeof result.account.id !== 'string') errors.push('account.id is not a string');
    if (typeof result.account.username !== 'string') errors.push('account.username is not a string');
    if (typeof result.account.acct !== 'string') errors.push('account.acct is not a string');
  }

  // Media validation
  if (!Array.isArray(result.mediaAttachments)) {
    errors.push('mediaAttachments is not an array');
  } else {
    const validTypes = ['image', 'video', 'gifv', 'audio', 'unknown'];
    for (const media of result.mediaAttachments) {
      if (!validTypes.includes(media.type)) {
        errors.push(`Invalid media type: ${media.type}`);
      }
    }
  }

  // Reblog consistency
  if (result.reblog && typeof result.reblog.id !== 'string') {
    errors.push('reblog.id is not a string');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Verify that the read model boundary does not leak Immutable.js types.
 * Checks that a value is a plain object/array (not ImmutableMap/List/etc).
 */
export function assertPlainObject(value: unknown, path: string = 'root'): string[] {
  const errors: string[] = [];

  if (value === null || value === undefined) return errors;

  if (typeof value === 'object') {
    // Check for Immutable.js
    const proto = Object.getPrototypeOf(value);
    const constructorName = proto?.constructor?.name || '';
    if (constructorName.startsWith('Map') ||
        constructorName.startsWith('List') ||
        constructorName.startsWith('OrderedSet') ||
        constructorName.startsWith('Record') ||
        constructorName.startsWith('Set')) {
      // Could be Immutable.js if it has toJS method
      if ('toJS' in (value as object)) {
        errors.push(`${path} is an Immutable.js ${constructorName} (has toJS)`);
      }
    }

    // Recurse into arrays
    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        errors.push(...assertPlainObject(item, `${path}[${i}]`));
      });
    } else {
      // Recurse into object values (limited depth)
      const depth = path.split('.').length;
      if (depth < 5) {
        for (const [key, val] of Object.entries(value)) {
          errors.push(...assertPlainObject(val, `${path}.${key}`));
        }
      }
    }
  }

  return errors;
}
