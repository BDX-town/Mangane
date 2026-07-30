/**
 * Phase 5E — React hook bridging react-virtuoso with IndexedDB position anchors.
 *
 * This hook:
 * 1. Captures the first visible item from Virtuoso's itemsRendered callback
 *    and persists it to the position anchor store (throttled, non-blocking)
 * 2. On mount, restores the saved anchor position for the timeline
 * 3. Provides the initial scroll index for Virtuoso
 *
 * Usage in a timeline component:
 *   const { initialIndex, handleItemsRendered } = useScrollAnchor({
 *     timelineId: 'home',
 *     items: statusIds,
 *   });
 *
 * The hook is a no-op when:
 * - The localStore feature flag is off
 * - The user has no account URL
 * - The timelineId is not provided
 */
import { useState, useCallback, useEffect, useRef } from 'react';

import { capturePosition, restorePosition } from 'soapbox/db';
import { useAppSelector, useSettings } from 'soapbox/hooks';
import { getAuthUserUrl } from 'soapbox/utils/auth';

import type { ListItem, IndexLocationWithAlign } from 'react-virtuoso';

export interface UseScrollAnchorOptions {
  /** Timeline identifier (e.g., 'home', 'notifications', 'local:instance.tld') */
  timelineId: string | undefined;
  /** Ordered list of item IDs in the current feed (status IDs) */
  items: readonly string[];
  /** Whether to disable restoration (e.g., when loading) */
  disabled?: boolean;
}

export interface UseScrollAnchorResult {
  /** Initial index for Virtuoso's initialTopMostItemIndex prop */
  initialIndex: number | IndexLocationWithAlign;
  /** Callback for Virtuoso's itemsRendered prop */
  handleItemsRendered: (renderedItems: ListItem<any>[]) => void;
  /** Whether restoration has completed (for opacity transition) */
  ready: boolean;
}

/**
 * Hook providing semantic scroll position persistence for timeline lists.
 */
export function useScrollAnchor({
  timelineId,
  items,
  disabled = false,
}: UseScrollAnchorOptions): UseScrollAnchorResult {
  const settings = useSettings();
  const localStoreEnabled = settings.get('localStore') as boolean;
  const accountUrl = useAppSelector(state => getAuthUserUrl(state));

  const [initialIndex, setInitialIndex] = useState<number | IndexLocationWithAlign>(0);
  const [ready, setReady] = useState(true);
  const restored = useRef(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const enabled = localStoreEnabled && !!accountUrl && !!timelineId && !disabled;

  // Restore position on mount
  useEffect(() => {
    if (!enabled || restored.current) return;
    restored.current = true;

    (async() => {
      try {
        const anchor = await restorePosition(accountUrl!, timelineId!);
        if (!anchor) {
          setReady(true);
          return;
        }

        // Find the anchor status in the current items
        const index = itemsRef.current.indexOf(anchor.anchorStatusId);
        if (index >= 0) {
          setInitialIndex({ index, align: 'start', offset: anchor.offsetPixels });
          setReady(false); // Will become ready after first render
          // Set ready after a short delay to allow virtuoso to render
          setTimeout(() => setReady(true), 300);
        } else {
          // Anchor not found in current items — start from top
          setReady(true);
        }
      } catch {
        setReady(true);
      }
    })();
  }, [enabled, accountUrl, timelineId]);

  // Capture position on scroll
  const handleItemsRendered = useCallback((renderedItems: ListItem<any>[]) => {
    if (!enabled || renderedItems.length === 0) return;

    const firstItem = renderedItems[0];
    const statusId = itemsRef.current[firstItem.index];
    if (!statusId) return;

    // Fire-and-forget: capturePosition is throttled and non-blocking internally
    capturePosition(accountUrl!, timelineId!, statusId, firstItem.offset);

    // Mark ready after first render (for restoration flow)
    if (!ready) setReady(true);
  }, [enabled, accountUrl, timelineId, ready]);

  // Return no-op values when disabled
  if (!enabled) {
    return { initialIndex: 0, handleItemsRendered: () => {}, ready: true };
  }

  return { initialIndex, handleItemsRendered, ready };
}
