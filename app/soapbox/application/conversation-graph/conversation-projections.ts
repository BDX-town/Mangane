/**
 * Phase 9.3 — Structural and chronological projections.
 *
 * Derives presentation-ready projections from the immutable conversation graph.
 * Two modes:
 * - Structural: branches, continuations, focused path
 * - Chronological: strict time-sorted with parent cues
 *
 * Phase 9.4 — Adaptive branch policy and summaries.
 *
 * Implements deterministic expansion policy and moderation-safe summaries.
 */

import type {
  BranchSummary,
  ConversationGraph,
  ConversationGraphNode,
  ConversationViewState,
} from './conversation-types';

// ─── Structural projection ───────────────────────────────────────────────────

export interface StructuralProjection {
  /** The root node. */
  readonly root: ProjectedNode;
  /** Author continuation lane (root author's direct reply chain). */
  readonly authorContinuation: ReadonlyArray<ProjectedNode>;
  /** Direct reply branches (each is a branch root). */
  readonly branches: ReadonlyArray<ProjectedBranch>;
  /** The focused path (root → focused node). */
  readonly focusedPath: ReadonlyArray<string>;
  /** Total visible node count. */
  readonly visibleNodeCount: number;
}

export interface ProjectedNode {
  readonly canonicalUri: string;
  readonly kind: string;
  readonly depth: number;
  readonly authorId?: string;
  readonly isOnFocusedPath: boolean;
  readonly isMissing: boolean;
  readonly isFiltered: boolean;
}

export interface ProjectedBranch {
  readonly branchRootUri: string;
  readonly nodes: ReadonlyArray<ProjectedNode>;
  readonly summary: BranchSummary;
  readonly isExpanded: boolean;
  readonly containsFocusedNode: boolean;
}

/**
 * Build a structural projection from the conversation graph.
 *
 * @param graph - The immutable conversation graph
 * @param viewState - Current view state (expanded/collapsed branches)
 * @param rootAuthorId - Root post author for continuation detection
 * @param maxSummaryParticipants - Max avatars in branch summaries
 */
export function buildStructuralProjection(
  graph: ConversationGraph,
  viewState?: ConversationViewState | null,
  rootAuthorId?: string,
  maxSummaryParticipants: number = 5,
): StructuralProjection {
  const focusedPathSet = new Set(graph.focusedPathUris);
  const expandedSet = new Set(viewState?.expandedBranchUris || []);
  const collapsedSet = new Set(viewState?.collapsedBranchUris || []);

  // Root node
  const rootNode = graph.nodes.get(graph.rootCanonicalUri);
  const projectedRoot = projectNode(rootNode, graph.rootCanonicalUri, focusedPathSet);

  // Author continuation
  const authorContinuation: ProjectedNode[] = [];
  if (rootNode && rootAuthorId) {
    collectAuthorContinuation(graph, graph.rootCanonicalUri, rootAuthorId, focusedPathSet, authorContinuation);
  }

  // Direct reply branches (non-continuation children of root)
  const branches: ProjectedBranch[] = [];
  const continuationUris = new Set(authorContinuation.map(n => n.canonicalUri));

  for (const childUri of graph.rootChildUris) {
    if (continuationUris.has(childUri)) continue; // Skip continuation nodes

    const containsFocused = focusedPathSet.has(childUri);
    const isExpanded = determineBranchExpansion(childUri, expandedSet, collapsedSet, containsFocused, graph);

    const branchNodes: ProjectedNode[] = [];
    if (isExpanded) {
      collectBranchNodes(graph, childUri, focusedPathSet, branchNodes, 20); // Bounded depth
    }

    const summary = buildBranchSummary(graph, childUri, rootAuthorId, maxSummaryParticipants, isExpanded);
    branches.push({
      branchRootUri: childUri,
      nodes: branchNodes,
      summary,
      isExpanded,
      containsFocusedNode: containsFocused || branchNodes.some(n => n.isOnFocusedPath),
    });
  }

  const visibleNodeCount = 1 + authorContinuation.length + branches.reduce((sum, b) => sum + (b.isExpanded ? b.nodes.length : 1), 0);

  return {
    root: projectedRoot,
    authorContinuation,
    branches,
    focusedPath: graph.focusedPathUris,
    visibleNodeCount,
  };
}

// ─── Chronological projection ────────────────────────────────────────────────

export interface ChronologicalItem {
  readonly canonicalUri: string;
  readonly parentCanonicalUri: string | null;
  readonly depth: number;
  readonly kind: string;
  readonly createdAt: string;
  readonly authorId?: string;
  readonly isOnFocusedPath: boolean;
}

/**
 * Build a chronological projection (strict time sort).
 * Retains parent cues but does not group by branch.
 */
export function buildChronologicalProjection(
  graph: ConversationGraph,
): ReadonlyArray<ChronologicalItem> {
  const focusedPathSet = new Set(graph.focusedPathUris);
  const items: ChronologicalItem[] = [];

  for (const [uri, node] of graph.nodes) {
    if (node.moderationState !== 'visible' && node.moderationState !== 'content-warning') {
      continue; // Skip moderated nodes in chronological view
    }
    items.push({
      canonicalUri: uri,
      parentCanonicalUri: node.parentCanonicalUri,
      depth: node.depth,
      kind: node.kind,
      createdAt: node.createdAt || '',
      authorId: node.authorId,
      isOnFocusedPath: focusedPathSet.has(uri),
    });
  }

  // Sort by createdAt, then URI for deterministic tie-breaking
  items.sort((a, b) => {
    if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? -1 : 1;
    if (a.canonicalUri < b.canonicalUri) return -1;
    if (a.canonicalUri > b.canonicalUri) return 1;
    return 0;
  });

  return items;
}

