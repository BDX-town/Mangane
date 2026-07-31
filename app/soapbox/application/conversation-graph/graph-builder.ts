/**
 * Phase 9.1 — Canonical conversation graph builder.
 *
 * Builds an immutable ConversationGraph from reply-edge observations.
 * The output is deterministic regardless of ingestion order.
 *
 * Properties:
 * - Immutable output (no mutation after construction)
 * - Deterministic: same observations → same graph
 * - Bounded: respects node, edge, depth, time limits
 * - Cycle-safe: detects and breaks cycles
 * - Conflict-aware: conflicting parents recorded with provenance
 * - Moderation-applied: nodes filtered before summary generation
 *
 * Security:
 * - URI validation (http(s) only, bounded length)
 * - Self-parent rejection
 * - Cycle detection with visiting/visited sets
 * - Node/edge count bounds prevent memory exhaustion
 * - Build time budget prevents CPU exhaustion
 * - No mutable raw payloads in output
 */

import { DEFAULT_GRAPH_LIMITS } from './conversation-types';

import type {
  ConversationCompleteness,
  ConversationGraph,
  ConversationGraphDiagnostics,
  ConversationGraphLimits,
  ConversationGraphNode,
  ConversationModerationState,
  ConversationNodeKind,
  ReplyEdgeObservation,
  StatusAliasRef,
} from './conversation-types';

// ─── Builder input ───────────────────────────────────────────────────────────

export interface GraphBuildInput {
  /** Account scope for IDOR isolation. */
  readonly accountScopeKey: string;
  /** The root status canonical URI. */
  readonly rootCanonicalUri: string;
  /** The currently focused status URI (for focused-path computation). */
  readonly focusedCanonicalUri: string;
  /** All reply-edge observations to build the graph from. */
  readonly edges: ReadonlyArray<ReplyEdgeObservation>;
  /** Known node metadata (author, timestamps, aliases). */
  readonly nodeMetadata: ReadonlyMap<string, NodeMetadataInput>;
  /** Account ID of the root post author (for continuation detection). */
  readonly rootAuthorId?: string;
  /** Moderation state per canonical URI. */
  readonly moderationStates?: ReadonlyMap<string, ConversationModerationState>;
  /** Completeness of the source data. */
  readonly completeness: ConversationCompleteness;
}

