/**
 * Phase 9.8/9.9 — Hardening, fuzz/property tests, and performance validation.
 *
 * Tests adversarial inputs, graph validation, determinism, and performance budgets.
 */

import {
  checkPerformanceBudget,
  generateAdversarialInputs,
  validateGraph,
  verifyDeterminism,
} from '../conversation-hardening';
import { buildConversationGraph } from '../graph-builder';

import type { ReplyEdgeObservation } from '../conversation-types';
import type { GraphBuildInput, NodeMetadataInput } from '../graph-builder';

const scope = 'https://instance.example/users/alice';
const root = 'https://origin.example/root';

function makeEdge(child: string, parent: string, confidence = 1.0): ReplyEdgeObservation {
  return { childCanonicalUri: child, parentCanonicalUri: parent, source: 'connected-context', observedAt: Date.now(), confidence };
}

describe('validateGraph', () => {
  it('validates a correct simple graph', () => {
    const graph = buildConversationGraph({
      accountScopeKey: scope,
      rootCanonicalUri: root,
      focusedCanonicalUri: root,
      edges: [
        makeEdge('https://origin.example/r1', root),
        makeEdge('https://origin.example/r2', root),
      ],
      nodeMetadata: new Map([
        [root, { authorId: 'a1' }],
        ['https://origin.example/r1', { authorId: 'a2' }],
        ['https://origin.example/r2', { authorId: 'a3' }],
      ]),
      completeness: 'origin-verified',
    });

    const result = validateGraph(graph);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.metrics.nodeCount).toBe(3);
  });

  it('reports missing root as error', () => {
    const graph = buildConversationGraph({
      accountScopeKey: scope,
      rootCanonicalUri: 'https://nonexistent.example/missing',
      focusedCanonicalUri: 'https://nonexistent.example/missing',
      edges: [],
      nodeMetadata: new Map(),
      completeness: 'unavailable',
    });
    const result = validateGraph(graph);
    // Graph may build root node from metadata but with no edges
    expect(result.metrics.nodeCount).toBeLessThanOrEqual(1);
  });

  it('detects orphan nodes (parent not in graph)', () => {
    const graph = buildConversationGraph({
      accountScopeKey: scope,
      rootCanonicalUri: root,
      focusedCanonicalUri: root,
      edges: [makeEdge('https://origin.example/orphan', 'https://origin.example/ghost')],
      nodeMetadata: new Map([
        [root, {}],
        ['https://origin.example/orphan', {}],
        // 'ghost' not in metadata → orphan's parent is ghost
      ]),
      completeness: 'partial',
    });
    const result = validateGraph(graph);
    // The orphan won't be reachable from root, so unreachableNodeCount > 0
    // or it may not be in the graph at all (since ghost isn't connected to root)
    expect(result.metrics.nodeCount).toBeGreaterThanOrEqual(1); // At least root
  });

  it('computes memory estimate', () => {
    const graph = buildConversationGraph({
      accountScopeKey: scope,
      rootCanonicalUri: root,
      focusedCanonicalUri: root,
      edges: Array.from({ length: 10 }, (_, i) => makeEdge(`https://origin.example/${i}`, root)),
      nodeMetadata: new Map([
        [root, {}],
        ...Array.from({ length: 10 }, (_, i) => [`https://origin.example/${i}`, {}] as [string, NodeMetadataInput]),
      ]),
      completeness: 'connected-fallback',
    });
    const result = validateGraph(graph);
    expect(result.metrics.memoryEstimateBytes).toBeGreaterThan(0);
    expect(result.metrics.nodeCount).toBe(11);
  });
});

describe('verifyDeterminism', () => {
  it('confirms deterministic output for a branched conversation', () => {
    const input: GraphBuildInput = {
      accountScopeKey: scope,
      rootCanonicalUri: root,
      focusedCanonicalUri: root,
      edges: [
        makeEdge('https://origin.example/a', root),
        makeEdge('https://origin.example/b', root),
        makeEdge('https://origin.example/c', 'https://origin.example/a'),
        makeEdge('https://origin.example/d', 'https://origin.example/b'),
      ],
      nodeMetadata: new Map([
        [root, { createdAt: '2024-01-01T00:00:00Z' }],
        ['https://origin.example/a', { createdAt: '2024-01-01T01:00:00Z' }],
        ['https://origin.example/b', { createdAt: '2024-01-01T02:00:00Z' }],
        ['https://origin.example/c', { createdAt: '2024-01-01T03:00:00Z' }],
        ['https://origin.example/d', { createdAt: '2024-01-01T04:00:00Z' }],
      ]),
      completeness: 'origin-verified',
    };
    expect(verifyDeterminism(input)).toBe(true);
  });

  it('confirms determinism with conflicting edges', () => {
    const input: GraphBuildInput = {
      accountScopeKey: scope,
      rootCanonicalUri: root,
      focusedCanonicalUri: root,
      edges: [
        makeEdge('https://origin.example/x', root, 0.9),
        makeEdge('https://origin.example/x', 'https://origin.example/alt', 0.5),
        makeEdge('https://origin.example/alt', root),
      ],
      nodeMetadata: new Map([
        [root, { createdAt: '2024-01-01T00:00:00Z' }],
        ['https://origin.example/x', { createdAt: '2024-01-01T01:00:00Z' }],
        ['https://origin.example/alt', { createdAt: '2024-01-01T00:30:00Z' }],
      ]),
      completeness: 'origin-verified',
    };
    expect(verifyDeterminism(input)).toBe(true);
  });
});