// ─── Branch expansion policy (9.4) ──────────────────────────────────────────

/**
 * Determine if a branch should be expanded.
 * Deterministic and user-overridable.
 */
function determineBranchExpansion(
  branchRootUri: string,
  expandedSet: Set<string>,
  collapsedSet: Set<string>,
  containsFocusedNode: boolean,
  graph: ConversationGraph,
): boolean {
  // Explicit user state takes priority
  if (expandedSet.has(branchRootUri)) return true;
  if (collapsedSet.has(branchRootUri)) return false;

  // Always expand the focused path
  if (containsFocusedNode) return true;

  // Small conversations: expand all
  if (graph.nodes.size <= 20) return true;

  // Default: collapse large branches
  return false;
}

// ─── Branch summary builder (9.4) ───────────────────────────────────────────

function buildBranchSummary(
  graph: ConversationGraph,
  branchRootUri: string,
  rootAuthorId: string | undefined,
  maxParticipants: number,
  isExpanded: boolean,
): BranchSummary {
  const participants = new Set<string>();
  let directReplyCount = 0;
  let totalVisible = 0;
  let hiddenCount = 0;
  let hasRootAuthor = false;
  let lastActivityAt: string | null = null;

  // BFS through branch
  const queue = [branchRootUri];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const uri = queue.shift()!;
    if (visited.has(uri)) continue;
    visited.add(uri);

    const node = graph.nodes.get(uri);
    if (!node) continue;

    // Moderation check: don't count or expose hidden nodes
    if (node.moderationState !== 'visible' && node.moderationState !== 'content-warning') {
      hiddenCount++;
      continue;
    }

    totalVisible++;
    if (node.depth === 1 || uri === branchRootUri) directReplyCount++;

    // Track participants (bounded)
    if (node.authorId && participants.size < maxParticipants) {
      participants.add(node.authorId);
    }
    if (node.authorId === rootAuthorId) hasRootAuthor = true;

    // Track last activity
    if (node.createdAt && (!lastActivityAt || node.createdAt > lastActivityAt)) {
      lastActivityAt = node.createdAt;
    }

    // Enqueue children
    for (const childUri of node.childCanonicalUris) {
      if (!visited.has(childUri)) queue.push(childUri);
    }
  }

  return {
    branchRootUri,
    directReplyCount,
    totalVisibleDescendants: totalVisible,
    participantIds: [...participants],
    lastActivityAt,
    unreadCount: 0, // Populated by reading state (Phase 9.6)
    hasRootAuthorParticipation: hasRootAuthor,
    hiddenCount,
    isExpanded,
  };
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function projectNode(
  node: ConversationGraphNode | undefined,
  uri: string,
  focusedPathSet: Set<string>,
): ProjectedNode {
  return {
    canonicalUri: uri,
    kind: node?.kind || 'missing',
    depth: node?.depth || 0,
    authorId: node?.authorId,
    isOnFocusedPath: focusedPathSet.has(uri),
    isMissing: !node || node.kind === 'missing',
    isFiltered: node?.moderationState === 'filtered' || node?.moderationState === 'blocked-account' || node?.moderationState === 'muted-account',
  };
}

function collectAuthorContinuation(
  graph: ConversationGraph,
  parentUri: string,
  rootAuthorId: string,
  focusedPathSet: Set<string>,
  result: ProjectedNode[],
  maxDepth: number = 10,
): void {
  if (maxDepth <= 0) return;
  const parentNode = graph.nodes.get(parentUri);
  if (!parentNode) return;

  for (const childUri of parentNode.childCanonicalUris) {
    const child = graph.nodes.get(childUri);
    if (!child) continue;
    if (child.kind === 'author-continuation' || child.authorId === rootAuthorId) {
      result.push(projectNode(child, childUri, focusedPathSet));
      collectAuthorContinuation(graph, childUri, rootAuthorId, focusedPathSet, result, maxDepth - 1);
      break; // Only follow one continuation chain
    }
  }
}

function collectBranchNodes(
  graph: ConversationGraph,
  rootUri: string,
  focusedPathSet: Set<string>,
  result: ProjectedNode[],
  maxNodes: number,
): void {
  const queue = [rootUri];
  const visited = new Set<string>();

  while (queue.length > 0 && result.length < maxNodes) {
    const uri = queue.shift()!;
    if (visited.has(uri)) continue;
    visited.add(uri);

    const node = graph.nodes.get(uri);
    if (!node) continue;

    // Skip moderated nodes
    if (node.moderationState !== 'visible' && node.moderationState !== 'content-warning') {
      continue;
    }

    result.push(projectNode(node, uri, focusedPathSet));

    for (const childUri of node.childCanonicalUris) {
      if (!visited.has(childUri)) queue.push(childUri);
    }
  }
}
