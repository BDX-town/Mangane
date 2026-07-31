/**
 * Phase 9.2 — Origin-first conversation query coordination.
 *
 * Composes origin public observation, connected viewer context, cached
 * canonical state, and recovery coordinator into a unified graph build.
 *
 * Does NOT:
 * - Create new transport clients (uses existing api layer)
 * - Create new scheduler ownership
 * - Send connected-account tokens to origin servers
 * - Use unauthenticated origin fetch for private/direct conversations
 *
 * DOES:
 * - Merge by field authority and provenance
 * - Support cancellation, stale-generation fencing, offline use
 * - Track typed degraded outcomes
 * - Fence stale responses after route/account changes
 */

import { buildConversationGraph } from './graph-builder';

import type {
  ConversationCompleteness,
  ConversationGraph,
  ConversationModerationState,
  ReplyEdgeObservation,
} from './conversation-types';
import type { GraphBuildInput, NodeMetadataInput } from './graph-builder';

// ─── Generation fencing ──────────────────────────────────────────────────────

let currentGeneration = 0;

/**
 * Increment the generation counter.
 * Call on route change, account switch, or explicit refresh.
 * Any in-flight work from a previous generation is stale.
 */
export function advanceGeneration(): number {
  return ++currentGeneration;
}

/**
 * Check if a generation is still current.
 */
export function isGenerationCurrent(generation: number): boolean {
  return generation === currentGeneration;
}

// ─── Coordinator state ───────────────────────────────────────────────────────

export type ConversationQueryState =
  | 'idle'
  | 'loading-connected'
  | 'loading-origin'
  | 'merging'
  | 'complete'
  | 'degraded'
  | 'failed';

export interface ConversationQueryResult {
  readonly graph: ConversationGraph;
  readonly state: ConversationQueryState;
  readonly generation: number;
  readonly completeness: ConversationCompleteness;
  readonly originAttempted: boolean;
  readonly originSucceeded: boolean;
  readonly connectedSucceeded: boolean;
  readonly errors: ReadonlyArray<ConversationQueryError>;
}