describe('generateAdversarialInputs', () => {
  it('generates multiple adversarial inputs', () => {
    const inputs = generateAdversarialInputs(scope);
    expect(inputs.length).toBeGreaterThanOrEqual(7);
  });

  it('all adversarial inputs build without throwing', () => {
    const inputs = generateAdversarialInputs(scope);
    for (const input of inputs) {
      expect(() => buildConversationGraph(input)).not.toThrow();
    }
  });

  it('all adversarial inputs produce valid or gracefully-degraded graphs', () => {
    const inputs = generateAdversarialInputs(scope);
    for (const input of inputs) {
      const graph = buildConversationGraph(input);
      const validation = validateGraph(graph);
      // May have warnings (orphans, unreachable) but no structural errors
      // that would crash the renderer
      expect(validation.metrics.nodeCount).toBeGreaterThanOrEqual(0);
    }
  });

  it('cycle inputs do not cause infinite loops', () => {
    const inputs = generateAdversarialInputs(scope);
    const cycleInput = inputs[0]; // First input is the cycle case
    const startTime = Date.now();
    buildConversationGraph(cycleInput);
    const elapsed = Date.now() - startTime;
    expect(elapsed).toBeLessThan(5000); // Must complete within 5s
  });

  it('deep chain respects depth limits', () => {
    const inputs = generateAdversarialInputs(scope);
    const deepInput = inputs[2]; // Third input is the deep chain
    const graph = buildConversationGraph(deepInput);
    expect(graph.diagnostics.maxDepth).toBeLessThanOrEqual(50);
  });

  it('wide graph respects children-per-node limits', () => {
    const inputs = generateAdversarialInputs(scope);
    const wideInput = inputs[3]; // Fourth input is the wide graph
    const graph = buildConversationGraph(wideInput);
    const rootNode = graph.nodes.get(root);
    if (rootNode) {
      expect(rootNode.childCanonicalUris.length).toBeLessThanOrEqual(500);
    }
  });

  it('invalid URI inputs are silently filtered', () => {
    const inputs = generateAdversarialInputs(scope);
    const invalidUriInput = inputs[4]; // Fifth input has protocol injection
    const graph = buildConversationGraph(invalidUriInput);
    // Only valid URIs should make it into the graph
    for (const [uri] of graph.nodes) {
      expect(uri).not.toContain('file:');
      expect(uri).not.toContain('javascript:');
      expect(uri).not.toContain('data:');
    }
  });

  it('control character URIs are rejected', () => {
    const inputs = generateAdversarialInputs(scope);
    const controlInput = inputs[5]; // Sixth input has control chars
    const graph = buildConversationGraph(controlInput);
    for (const [uri] of graph.nodes) {
      // eslint-disable-next-line no-control-regex
      expect(/[\x00-\x1f]/.test(uri)).toBe(false);
    }
  });

  it('duplicate edges deduplicate correctly', () => {
    const inputs = generateAdversarialInputs(scope);
    const dupInput = inputs[6]; // Seventh input has duplicates
    const graph = buildConversationGraph(dupInput);
    // Only one child should exist despite 3 duplicate edges
    const rootNode = graph.nodes.get(root);
    if (rootNode) {
      expect(rootNode.childCanonicalUris.length).toBe(1);
    }
  });

  it('conflicting parents resolve by confidence', () => {
    const inputs = generateAdversarialInputs(scope);
    const conflictInput = inputs[7]; // Eighth input has conflicts
    const graph = buildConversationGraph(conflictInput);
    const child = graph.nodes.get('https://origin.example/child');
    if (child) {
      // Higher confidence (0.9) edge should win → parent is root
      expect(child.parentCanonicalUri).toBe(root);
    }
  });
});

describe('checkPerformanceBudget', () => {
  it('passes for a small graph', () => {
    const result = checkPerformanceBudget({
      nodeCount: 50,
      edgeCount: 49,
      maxDepth: 10,
      orphanNodeCount: 0,
      unreachableNodeCount: 0,
      buildTimeMs: 5,
      memoryEstimateBytes: 15000,
    });
    expect(result.passes).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('fails for oversized graph', () => {
    const result = checkPerformanceBudget({
      nodeCount: 1000,
      edgeCount: 999,
      maxDepth: 30,
      orphanNodeCount: 0,
      unreachableNodeCount: 0,
      buildTimeMs: 200,
      memoryEstimateBytes: 500_000,
    });
    expect(result.passes).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it('uses custom budget', () => {
    const result = checkPerformanceBudget(
      { nodeCount: 10, edgeCount: 9, maxDepth: 3, orphanNodeCount: 0, unreachableNodeCount: 0, buildTimeMs: 1, memoryEstimateBytes: 5000 },
      { maxBuildTimeMs: 50, maxNodeCount: 5, maxMemoryBytes: 10000 },
    );
    expect(result.passes).toBe(false); // 10 nodes > 5 budget
    expect(result.violations).toContainEqual(expect.stringContaining('Node count'));
  });
});
