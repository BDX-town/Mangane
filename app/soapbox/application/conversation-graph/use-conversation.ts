/**
 * Phase 9.5 / 9.7 — Conversation hooks for presentation.
 *
 * Provides React hooks that presentation components use to access
 * conversation graph state, navigation, and live updates.
 *
 * These hooks bridge:
 * - The graph builder (9.1)
 * - The coordinator (9.2)
 * - Structural/chronological projections (9.3-9.4)
 * - Focused-path navigation (9.5)
 * - Reading state persistence (9.6)
 * - Live update reconciliation (9.7)
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAppSelector } from 'soapbox/hooks';

import {
  buildChronologicalProjection,
  buildStructuralProjection,
} from './conversation-projections';
import {
  loadConversationState,
  saveConversationState,
} from './conversation-reading-state';
import { buildConversationGraph } from './graph-builder';

import type {
  ChronologicalItem,
  StructuralProjection,
} from './conversation-projections';
import type {
  ConversationGraph,
  ConversationViewMode,
  ConversationViewState,
  ReplyEdgeObservation,
} from './conversation-types';
import type { NodeMetadataInput } from './graph-builder';

// ─── Main hook ───────────────────────────────────────────────────────────────

export interface UseConversationOptions {
  /** Canonical URI of the root status. */
  rootCanonicalUri: string;
  /** Canonical URI of the currently focused status. */
  focusedCanonicalUri: string;
  /** Account scope for IDOR isolation. */
  accountScope: string;
  /** Root author ID for continuation detection. */
  rootAuthorId?: string;
}

export interface UseConversationResult {
  /** The current conversation graph (null while loading). */
  graph: ConversationGraph | null;
  /** Structural projection (branches, continuations). */
  structural: StructuralProjection | null;
  /** Chronological projection. */
  chronological: ReadonlyArray<ChronologicalItem>;
  /** Current view mode. */
  mode: ConversationViewMode;
  /** The focused path (root → focused node). */
  focusedPath: ReadonlyArray<string>;
  /** Loading state. */
  isLoading: boolean;
  /** Error state. */
  error: string | null;

  // ─── Actions ─────────────────────────────────────────────────
  /** Switch between structural and chronological mode. */
  setMode: (mode: ConversationViewMode) => void;
  /** Expand a branch. */
  expandBranch: (branchRootUri: string) => void;
  /** Collapse a branch. */
  collapseBranch: (branchRootUri: string) => void;
  /** Navigate to a specific node (set focused path). */
  focusNode: (canonicalUri: string) => void;
  /** Mark a node as seen (for unread tracking). */
  markSeen: (canonicalUri: string) => void;
  /** Add a new reply edge (optimistic local reply). */
  addLocalReply: (childUri: string, parentUri: string, authorId: string) => void;
}

/**
 * Primary hook for consuming conversation graph state.
 *
 * Builds the graph from Redux context edges, computes projections,
 * manages view state, and handles branch navigation.
 */
