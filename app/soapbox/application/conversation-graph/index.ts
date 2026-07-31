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

// Graph builder (9.1)
export { buildConversationGraph } from './graph-builder';
export type { GraphBuildInput, NodeMetadataInput } from './graph-builder';

// Coordinator (9.2)
export { loadConversation, advanceGeneration, isGenerationCurrent } from './conversation-coordinator';
export type {
  ConversationQueryState,
  ConversationQueryResult,
  ConversationQueryError,
  ConversationQueryParams,
  ConversationQueryDeps,
  ContextFetchResult,
} from './conversation-coordinator';

// Projections (9.3 + 9.4)
export { buildStructuralProjection, buildChronologicalProjection } from './conversation-projections';
export type {
  StructuralProjection,
  ProjectedNode,
  ProjectedBranch,
  ChronologicalItem,
} from './conversation-projections';

// Reading state (9.6)
export {
  saveConversationState,
  loadConversationState,
  removeConversationState,
  purgeAllConversationStates,
  purgeAllConversationStatesGlobal,
} from './conversation-reading-state';