export interface ConversationQueryError {
  readonly source: 'origin' | 'connected' | 'local' | 'build';
  readonly kind: string;
  readonly message: string;
  readonly retryable: boolean;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Load and build a conversation graph for a given root/focused status.
 *
 * Strategy:
 * 1. Read cached local edges immediately (instant first paint)
 * 2. Fetch connected viewer context (authenticated, has viewer state)
 * 3. Attempt origin public context (preferred public truth)
 * 4. Merge all observations by authority
 * 5. Build immutable graph
 *
 * @param params - Query parameters
 * @param fetchConnectedContext - Injected function to fetch from connected server
 * @param fetchOriginContext - Injected function to fetch from origin (public, no auth)
 * @param getLocalEdges - Injected function to read cached edges
 * @param signal - AbortSignal for cancellation
 */
export async function loadConversation(
  params: ConversationQueryParams,
  deps: ConversationQueryDeps,
  signal?: AbortSignal,
): Promise<ConversationQueryResult> {
  const generation = advanceGeneration();
  const errors: ConversationQueryError[] = [];
  const allEdges: ReplyEdgeObservation[] = [];
  const allMetadata = new Map<string, NodeMetadataInput>();
  const moderationStates = new Map<string, ConversationModerationState>();

  let originAttempted = false;
  let originSucceeded = false;
  let connectedSucceeded = false;

  // Step 1: Read local cached edges (instant, always available)
  try {
    const localResult = await deps.getLocalEdges(params.rootCanonicalUri, params.accountScope);
    if (!isGenerationCurrent(generation)) return staleResult(generation);
    if (localResult) {
      allEdges.push(...localResult.edges);
      mergeMetadata(allMetadata, localResult.metadata);
    }
  } catch {
    errors.push({ source: 'local', kind: 'read-failure', message: 'Failed to read local cache.', retryable: true });
  }

  // Step 2: Fetch connected viewer context (authenticated)
  try {
    const connectedResult = await deps.fetchConnectedContext(
      params.rootCanonicalUri,
      params.focusedCanonicalUri,
      signal,
    );
    if (!isGenerationCurrent(generation)) return staleResult(generation);
    if (connectedResult) {
      allEdges.push(...connectedResult.edges);
      mergeMetadata(allMetadata, connectedResult.metadata);
      for (const [uri, state] of connectedResult.moderationStates) {
        moderationStates.set(uri, state);
      }
      connectedSucceeded = true;
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Connected context failed.';
    errors.push({ source: 'connected', kind: 'fetch-failure', message, retryable: true });
  }

  // Step 3: Attempt origin public context (if NOT private/direct)
  if (!params.isPrivateConversation && params.originHost) {
    originAttempted = true;
    try {
      const originResult = await deps.fetchOriginContext(
        params.rootCanonicalUri,
        params.originHost,
        signal,
      );
      if (!isGenerationCurrent(generation)) return staleResult(generation);
      if (originResult) {
        // Origin edges have highest confidence
        allEdges.push(...originResult.edges);
        mergeMetadata(allMetadata, originResult.metadata);
        originSucceeded = true;
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Origin context failed.';
      errors.push({ source: 'origin', kind: 'fetch-failure', message, retryable: true });
    }
  }

  if (!isGenerationCurrent(generation)) return staleResult(generation);

  // Step 4: Determine completeness
  let completeness: ConversationCompleteness;
  if (originSucceeded && connectedSucceeded) {
    completeness = 'origin-and-viewer-merged';
  } else if (originSucceeded) {
    completeness = 'origin-verified';
  } else if (connectedSucceeded) {
    completeness = 'connected-fallback';
  } else if (allEdges.length > 0) {
    completeness = 'cached-stale';
  } else {
    completeness = 'unavailable';
  }

  // Step 5: Build graph
  const buildInput: GraphBuildInput = {
    accountScopeKey: params.accountScope,
    rootCanonicalUri: params.rootCanonicalUri,
    focusedCanonicalUri: params.focusedCanonicalUri,
    edges: allEdges,
    nodeMetadata: allMetadata,
    rootAuthorId: params.rootAuthorId,
    moderationStates,
    completeness,
  };

  const graph = buildConversationGraph(buildInput);

  let state: ConversationQueryState = 'complete';
  if (errors.length > 0) {
    state = graph.nodes.size > 0 ? 'degraded' : 'failed';
  }

  return {
    graph,
    state,
    generation,
    completeness: graph.completeness,
    originAttempted,
    originSucceeded,
    connectedSucceeded,
    errors,
  };
}

// ─── Dependency injection types ──────────────────────────────────────────────

export interface ConversationQueryParams {
  readonly accountScope: string;
  readonly rootCanonicalUri: string;
  readonly focusedCanonicalUri: string;
  readonly rootAuthorId?: string;
  readonly originHost?: string;
  readonly isPrivateConversation: boolean;
}

export interface ContextFetchResult {
  readonly edges: ReplyEdgeObservation[];
  readonly metadata: Map<string, NodeMetadataInput>;
  readonly moderationStates?: Map<string, ConversationModerationState>;
}

export interface ConversationQueryDeps {
  /** Fetch context from the connected server (authenticated). */
  fetchConnectedContext(
    rootUri: string,
    focusedUri: string,
    signal?: AbortSignal,
  ): Promise<ContextFetchResult | null>;
  /** Fetch context from the origin server (public, NO auth token). */
  fetchOriginContext(
    rootUri: string,
    originHost: string,
    signal?: AbortSignal,
  ): Promise<ContextFetchResult | null>;
  /** Read cached edges from local store. */
  getLocalEdges(
    rootUri: string,
    accountScope: string,
  ): Promise<ContextFetchResult | null>;
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function mergeMetadata(
  target: Map<string, NodeMetadataInput>,
  source: Map<string, NodeMetadataInput>,
): void {
  for (const [uri, meta] of source) {
    const existing = target.get(uri);
    if (!existing) {
      target.set(uri, meta);
    } else {
      // Merge: prefer non-empty fields from newer source
      target.set(uri, {
        localStatusId: meta.localStatusId || existing.localStatusId,
        instanceOrigin: meta.instanceOrigin || existing.instanceOrigin,
        authorId: meta.authorId || existing.authorId,
        createdAt: meta.createdAt || existing.createdAt,
        editedAt: meta.editedAt || existing.editedAt,
      });
    }
  }
}

function staleResult(generation: number): ConversationQueryResult {
  return {
    graph: {
      schemaVersion: 1,
      accountScopeKey: '',
      rootCanonicalUri: '',
      focusedCanonicalUri: '',
      revision: 'stale',
      completeness: 'unavailable',
      nodes: new Map(),
      rootChildUris: [],
      focusedPathUris: [],
      diagnostics: { nodeCount: 0, edgeCount: 0, maxDepth: 0, missingNodeCount: 0, filteredNodeCount: 0, cyclesDetected: 0, buildTimeMs: 0 },
    },
    state: 'idle',
    generation,
    completeness: 'unavailable',
    originAttempted: false,
    originSucceeded: false,
    connectedSucceeded: false,
    errors: [],
  };
}
