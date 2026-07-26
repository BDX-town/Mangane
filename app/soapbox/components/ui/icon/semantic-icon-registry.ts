import {
  ArrowBendUpLeftIcon,
  ArrowsLeftRightIcon,
  ArticleIcon,
  BellIcon,
  BinocularsIcon,
  BookmarkSimpleIcon,
  BrainIcon,
  ChatCenteredTextIcon,
  CheckIcon,
  CircleIcon,
  CompassIcon,
  FunnelIcon,
  HashIcon,
  HeartIcon,
  HouseIcon,
  Icon,
  IconProps,
  IconWeight,
  IdentificationCardIcon,
  MagnifyingGlassIcon,
  NotePencilIcon,
  QuestionIcon,
  RepeatIcon,
  ShareNetworkIcon,
  UserCircleIcon,
} from '@phosphor-icons/react';

const semanticIconNames = [
  'home',
  'explore',
  'compose',
  'notifications',
  'profile',
  'search',
  'hybrid-search',
  'gist',
  'topic',
  'entity',
  'context',
  'semantic-filter',
  'interpolator',
  'local-intelligence',
  'why-this-result',
  'reply',
  'repost',
  'like',
  'bookmark',
  'share',
  'success',
  'pending',
  'question',
] as const;

type SemanticIconName = typeof semanticIconNames[number];

const semanticIconRegistry: Readonly<Record<SemanticIconName, Icon>> = Object.freeze({
  home: HouseIcon,
  explore: CompassIcon,
  compose: NotePencilIcon,
  notifications: BellIcon,
  profile: UserCircleIcon,
  search: MagnifyingGlassIcon,
  'hybrid-search': BinocularsIcon,
  gist: ArticleIcon,
  topic: HashIcon,
  entity: IdentificationCardIcon,
  context: ChatCenteredTextIcon,
  'semantic-filter': FunnelIcon,
  interpolator: ArrowsLeftRightIcon,
  'local-intelligence': BrainIcon,
  'why-this-result': QuestionIcon,
  reply: ArrowBendUpLeftIcon,
  repost: RepeatIcon,
  like: HeartIcon,
  bookmark: BookmarkSimpleIcon,
  share: ShareNetworkIcon,
  success: CheckIcon,
  pending: CircleIcon,
  question: QuestionIcon,
});

/** Returns whether an untrusted value is an own key in the static registry. */
const isSemanticIconName = (value: unknown): value is SemanticIconName => (
  typeof value === 'string'
  && Object.prototype.hasOwnProperty.call(semanticIconRegistry, value)
);

/** Resolves dynamic configuration to a bounded local semantic name. */
const coerceSemanticIconName = (
  value: unknown,
  fallback: SemanticIconName = 'question',
): SemanticIconName => {
  const safeFallback = isSemanticIconName(fallback) ? fallback : 'question';
  return isSemanticIconName(value) ? value : safeFallback;
};

/** Returns the statically imported component for a validated semantic name. */
const getSemanticIcon = (name: SemanticIconName): Icon => semanticIconRegistry[name];

export {
  coerceSemanticIconName,
  getSemanticIcon,
  isSemanticIconName,
  semanticIconNames,
  semanticIconRegistry,
};

export type { SemanticIconName };
export type { IconProps, IconWeight };
