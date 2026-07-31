/**
 * Phase 9 — Conversation graph domain types.
 *
 * Defines the immutable conversation graph model that projects the canonical
 * reply graph into an adaptive, accessible reading model.
 *
 * Three identity layers (from Phase 8C pattern):
 * - Node identity: canonical URI of the status
 * - Edge identity: parent→child reply relationship with provenance
 * - Presentation identity: branch/path/summary rendering state
 *
 * The graph is a derived projection. It does NOT store status content.
 * Content is read through the Phase 7 application boundary hooks.
 *
 * Security:
 * - Account-scoped (all view state, reading state)
 * - Moderation applied BEFORE summaries/counts
 * - No raw protocol payloads exposed to presentation
 * - Cycle detection with bounded depth
 * - Cross-account IDOR prevention
 */

// ─── Graph completeness ──────────────────────────────────────────────────────

export type ConversationCompleteness =
  | 'origin-verified'              // Origin server provided authoritative context
  | 'origin-and-viewer-merged'     // Both origin public + connected viewer state
  | 'connected-fallback'           // Only connected server context available
  | 'cached-stale'                 // Using local cache (origin/connected unavailable)
  | 'partial'                      // Incomplete (some ancestors/descendants missing)
  | 'unauthorized'                 // Viewer lacks access
  | 'unavailable'                  // Network failure
  | 'malformed'                    // Invalid graph structure detected
  | 'cyclic'                       // Cycle detected (graph is unreliable)
  | 'depth-truncated';             // Max depth reached

// ─── Node kinds ──────────────────────────────────────────────────────────────

export type ConversationNodeKind =
  | 'root'                    // The conversation root post
  | 'author-continuation'     // Same author as root, continuing the thread
  | 'direct-reply'           // Direct reply to root or author continuation
  | 'nested-reply'           // Reply within a branch
  | 'missing'                // Known to exist but not fetched/available
  | 'tombstone'              // Deleted
  | 'filtered-placeholder'   // Hidden by viewer policy
  | 'depth-truncated';       // Beyond max depth

// ─── Moderation state per node ───────────────────────────────────────────────

export type ConversationModerationState =
  | 'visible'
  | 'content-warning'
  | 'filtered'
  | 'muted-account'
  | 'blocked-account'
  | 'domain-blocked'
  | 'unauthorized'
  | 'deleted';

// ─── Reply edge provenance ───────────────────────────────────────────────────

export type EdgeSource =
  | 'origin-context'          // From origin server's context response
  | 'connected-context'       // From connected server's context response
  | 'in-reply-to-field'       // From status.in_reply_to_id field
  | 'local-observation'       // Observed in local timeline/notification
  | 'recovery-coordinator'    // From Context Recovery Coordinator
  | 'pending-local';          // Optimistic local reply (not yet confirmed)

export interface ReplyEdgeObservation {
  readonly childCanonicalUri: string;
  readonly parentCanonicalUri: string;
  readonly source: EdgeSource;
  readonly observedAt: number;
  readonly confidence: number; // 0.0-1.0, origin is 1.0
}

// ─── Graph node ──────────────────────────────────────────────────────────────

export interface StatusAliasRef {
  readonly canonicalUri: string;
  readonly localStatusId?: string;
  readonly instanceOrigin?: string;
}

export interface ConversationGraphNode {
  readonly canonicalUri: string;
  readonly statusAliasIds: ReadonlyArray<StatusAliasRef>;
  readonly parentCanonicalUri: string | null;
  readonly childCanonicalUris: ReadonlyArray<string>;
  readonly depth: number;
  readonly branchRootCanonicalUri: string;
  readonly pathCanonicalUris: ReadonlyArray<string>;
  readonly kind: ConversationNodeKind;
  readonly provenance: ReadonlyArray<ReplyEdgeObservation>;
  readonly moderationState: ConversationModerationState;
  readonly authorId?: string;
  readonly createdAt?: string;
  readonly editedAt?: string;
}

// ─── Full graph ──────────────────────────────────────────────────────────────

export interface ConversationGraphDiagnostics {
  readonly nodeCount: number;
  readonly edgeCount: number;
  readonly maxDepth: number;
  readonly missingNodeCount: number;
  readonly filteredNodeCount: number;
  readonly cyclesDetected: number;
  readonly buildTimeMs: number;
}

export interface ConversationGraph {
  readonly schemaVersion: 1;
  readonly accountScopeKey: string;
  readonly rootCanonicalUri: string;
  readonly focusedCanonicalUri: string;
  readonly revision: string;
  readonly completeness: ConversationCompleteness;
  readonly nodes: ReadonlyMap<string, ConversationGraphNode>;
  readonly rootChildUris: ReadonlyArray<string>;
  readonly focusedPathUris: ReadonlyArray<string>;
  readonly diagnostics: ConversationGraphDiagnostics;
}

// ─── View state (account-scoped, persisted) ──────────────────────────────────

export type ConversationViewMode = 'structural' | 'chronological';

export interface ConversationViewState {
  readonly accountScopeKey: string;
  readonly rootCanonicalUri: string;
  readonly projectionRevision: number;
  readonly mode: ConversationViewMode;
  readonly focusedCanonicalUri?: string;
  readonly expandedBranchUris: ReadonlyArray<string>;
  readonly collapsedBranchUris: ReadonlyArray<string>;
  readonly lastSeenCanonicalUri?: string;
  readonly lastSeenAt?: string;
  readonly newestSeenReplyObservedAt?: string;
  readonly updatedAt: string;
}

// ─── Branch summary (safe, post-moderation) ──────────────────────────────────

export interface BranchSummary {
  readonly branchRootUri: string;
  readonly directReplyCount: number;
  readonly totalVisibleDescendants: number;
  readonly participantIds: ReadonlyArray<string>; // Bounded, moderation-safe
  readonly lastActivityAt: string | null;
  readonly unreadCount: number;
  readonly hasRootAuthorParticipation: boolean;
  readonly hiddenCount: number; // Moderated-out count without identity leakage
  readonly isExpanded: boolean;
}

// ─── Feature flags ───────────────────────────────────────────────────────────

export const CONVERSATION_FLAGS = Object.freeze({
  originAuthoritativeGraph: 'conversation.originAuthoritativeGraph',
  branchProjection: 'conversation.branchProjection',
  focusedPath: 'conversation.focusedPath',
  branchReadingState: 'conversation.branchReadingState',
});

// ─── Limits ──────────────────────────────────────────────────────────────────

export interface ConversationGraphLimits {
  readonly maxNodes: number;
  readonly maxEdges: number;
  readonly maxDepth: number;
  readonly maxChildrenPerNode: number;
  readonly maxBuildTimeMs: number;
  readonly maxAncestorDepth: number;
}

export const DEFAULT_GRAPH_LIMITS: Readonly<ConversationGraphLimits> = Object.freeze({
  maxNodes: 2000,
  maxEdges: 5000,
  maxDepth: 50,
  maxChildrenPerNode: 500,
  maxBuildTimeMs: 5000,
  maxAncestorDepth: 100,
});