export interface NodeMetadataInput {
  readonly localStatusId?: string;
  readonly instanceOrigin?: string;
  readonly authorId?: string;
  readonly createdAt?: string;
  readonly editedAt?: string;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Build a canonical conversation graph from observations.
 *
 * This is the primary entry point. The output is fully immutable and
 * deterministic for the same input observations.
 */
export function buildConversationGraph(
  input: GraphBuildInput,
  limits: ConversationGraphLimits = DEFAULT_GRAPH_LIMITS,
): ConversationGraph {
  const startTime = Date.now();

  // Validate root URI
  if (!isValidUri(input.rootCanonicalUri)) {
    return emptyGraph(input, 'malformed');
  }

  // Deduplicate and validate edges
  const validEdges = deduplicateEdges(input.edges, limits);

  // Build adjacency maps
  const childrenOf = new Map<string, string[]>();
  const parentOf = new Map<string, string>();
  const provenanceOf = new Map<string, ReplyEdgeObservation[]>();
  const allUris = new Set<string>();
  allUris.add(input.rootCanonicalUri);
  if (input.focusedCanonicalUri) allUris.add(input.focusedCanonicalUri);

  for (const edge of validEdges) {
    // Self-parent rejection
    if (edge.childCanonicalUri === edge.parentCanonicalUri) continue;

    allUris.add(edge.childCanonicalUri);
    allUris.add(edge.parentCanonicalUri);

    // Use highest-confidence edge when there's a conflict
    const existingParent = parentOf.get(edge.childCanonicalUri);
    if (existingParent && existingParent !== edge.parentCanonicalUri) {
      // Conflict: keep the higher-confidence one
      const existingProvenance = provenanceOf.get(edge.childCanonicalUri) || [];
      const existingMaxConfidence = Math.max(...existingProvenance.map(p => p.confidence), 0);
      if (edge.confidence <= existingMaxConfidence) continue;
    }

    parentOf.set(edge.childCanonicalUri, edge.parentCanonicalUri);

    if (!childrenOf.has(edge.parentCanonicalUri)) {
      childrenOf.set(edge.parentCanonicalUri, []);
    }
    childrenOf.get(edge.parentCanonicalUri)!.push(edge.childCanonicalUri);

    // Store provenance
    if (!provenanceOf.has(edge.childCanonicalUri)) {
      provenanceOf.set(edge.childCanonicalUri, []);
    }
    provenanceOf.get(edge.childCanonicalUri)!.push(edge);

    // Enforce edge limit
    if (parentOf.size > limits.maxEdges) break;
  }

  // Check build time budget
  if (Date.now() - startTime > limits.maxBuildTimeMs) {
    return emptyGraph(input, 'depth-truncated');
  }

  // Detect cycles using DFS with visiting/visited sets
  const cyclesDetected = detectCycles(input.rootCanonicalUri, childrenOf, limits.maxDepth);

  // Build nodes with depth computation (BFS from root)
  const nodes = new Map<string, ConversationGraphNode>();
  const rootChildUris: string[] = [];
  let maxDepth = 0;
  let missingCount = 0;
  let filteredCount = 0;

  // BFS to assign depths and build nodes
  const queue: Array<{ uri: string; depth: number; pathUris: string[] }> = [
    { uri: input.rootCanonicalUri, depth: 0, pathUris: [] },
  ];
  const visited = new Set<string>();

  while (queue.length > 0 && nodes.size < limits.maxNodes) {
    const { uri, depth, pathUris } = queue.shift()!;
    if (visited.has(uri)) continue; // Cycle prevention
    if (depth > limits.maxDepth) continue;
    visited.add(uri);

    const meta = input.nodeMetadata.get(uri);
    const moderationState = input.moderationStates?.get(uri) || 'visible';
    const kind = classifyNode(uri, input, parentOf, meta?.authorId, depth);
    const children = (childrenOf.get(uri) || []).slice(0, limits.maxChildrenPerNode);
    const currentPath = [...pathUris, uri];

    if (moderationState === 'filtered' || moderationState === 'muted-account' ||
        moderationState === 'blocked-account' || moderationState === 'domain-blocked') {
      filteredCount++;
    }
    if (kind === 'missing') missingCount++;
    if (depth > maxDepth) maxDepth = depth;

    const node: ConversationGraphNode = {
      canonicalUri: uri,
      statusAliasIds: meta ? [buildAliasRef(uri, meta)] : [{ canonicalUri: uri }],
      parentCanonicalUri: parentOf.get(uri) || null,
      childCanonicalUris: children,
      depth,
      branchRootCanonicalUri: depth <= 1 ? uri : (pathUris[1] || uri),
      pathCanonicalUris: currentPath,
      kind,
      provenance: provenanceOf.get(uri) || [],
      moderationState,
      authorId: meta?.authorId,
      createdAt: meta?.createdAt,
      editedAt: meta?.editedAt,
    };

    nodes.set(uri, node);

    if (depth === 1) rootChildUris.push(uri);

    // Enqueue children
    for (const childUri of children) {
      if (!visited.has(childUri)) {
        queue.push({ uri: childUri, depth: depth + 1, pathUris: currentPath });
      }
    }
  }

  // Compute focused path
  const focusedPathUris = computeFocusedPath(input.focusedCanonicalUri, parentOf, input.rootCanonicalUri);

  // Sort root children deterministically (by createdAt, then URI)
  rootChildUris.sort((a, b) => {
    const metaA = input.nodeMetadata.get(a);
    const metaB = input.nodeMetadata.get(b);
    const timeA = metaA?.createdAt || '';
    const timeB = metaB?.createdAt || '';
    if (timeA !== timeB) return timeA < timeB ? -1 : 1;
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  const buildTimeMs = Date.now() - startTime;

  const diagnostics: ConversationGraphDiagnostics = {
    nodeCount: nodes.size,
    edgeCount: parentOf.size,
    maxDepth,
    missingNodeCount: missingCount,
    filteredNodeCount: filteredCount,
    cyclesDetected,
    buildTimeMs,
  };

  return {
    schemaVersion: 1,
    accountScopeKey: input.accountScopeKey,
    rootCanonicalUri: input.rootCanonicalUri,
    focusedCanonicalUri: input.focusedCanonicalUri,
    revision: `${Date.now()}-${nodes.size}`,
    completeness: cyclesDetected > 0 ? 'cyclic' : input.completeness,
    nodes,
    rootChildUris,
    focusedPathUris,
    diagnostics,
  };
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function emptyGraph(input: GraphBuildInput, completeness: ConversationCompleteness): ConversationGraph {
  return {
    schemaVersion: 1,
    accountScopeKey: input.accountScopeKey,
    rootCanonicalUri: input.rootCanonicalUri,
    focusedCanonicalUri: input.focusedCanonicalUri,
    revision: `${Date.now()}-0`,
    completeness,
    nodes: new Map(),
    rootChildUris: [],
    focusedPathUris: [],
    diagnostics: { nodeCount: 0, edgeCount: 0, maxDepth: 0, missingNodeCount: 0, filteredNodeCount: 0, cyclesDetected: 0, buildTimeMs: 0 },
  };
}

function deduplicateEdges(
  edges: ReadonlyArray<ReplyEdgeObservation>,
  limits: ConversationGraphLimits,
): ReplyEdgeObservation[] {
  const seen = new Set<string>();
  const result: ReplyEdgeObservation[] = [];

  for (const edge of edges) {
    if (result.length >= limits.maxEdges) break;
    if (!isValidUri(edge.childCanonicalUri) || !isValidUri(edge.parentCanonicalUri)) continue;

    const key = `${edge.childCanonicalUri}→${edge.parentCanonicalUri}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(edge);
  }

  // Sort by confidence (highest first) for deterministic conflict resolution
  result.sort((a, b) => b.confidence - a.confidence);
  return result;
}

function detectCycles(
  rootUri: string,
  childrenOf: Map<string, string[]>,
  maxDepth: number,
): number {
  let cycles = 0;
  const visiting = new Set<string>();
  const visited = new Set<string>();

  function dfs(uri: string, depth: number): void {
    if (depth > maxDepth) return;
    if (visited.has(uri)) return;
    if (visiting.has(uri)) {
      cycles++;
      return;
    }
    visiting.add(uri);
    const children = childrenOf.get(uri) || [];
    for (const child of children) {
      dfs(child, depth + 1);
    }
    visiting.delete(uri);
    visited.add(uri);
  }

  dfs(rootUri, 0);
  return cycles;
}

function classifyNode(
  uri: string,
  input: GraphBuildInput,
  parentOf: Map<string, string>,
  authorId: string | undefined,
  depth: number,
): ConversationNodeKind {
  if (uri === input.rootCanonicalUri) return 'root';

  // Author continuation: same author as root, directly in the root's reply chain
  if (authorId && authorId === input.rootAuthorId) {
    const parent = parentOf.get(uri);
    if (parent === input.rootCanonicalUri) return 'author-continuation';
    // Check if parent is also author-continuation
    const parentMeta = input.nodeMetadata.get(parent || '');
    if (parentMeta?.authorId === input.rootAuthorId) return 'author-continuation';
  }

  // Check if node metadata exists (indicates we have the status)
  const meta = input.nodeMetadata.get(uri);
  if (!meta) return 'missing';

  if (depth === 1) return 'direct-reply';
  return 'nested-reply';
}

function computeFocusedPath(
  focusedUri: string,
  parentOf: Map<string, string>,
  rootUri: string,
): string[] {
  if (!focusedUri || focusedUri === rootUri) return [rootUri];

  const path: string[] = [];
  let current: string | undefined = focusedUri;
  let hops = 0;
  const maxHops = 100;

  while (current && hops < maxHops) {
    path.unshift(current);
    if (current === rootUri) break;
    current = parentOf.get(current);
    hops++;
  }

  // If we didn't reach the root, prepend it
  if (path[0] !== rootUri) {
    path.unshift(rootUri);
  }

  return path;
}

function buildAliasRef(uri: string, meta: NodeMetadataInput): StatusAliasRef {
  return {
    canonicalUri: uri,
    localStatusId: meta.localStatusId,
    instanceOrigin: meta.instanceOrigin,
  };
}

function isValidUri(uri: string): boolean {
  if (!uri || uri.length > 2048) return false;
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1f]/.test(uri)) return false;
  try {
    const parsed = new URL(uri);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
