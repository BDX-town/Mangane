// Detect backend features to conditionally render elements
import gte from 'semver/functions/gte';
import { List as ImmutableList, Map as ImmutableMap } from 'immutable';
import { createSelector } from 'reselect';

export const getFeatures = createSelector([
  instance => parseVersion(instance.get('version')),
  instance => instance.getIn(['pleroma', 'metadata', 'features'], ImmutableList()),
  instance => instance.getIn(['pleroma', 'metadata', 'federation'], ImmutableMap()),
], (v, features, federation) => {
  return {
    suggestions: v.software === 'Mastodon' && gte(v.compatVersion, '2.4.3'),
    trends: v.software === 'Mastodon' && gte(v.compatVersion, '3.0.0'),
    emojiReacts: v.software === 'Pleroma' && gte(v.version, '2.0.0'),
    emojiReactsRGI: v.software === 'Pleroma' && gte(v.version, '2.2.49'),
    attachmentLimit: v.software === 'Pleroma' ? Infinity : 4,
    focalPoint: v.software === 'Mastodon' && gte(v.compatVersion, '2.3.0'),
    importMutes: v.software === 'Pleroma' && gte(v.version, '2.2.0'),
    emailList: features.includes('email_list'),
    chats: v.software === 'Pleroma' && gte(v.version, '2.1.0'),
    scopes: v.software === 'Pleroma' ? 'read write follow push admin' : 'read write follow push',
    federating: federation.get('enabled', true), // Assume true unless explicitly false
    richText: v.software === 'Pleroma',
    securityAPI: v.software === 'Pleroma',
    settingsStore: v.software === 'Pleroma',
    accountAliasesAPI: v.software === 'Pleroma',
    resetPasswordAPI: v.software === 'Pleroma',
    exposableReactions: features.includes('exposable_reactions'),
    accountSubscriptions: v.software === 'Pleroma' && gte(v.version, '1.0.0'),
    unrestrictedLists: v.software === 'Pleroma',
  };
});

export const parseVersion = version => {
  const regex = /^([\w\.]*)(?: \(compatible; ([\w]*) (.*)\))?$/;
  const match = regex.exec(version);
  return {
    software: match[2] || 'Mastodon',
    version: match[3] || match[1],
    compatVersion: match[1],
  };
};
