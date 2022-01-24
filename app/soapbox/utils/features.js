// Detect backend features to conditionally render elements
import { List as ImmutableList, Map as ImmutableMap } from 'immutable';
import { createSelector } from 'reselect';
import gte from 'semver/functions/gte';
import lt from 'semver/functions/lt';

const any = arr => arr.some(Boolean);

// For uglification
export const MASTODON = 'Mastodon';
export const PLEROMA  = 'Pleroma';

export const getFeatures = createSelector([
  instance => parseVersion(instance.get('version')),
  instance => instance.getIn(['pleroma', 'metadata', 'features'], ImmutableList()),
  instance => instance.getIn(['pleroma', 'metadata', 'federation'], ImmutableMap()),
], (v, features, federation) => {
  return {
    bookmarks: any([
      v.software === MASTODON && gte(v.compatVersion, '3.1.0'),
      v.software === PLEROMA && gte(v.version, '0.9.9'),
    ]),
    lists: any([
      v.software === MASTODON && gte(v.compatVersion, '2.1.0'),
      v.software === PLEROMA && gte(v.version, '0.9.9'),
    ]),
    suggestions: any([
      v.software === MASTODON && gte(v.compatVersion, '2.4.3'),
      features.includes('v2_suggestions'),
    ]),
    suggestionsV2: any([
      v.software === MASTODON && gte(v.compatVersion, '3.4.0'),
      features.includes('v2_suggestions'),
    ]),
    blockersVisible: features.includes('blockers_visible'),
    trends: v.software === MASTODON && gte(v.compatVersion, '3.0.0'),
    mediaV2: any([
      v.software === MASTODON && gte(v.compatVersion, '3.1.3'),
      // Even though Pleroma supports these endpoints, it has disadvantages
      // v.software === PLEROMA && gte(v.version, '2.1.0'),
    ]),
    directTimeline: any([
      v.software === MASTODON && lt(v.compatVersion, '3.0.0'),
      v.software === PLEROMA && gte(v.version, '0.9.9'),
    ]),
    conversations: any([
      v.software === MASTODON && gte(v.compatVersion, '2.6.0'),
      v.software === PLEROMA && gte(v.version, '0.9.9'),
    ]),
    emojiReacts: v.software === PLEROMA && gte(v.version, '2.0.0'),
    emojiReactsRGI: v.software === PLEROMA && gte(v.version, '2.2.49'),
    attachmentLimit: v.software === PLEROMA ? Infinity : 4,
    focalPoint: v.software === MASTODON && gte(v.compatVersion, '2.3.0'),
    importAPI: v.software === PLEROMA,
    importMutes: v.software === PLEROMA && gte(v.version, '2.2.0'),
    emailList: features.includes('email_list'),
    chats: v.software === PLEROMA && gte(v.version, '2.1.0'),
    chatsV2: v.software === PLEROMA && gte(v.version, '2.3.0'),
    scopes: v.software === PLEROMA ? 'read write follow push admin' : 'read write follow push',
    federating: federation.get('enabled', true), // Assume true unless explicitly false
    richText: v.software === PLEROMA,
    securityAPI: v.software === PLEROMA,
    settingsStore: v.software === PLEROMA,
    accountAliasesAPI: v.software === PLEROMA,
    resetPasswordAPI: v.software === PLEROMA,
    exposableReactions: features.includes('exposable_reactions'),
    accountSubscriptions: v.software === PLEROMA && gte(v.version, '1.0.0'),
    unrestrictedLists: v.software === PLEROMA,
    accountByUsername: v.software === PLEROMA,
    profileDirectory: any([
      v.software === MASTODON && gte(v.compatVersion, '3.0.0'),
      features.includes('profile_directory'),
    ]),
    accountLookup: any([
      v.software === MASTODON && gte(v.compatVersion, '3.4.0'),
      v.software === PLEROMA && gte(v.version, '2.4.50'),
    ]),
    remoteInteractionsAPI: v.software === PLEROMA && gte(v.version, '2.4.50'),
    explicitAddressing: v.software === PLEROMA && gte(v.version, '1.0.0'),
    accountEndorsements: v.software === PLEROMA && gte(v.version, '2.4.50'),
    quotePosts: v.software === PLEROMA && gte(v.version, '2.4.50'),
    birthDates: v.software === PLEROMA && gte(v.version, '2.4.50'),
  };
});

export const parseVersion = version => {
  const regex = /^([\w\.]*)(?: \(compatible; ([\w]*) (.*)\))?$/;
  const match = regex.exec(version);
  return {
    software: match[2] || MASTODON,
    version: match[3] || match[1],
    compatVersion: match[1],
  };
};