export function useConversation(options: UseConversationOptions): UseConversationResult {
  const { rootCanonicalUri, focusedCanonicalUri, accountScope, rootAuthorId } = options;

  // State
  const [graph, setGraph] = useState<ConversationGraph | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localEdges, setLocalEdges] = useState<ReplyEdgeObservation[]>([]);

  // View state (persisted)
  const [viewState] = useState<ConversationViewState | null>(() =>
    loadConversationState(accountScope, rootCanonicalUri),
  );
  const [mode, setModeState] = useState<ConversationViewMode>(viewState?.mode || 'structural');
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(
    new Set(viewState?.expandedBranchUris || []),
  );
  const [collapsedBranches, setCollapsedBranches] = useState<Set<string>>(
    new Set(viewState?.collapsedBranchUris || []),
  );
  const [focusedUri, setFocusedUri] = useState(focusedCanonicalUri);

  // Read context/ancestors/descendants from Redux
  const contextEdges = useAppSelector(useCallback((state) => {
    return extractEdgesFromRedux(state, rootCanonicalUri, accountScope);
  }, [rootCanonicalUri, accountScope]));

  // Build graph when edges change
  useEffect(() => {
    if (!rootCanonicalUri) return;
    setIsLoading(true);

    try {
      const allEdges = [...contextEdges, ...localEdges];
      const metadata = extractMetadataFromEdges(allEdges, rootCanonicalUri);

      const builtGraph = buildConversationGraph({
        accountScopeKey: accountScope,
        rootCanonicalUri,
        focusedCanonicalUri: focusedUri,
        edges: allEdges,
        nodeMetadata: metadata,
        rootAuthorId,
        completeness: 'connected-fallback',
      });

      setGraph(builtGraph);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Graph build failed.');
    } finally {
      setIsLoading(false);
    }
  }, [contextEdges, localEdges, rootCanonicalUri, focusedUri, accountScope, rootAuthorId]);

  // Compute projections
  const structural = useMemo(() => {
    if (!graph) return null;
    const vs: ConversationViewState = {
      accountScopeKey: accountScope,
      rootCanonicalUri,
      projectionRevision: 0,
      mode,
      expandedBranchUris: [...expandedBranches],
      collapsedBranchUris: [...collapsedBranches],
      updatedAt: new Date().toISOString(),
    };
    return buildStructuralProjection(graph, vs, rootAuthorId);
  }, [graph, mode, expandedBranches, collapsedBranches, accountScope, rootCanonicalUri, rootAuthorId]);

  const chronological = useMemo(() => {
    if (!graph) return [];
    return buildChronologicalProjection(graph);
  }, [graph]);

  const focusedPath = useMemo(() => graph?.focusedPathUris || [], [graph]);

  // Persist view state on changes
  useEffect(() => {
    if (!rootCanonicalUri || !accountScope) return;
    saveConversationState(accountScope, rootCanonicalUri, {
      mode,
      focusedCanonicalUri: focusedUri,
      expandedBranchUris: [...expandedBranches],
      collapsedBranchUris: [...collapsedBranches],
      lastSeenCanonicalUri: focusedUri,
      lastSeenAt: new Date().toISOString(),
    });
  }, [mode, focusedUri, expandedBranches, collapsedBranches, rootCanonicalUri, accountScope]);

  // ─── Actions ─────────────────────────────────────────────────────

  const setMode = useCallback((newMode: ConversationViewMode) => {
    setModeState(newMode);
  }, []);

  const expandBranch = useCallback((uri: string) => {
    setExpandedBranches(prev => new Set([...prev, uri]));
    setCollapsedBranches(prev => {
      const next = new Set(prev);
      next.delete(uri);
      return next;
    });
  }, []);

  const collapseBranch = useCallback((uri: string) => {
    setCollapsedBranches(prev => new Set([...prev, uri]));
    setExpandedBranches(prev => {
      const next = new Set(prev);
      next.delete(uri);
      return next;
    });
  }, []);

  const focusNode = useCallback((uri: string) => {
    setFocusedUri(uri);
  }, []);

  const markSeen = useCallback((uri: string) => {
    // Update last-seen in persisted state
    saveConversationState(accountScope, rootCanonicalUri, {
      lastSeenCanonicalUri: uri,
      lastSeenAt: new Date().toISOString(),
    });
  }, [accountScope, rootCanonicalUri]);

  const addLocalReply = useCallback((childUri: string, parentUri: string, authorId: string) => {
    const edge: ReplyEdgeObservation = {
      childCanonicalUri: childUri,
      parentCanonicalUri: parentUri,
      source: 'pending-local',
      observedAt: Date.now(),
      confidence: 0.9,
    };
    setLocalEdges(prev => [...prev, edge]);
  }, []);

  return {
    graph,
    structural,
    chronological,
    mode,
    focusedPath,
    isLoading,
    error,
    setMode,
    expandBranch,
    collapseBranch,
    focusNode,
    markSeen,
    addLocalReply,
  };
}

// ─── Redux edge extraction ───────────────────────────────────────────────────

/**
 * Extract reply edges from the Redux contexts reducer.
 * Converts the existing ancestor/descendant data into ReplyEdgeObservation format.
 */
function extractEdgesFromRedux(
  state: any,
  rootUri: string,
  accountScope: string,
): ReplyEdgeObservation[] {
  const edges: ReplyEdgeObservation[] = [];
  const contexts = state.contexts;
  if (!contexts) return edges;

  const now = Date.now();

  // Extract from inReplyTos (child → parent mapping)
  const inReplyTos = contexts.get('inReplyTos');
  if (inReplyTos) {
    inReplyTos.forEach((parentId: string, childId: string) => {
      if (parentId && childId) {
        edges.push({
          childCanonicalUri: statusIdToUri(childId, accountScope),
          parentCanonicalUri: statusIdToUri(parentId, accountScope),
          source: 'in-reply-to-field',
          observedAt: now,
          confidence: 0.8,
        });
      }
    });
  }

  // Extract from replies (parent → children mapping)
  const replies = contexts.get('replies');
  if (replies) {
    replies.forEach((childIds: any, parentId: string) => {
      if (childIds && parentId) {
        const children = childIds.toArray ? childIds.toArray() : [];
        for (const childId of children) {
          if (childId) {
            edges.push({
              childCanonicalUri: statusIdToUri(childId, accountScope),
              parentCanonicalUri: statusIdToUri(parentId, accountScope),
              source: 'connected-context',
              observedAt: now,
              confidence: 0.9,
            });
          }
        }
      }
    });
  }

  return edges;
}

/**
 * Convert a local status ID to a URI-like key for the graph builder.
 * Uses the scoped format when no canonical URI is available.
 */
function statusIdToUri(statusId: string, accountScope: string): string {
  // In a real implementation this would look up the canonical URI
  // from the status record. For now, use the scoped fallback.
  return `content-scoped:${accountScope}:${statusId}`;
}

/**
 * Extract node metadata from edges (minimal — just what the graph needs).
 */
function extractMetadataFromEdges(
  edges: ReplyEdgeObservation[],
  rootUri: string,
): Map<string, NodeMetadataInput> {
  const metadata = new Map<string, NodeMetadataInput>();

  // Ensure root has metadata
  metadata.set(rootUri, { localStatusId: rootUri.split(':').pop() });

  // Add metadata for all referenced URIs
  for (const edge of edges) {
    if (!metadata.has(edge.childCanonicalUri)) {
      metadata.set(edge.childCanonicalUri, {
        localStatusId: edge.childCanonicalUri.split(':').pop(),
      });
    }
    if (!metadata.has(edge.parentCanonicalUri)) {
      metadata.set(edge.parentCanonicalUri, {
        localStatusId: edge.parentCanonicalUri.split(':').pop(),
      });
    }
  }

  return metadata;
}
