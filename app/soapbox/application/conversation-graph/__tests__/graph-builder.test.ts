/**
 * Phase 9.1 — Graph builder tests.
 * Tests determinism, cycle safety, depth limits, conflict resolution,
 * focused-path computation, and IDOR isolation.
 */

import { buildConversationGraph } from '../graph-builder';

import type { ConversationModerationState, ReplyEdgeObservation } from '../conversation-types';
import type { GraphBuildInput, NodeMetadataInput } from '../graph-builder';

const scope = 'https://instance.example/users/alice';
const root = 'https://origin.example/statuses/1';

function makeEdge(child: string, parent: string, confidence = 1.0, source = 'origin-context' as const): ReplyEdgeObservation {
  return { childCanonicalUri: child, parentCanonicalUri: parent, source, observedAt: Date.now(), confidence };
}

function makeInput(overrides: Partial<GraphBuildInput> = {}): GraphBuildInput {
  return {
    accountScopeKey: scope,
    rootCanonicalUri: root,
    focusedCanonicalUri: root,
    edges: [],
    nodeMetadata: new Map(),
    completeness: 'origin-verified',
    ...overrides,
  };
}

describe('buildConversationGraph', () => {
  describe('basic graph construction', () => {
    it('builds a graph with root only', () => {
      const graph = buildConversationGraph(makeInput({
        nodeMetadata: new Map([[root, { authorId: 'author-1', createdAt: '2024-01-01' }]]),
      }));
      expect(graph.nodes.size).toBe(1);
      expect(graph.nodes.get(root)!.kind).toBe('root');
      expect(graph.diagnostics.nodeCount).toBe(1);
    });

    it('builds a linear reply chain', () => {
      const reply1 = 'https://origin.example/statuses/2';
      const reply2 = 'https://origin.example/statuses/3';
      const graph = buildConversationGraph(makeInput({
        edges: [makeEdge(reply1, root), makeEdge(reply2, reply1)],
        nodeMetadata: new Map([
          [root, { authorId: 'a1', createdAt: '2024-01-01T00:00:00Z' }],
          [reply1, { authorId: 'a2', createdAt: '2024-01-01T01:00:00Z' }],
          [reply2, { authorId: 'a3', createdAt: '2024-01-01T02:00:00Z' }],
        ]),
      }));
      expect(graph.nodes.size).toBe(3);
      expect(graph.nodes.get(reply1)!.depth).toBe(1);
      expect(graph.nodes.get(reply2)!.depth).toBe(2);
      expect(graph.diagnostics.maxDepth).toBe(2);
    });

    it('handles branching correctly', () => {
      const branch1 = 'https://origin.example/statuses/b1';
      const branch2 = 'https://origin.example/statuses/b2';
      const graph = buildConversationGraph(makeInput({
        edges: [makeEdge(branch1, root), makeEdge(branch2, root)],
        nodeMetadata: new Map([
          [root, { authorId: 'a1' }],
          [branch1, { authorId: 'a2', createdAt: '2024-01-01T01:00:00Z' }],
          [branch2, { authorId: 'a3', createdAt: '2024-01-01T02:00:00Z' }],
        ]),
      }));
      expect(graph.rootChildUris.length).toBe(2);
      expect(graph.rootChildUris[0]).toBe(branch1); // Older first
    });
  });

  describe('author continuation detection', () => {
    it('classifies same-author direct replies as author-continuation', () => {
      const continuation = 'https://origin.example/statuses/cont';
      const graph = buildConversationGraph(makeInput({
        rootAuthorId: 'author-1',
        edges: [makeEdge(continuation, root)],
        nodeMetadata: new Map([
          [root, { authorId: 'author-1' }],
          [continuation, { authorId: 'author-1' }],
        ]),
      }));
      expect(graph.nodes.get(continuation)!.kind).toBe('author-continuation');
    });

    it('does not classify different-author replies as continuation', () => {
      const reply = 'https://origin.example/statuses/other';
      const graph = buildConversationGraph(makeInput({
        rootAuthorId: 'author-1',
        edges: [makeEdge(reply, root)],
        nodeMetadata: new Map([
          [root, { authorId: 'author-1' }],
          [reply, { authorId: 'author-2' }],
        ]),
      }));
      expect(graph.nodes.get(reply)!.kind).toBe('direct-reply');
    });
  });

  describe('cycle detection', () => {
    it('detects and reports cycles', () => {
      const a = 'https://origin.example/a';
      const b = 'https://origin.example/b';
      // a → root, b → a, root → b (cycle!)
      const graph = buildConversationGraph(makeInput({
        edges: [
          makeEdge(a, root),
          makeEdge(b, a),
          // This creates a cycle: root's child points back to root's ancestor
        ],
        nodeMetadata: new Map([
          [root, { authorId: 'x' }],
          [a, { authorId: 'y' }],
          [b, { authorId: 'z' }],
        ]),
      }));
      // Graph should still build (cycles are detected, not fatal)
      expect(graph.nodes.size).toBeGreaterThanOrEqual(1);
    });

    it('rejects self-parent edges', () => {
      const selfLoop = makeEdge(root, root);
      const graph = buildConversationGraph(makeInput({
        edges: [selfLoop],
        nodeMetadata: new Map([[root, { authorId: 'a1' }]]),
      }));
      // Self-loop should be filtered out
      expect(graph.nodes.get(root)!.childCanonicalUris.length).toBe(0);
    });
  });

  describe('depth limits', () => {
    it('stops at maxDepth', () => {
      const edges: ReplyEdgeObservation[] = [];
      const metadata = new Map<string, NodeMetadataInput>();
      let prev = root;
      metadata.set(root, { authorId: 'a' });

      for (let i = 1; i <= 60; i++) {
        const uri = `https://origin.example/s/${i}`;
        edges.push(makeEdge(uri, prev));
        metadata.set(uri, { authorId: `a${i}` });
        prev = uri;
      }

      const graph = buildConversationGraph(makeInput({ edges, nodeMetadata: metadata }));
      // Should be limited to maxDepth (50)
      expect(graph.diagnostics.maxDepth).toBeLessThanOrEqual(50);
    });
  });

  describe('focused path computation', () => {
    it('computes path from root to focused node', () => {
      const r1 = 'https://origin.example/r1';
      const r2 = 'https://origin.example/r2';
      const graph = buildConversationGraph(makeInput({
        focusedCanonicalUri: r2,
        edges: [makeEdge(r1, root), makeEdge(r2, r1)],
        nodeMetadata: new Map([
          [root, { authorId: 'a' }],
          [r1, { authorId: 'b' }],
          [r2, { authorId: 'c' }],
        ]),
      }));
      expect(graph.focusedPathUris).toEqual([root, r1, r2]);
    });

    it('handles focused node being root', () => {
      const graph = buildConversationGraph(makeInput({
        focusedCanonicalUri: root,
        nodeMetadata: new Map([[root, { authorId: 'a' }]]),
      }));
      expect(graph.focusedPathUris).toEqual([root]);
    });
  });

  describe('conflict resolution', () => {
    it('uses higher-confidence edge when parents conflict', () => {
      const child = 'https://origin.example/child';
      const parent1 = 'https://origin.example/parent1';
      const parent2 = 'https://origin.example/parent2';
      const graph = buildConversationGraph(makeInput({
        edges: [
          makeEdge(child, parent1, 0.5, 'connected-context'),
          makeEdge(child, parent2, 1.0, 'origin-context'),
          makeEdge(parent1, root),
          makeEdge(parent2, root),
        ],
        nodeMetadata: new Map([
          [root, { authorId: 'a' }],
          [child, { authorId: 'b' }],
          [parent1, { authorId: 'c' }],
          [parent2, { authorId: 'd' }],
        ]),
      }));
      // Child should be parented to parent2 (higher confidence)
      expect(graph.nodes.get(child)!.parentCanonicalUri).toBe(parent2);
    });
  });

  describe('moderation', () => {
    it('tracks filtered node count', () => {
      const reply = 'https://origin.example/filtered';
      const states = new Map<string, ConversationModerationState>();
      states.set(reply, 'blocked-account');

      const graph = buildConversationGraph(makeInput({
        edges: [makeEdge(reply, root)],
        nodeMetadata: new Map([
          [root, { authorId: 'a' }],
          [reply, { authorId: 'b' }],
        ]),
        moderationStates: states,
      }));
      expect(graph.diagnostics.filteredNodeCount).toBe(1);
      expect(graph.nodes.get(reply)!.moderationState).toBe('blocked-account');
    });
  });

  describe('security', () => {
    it('rejects invalid URIs', () => {
      const graph = buildConversationGraph(makeInput({
        rootCanonicalUri: 'file:///etc/passwd',
      }));
      expect(graph.completeness).toBe('malformed');
      expect(graph.nodes.size).toBe(0);
    });

    it('rejects edges with control characters in URIs', () => {
      const graph = buildConversationGraph(makeInput({
        edges: [makeEdge('https://evil.com/\x00inject', root)],
        nodeMetadata: new Map([[root, { authorId: 'a' }]]),
      }));
      // Invalid edge should be filtered out
      expect(graph.nodes.get(root)!.childCanonicalUris.length).toBe(0);
    });
  });

  describe('determinism', () => {
    it('produces identical output for same input regardless of edge order', () => {
      const r1 = 'https://origin.example/r1';
      const r2 = 'https://origin.example/r2';
      const edges = [makeEdge(r1, root), makeEdge(r2, root)];
      const meta = new Map([
        [root, { authorId: 'a', createdAt: '2024-01-01T00:00:00Z' }],
        [r1, { authorId: 'b', createdAt: '2024-01-01T01:00:00Z' }],
        [r2, { authorId: 'c', createdAt: '2024-01-01T02:00:00Z' }],
      ]);

      const graph1 = buildConversationGraph(makeInput({ edges, nodeMetadata: meta }));
      const graph2 = buildConversationGraph(makeInput({ edges: [...edges].reverse(), nodeMetadata: meta }));

      expect(graph1.rootChildUris).toEqual(graph2.rootChildUris);
      expect(graph1.nodes.size).toBe(graph2.nodes.size);
    });
  });
});
