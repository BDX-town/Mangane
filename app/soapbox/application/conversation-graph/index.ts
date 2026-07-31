/**
 * Phase 9 — Conversation graph module.
 */

// Types
export type {
  ConversationCompleteness,
  ConversationNodeKind,
  ConversationModerationState,
  EdgeSource,
  ReplyEdgeObservation,
  StatusAliasRef,
  ConversationGraphNode,
  ConversationGraphDiagnostics,
  ConversationGraph,
  ConversationViewMode,
  ConversationViewState,
  BranchSummary,
  ConversationGraphLimits,
} from './conversation-types';
export { DEFAULT_GRAPH_LIMITS, CONVERSATION_FLAGS } from './conversation-types';

// Graph builder
export { buildConversationGraph } from './graph-builder';
export type { GraphBuildInput, NodeMetadataInput } from './graph-builder';
