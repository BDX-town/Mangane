/* eslint sort-keys: "error" */
import { List as ImmutableList, Map as ImmutableMap } from 'immutable';
import { createSelector } from 'reselect';
import gte from 'semver/functions/gte';
import lt from 'semver/functions/lt';
import semverParse from 'semver/functions/parse';

import { custom } from 'soapbox/custom';

import type { Instance } from 'soapbox/types/entities';

/** Import custom overrides, if exists */
const overrides = custom('features');

/** Truthy array convenience function */
const any = (arr: Array<any>): boolean => arr.some(Boolean);

/**
 * Mastodon, the software upon which this is all based.
 * @see {@link https://joinmastodon.org/}
 */
export const MASTODON = 'Mastodon';

/**
 * Pleroma, a feature-rich alternative written in Elixir.
 * @see {@link https://pleroma.social/}
 */
export const PLEROMA = 'Pleroma';

/**
 * Mitra, a Rust backend with deep Ethereum integrations.
 * @see {@link https://codeberg.org/silverpill/mitra}
 */
export const MITRA = 'Mitra';

/**
 * Pixelfed, a federated image sharing platform.
 * @see {@link https://pixelfed.org/}
 */
export const PIXELFED = 'Pixelfed';

/**
 * Truth Social, the Mastodon fork powering truthsocial.com
 * @see {@link https://help.truthsocial.com/open-source}
 */
export const TRUTHSOCIAL = 'TruthSocial';

/**
 * Soapbox BE, the recommended Pleroma fork for Soapbox.
 * @see {@link https://gitlab.com/soapbox-pub/soapbox-be}
 */
export const SOAPBOX = 'soapbox';

/**
 * glitch-soc, fork of Mastodon with a number of experimental features.
 * @see {@link https://glitch-soc.github.io/docs/}
 */
export const GLITCH = 'glitch';

/** Parse features for the given instance */
const getInstanceFeatures = (instance: Instance) => {
  const v = parseVersion(instance.version);
  const features = instance.pleroma.getIn(['metadata', 'features'], ImmutableList()) as ImmutableList<string>;
  const federation = instance.pleroma.getIn(['metadata', 'federation'], ImmutableMap()) as ImmutableMap<string, any>;

  return {
    /**
     * Can view and manage ActivityPub aliases through the API.
     * @see GET /api/pleroma/aliases
     * @see PATCH /api/v1/accounts/update_credentials
     */
    accountAliasesAPI: v.software === PLEROMA,

    /**
     * The accounts API allows an acct instead of an ID.
     * @see GET /api/v1/accounts/:acct_or_id
     */
    accountByUsername: v.software === PLEROMA,

    /**
     * Ability to create accounts.
     * @see POST /api/v1/accounts
     */
    accountCreation: any([
      v.software === MASTODON,
      v.software === PLEROMA,
    ]),

    /**
     * Ability to pin other accounts on one's profile.
     * @see POST /api/v1/accounts/:id/pin
     * @see POST /api/v1/accounts/:id/unpin
     * @see GET /api/v1/pleroma/accounts/:id/endorsements
     */
    accountEndorsements: v.software === PLEROMA && gte(v.version, '2.4.50'),

    /**
     * Ability to set one's location on their profile.
     * @see PATCH /api/v1/accounts/update_credentials
     */
    accountLocation: any([
      v.software === PLEROMA && v.build === SOAPBOX && gte(v.version, '2.4.50'),
      v.software === TRUTHSOCIAL,
    ]),

    /**
     * Look up an account by the acct.
     * @see GET /api/v1/accounts/lookup
     */
    accountLookup: any([
      v.software === MASTODON && gte(v.compatVersion, '3.4.0'),
      v.software === PLEROMA && gte(v.version, '2.4.50'),
      v.software === TRUTHSOCIAL,
    ]),

    /**
     * Move followers to a different ActivityPub account.
     * @see POST /api/pleroma/move_account
     */
    accountMoving: v.software === PLEROMA && v.build === SOAPBOX && gte(v.version, '2.4.50'),

    /**
     * Ability to subscribe to notifications every time an account posts.
     * @see POST /api/v1/accounts/:id/follow
     */
    accountNotifies: any([
      v.software === MASTODON && gte(v.compatVersion, '3.3.0'),
      v.software === PLEROMA && gte(v.version, '2.4.50'),
    ]),

    /**
     * Ability to subscribe to notifications every time an account posts.
     * @see POST /api/v1/pleroma/accounts/:id/subscribe
     * @see POST /api/v1/pleroma/accounts/:id/unsubscribe
     */
    accountSubscriptions: v.software === PLEROMA && gte(v.version, '1.0.0'),

    /**
     * Ability to set one's website on their profile.
     * @see PATCH /api/v1/accounts/update_credentials
     */
    accountWebsite: v.software === TRUTHSOCIAL,

    /**
     * Set your birthday and view upcoming birthdays.
     * @see GET /api/v1/pleroma/birthdays
     * @see POST /api/v1/accounts
     * @see PATCH /api/v1/accounts/update_credentials
     */
    birthdays: v.software === PLEROMA && gte(v.version, '2.4.50'),

    /** Whether people who blocked you are visible through the API. */
    blockersVisible: features.includes('blockers_visible'),

    /**
     * Can bookmark statuses.
     * @see POST /api/v1/statuses/:id/bookmark
     * @see GET /api/v1/bookmarks
     */
    bookmarks: any([
      v.software === MASTODON && gte(v.compatVersion, '3.1.0'),
      v.software === PLEROMA && gte(v.version, '0.9.9'),
      v.software === PIXELFED,
    ]),

    /**
     * Accounts can be marked as bots.
     * @see PATCH /api/v1/accounts/update_credentials
     */
    bots: any([
      v.software === MASTODON,
      v.software === PLEROMA,
    ]),

    /**
     * Pleroma chats API.
     * @see {@link https://docs.pleroma.social/backend/development/API/chats/}
     */
    chats: v.software === PLEROMA && gte(v.version, '2.1.0'),

    /**
     * Paginated chats API.
     * @see GET /api/v2/chats
     */
    chatsV2: v.software === PLEROMA && gte(v.version, '2.3.0'),

    /**
     * Mastodon's newer solution for direct messaging.
     * @see {@link https://docs.joinmastodon.org/methods/timelines/conversations/}
     */
    conversations: any([
      v.software === MASTODON && gte(v.compatVersion, '2.6.0'),
      v.software === PLEROMA && gte(v.version, '0.9.9'),
      v.software === PIXELFED,
    ]),

    /**
     * Legacy DMs timeline where messages are displayed chronologically without groupings.
     * @see GET /api/v1/timelines/direct
     */
    directTimeline: any([
      v.software === MASTODON && lt(v.compatVersion, '3.0.0'),
      v.software === PLEROMA && gte(v.version, '0.9.9'),
    ]),

    editStatuses: v.software === MASTODON && gte(v.version, '3.5.0'),

    /**
     * Soapbox email list.
     * @see POST /api/v1/accounts
     * @see PATCH /api/v1/accounts/update_credentials
     * @see GET /api/v1/pleroma/admin/email_list/subscribers.csv
     * @see GET /api/v1/pleroma/admin/email_list/unsubscribers.csv
     * @see GET /api/v1/pleroma/admin/email_list/combined.csv
     */
    emailList: features.includes('email_list'),

    /**
     * Ability to embed posts on external sites.
     * @see GET /api/oembed
     */
    embeds: v.software === MASTODON,

    /**
     * Ability to add emoji reactions to a status.
     * @see PUT /api/v1/pleroma/statuses/:id/reactions/:emoji
     * @see GET /api/v1/pleroma/statuses/:id/reactions/:emoji?
     * @see DELETE /api/v1/pleroma/statuses/:id/reactions/:emoji
     */
    emojiReacts: v.software === PLEROMA && gte(v.version, '2.0.0'),

    /**
     * The backend allows only RGI ("Recommended for General Interchange") emoji reactions.
     * @see PUT /api/v1/pleroma/statuses/:id/reactions/:emoji
     */
    emojiReactsRGI: v.software === PLEROMA && gte(v.version, '2.2.49'),

    /**
     * Sign in with an Ethereum wallet.
     * @see POST /oauth/token
     */
    ethereumLogin: v.software === MITRA,

    /**
     * Ability to address recipients of a status explicitly (with `to`).
     * @see POST /api/v1/statuses
     */
    explicitAddressing: any([
      v.software === PLEROMA && gte(v.version, '1.0.0'),
      v.software === TRUTHSOCIAL,
    ]),

    /** Whether the accounts who favourited or emoji-reacted to a status can be viewed through the API. */
    exposableReactions: any([
      v.software === MASTODON,
      features.includes('exposable_reactions'),
    ]),

    /** Whether the instance federates. */
    federating: federation.get('enabled', true) === true, // Assume true unless explicitly false

    /**
     * Can edit and manage timeline filters (aka "muted words").
     * @see {@link https://docs.joinmastodon.org/methods/accounts/filters/}
     */
    filters: v.software !== TRUTHSOCIAL,

    /**
     * Allows setting the focal point of a media attachment.
     * @see {@link https://docs.joinmastodon.org/methods/statuses/media/}
     */
    focalPoint: v.software === MASTODON && gte(v.compatVersion, '2.3.0'),

    /**
     * Ability to lock accounts and manually approve followers.
     * @see PATCH /api/v1/accounts/update_credentials
     */
    followRequests: any([
      v.software === MASTODON,
      v.software === PLEROMA,
    ]),

    /**
     * Whether client settings can be retrieved from the API.
     * @see GET /api/pleroma/frontend_configurations
     */
    frontendConfigurations: v.software === PLEROMA,

    /**
     * Can hide follows/followers lists and counts.
     * @see PATCH /api/v1/accounts/update_credentials
     */
    hideNetwork: v.software === PLEROMA,

    /**
     * Pleroma import API.
     * @see POST /api/pleroma/follow_import
     * @see POST /api/pleroma/blocks_import
     * @see POST /api/pleroma/mutes_import
     */
    importAPI: v.software === PLEROMA,

    /**
     * Pleroma import mutes API.
     * @see POST /api/pleroma/mutes_import
     */
    importMutes: v.software === PLEROMA && gte(v.version, '2.2.0'),

    /**
     * Can create, view, and manage lists.
     * @see {@link https://docs.joinmastodon.org/methods/timelines/lists/}
     * @see GET /api/v1/timelines/list/:list_id
     */
    lists: any([
      v.software === MASTODON && gte(v.compatVersion, '2.1.0'),
      v.software === PLEROMA && gte(v.version, '0.9.9'),
    ]),

    /**
     * Can upload media attachments to statuses.
     * @see POST /api/v1/media
     * @see POST /api/v1/statuses
     */
    media: true,

    /**
     * Supports V2 media uploads.
     * @see POST /api/v2/media
     */
    mediaV2: any([
      v.software === MASTODON && gte(v.compatVersion, '3.1.3'),
      // Even though Pleroma supports these endpoints, it has disadvantages
      // v.software === PLEROMA && gte(v.version, '2.1.0'),
    ]),

    /**
     * Ability to hide notifications from people you don't follow.
     * @see PUT /api/pleroma/notification_settings
     */
    muteStrangers: v.software === PLEROMA,

    /**
     * Add private notes to accounts.
     * @see POST /api/v1/accounts/:id/note
     * @see GET /api/v1/accounts/relationships
     */
    notes: any([
      v.software === MASTODON && gte(v.compatVersion, '3.2.0'),
      v.software === PLEROMA && gte(v.version, '2.4.50'),
    ]),

    /**
     * Supports pagination in threads.
     * @see GET /api/v1/statuses/:id/context/ancestors
     * @see GET /api/v1/statuses/:id/context/descendants
     */
    paginatedContext: v.software === TRUTHSOCIAL,

    /**
     * Can add polls to statuses.
     * @see POST /api/v1/statuses
     */
    polls: any([
      v.software === MASTODON && gte(v.version, '2.8.0'),
      v.software === PLEROMA,
    ]),

    /**
     * Can set privacy scopes on statuses.
     * @see POST /api/v1/statuses
     */
    privacyScopes: v.software !== TRUTHSOCIAL,

    /**
     * A directory of discoverable profiles from the instance.
     * @see {@link https://docs.joinmastodon.org/methods/instance/directory/}
     */
    profileDirectory: any([
      v.software === MASTODON && gte(v.compatVersion, '3.0.0'),
      features.includes('profile_directory'),
    ]),

    /**
     * Ability to set custom profile fields.
     * @see PATCH /api/v1/accounts/update_credentials
     */
    profileFields: any([
      v.software === MASTODON,
      v.software === PLEROMA,
    ]),

    /**
     * Can display a timeline of all known public statuses.
     * Local and Fediverse timelines both use this feature.
     * @see GET /api/v1/timelines/public
     */
    publicTimeline: any([
      v.software === MASTODON,
      v.software === PLEROMA,
    ]),

    /**
     * Ability to quote posts in statuses.
     * @see POST /api/v1/statuses
     */
    quotePosts: any([
      v.software === PLEROMA && v.build === SOAPBOX && gte(v.version, '2.4.50'),
      instance.feature_quote === true,
    ]),

    /**
     * Interact with statuses from another instance while logged-out.
     * @see POST /api/v1/pleroma/remote_interaction
     */
    remoteInteractionsAPI: v.software === PLEROMA && gte(v.version, '2.4.50'),

    reportMultipleStatuses: any([
      v.software === MASTODON,
      v.software === PLEROMA,
    ]),

    /**
     * Can request a password reset email through the API.
     * @see POST /auth/password
     */
    resetPasswordAPI: v.software === PLEROMA,

    /**
     * Ability to post statuses in Markdown, BBCode, and HTML.
     * @see POST /api/v1/statuses
     */
    richText: any([
      v.software === MASTODON && v.build === GLITCH,
      v.software === PLEROMA,
    ]),

    /**
     * Can schedule statuses to be posted at a later time.
     * @see POST /api/v1/statuses
     * @see {@link https://docs.joinmastodon.org/methods/statuses/scheduled_statuses/}
     */
    scheduledStatuses: any([
      v.software === MASTODON && gte(v.version, '2.7.0'),
      v.software === PLEROMA,
    ]),

    /**
     * List of OAuth scopes supported by both Soapbox and the backend.
     * @see POST /api/v1/apps
     * @see POST /oauth/token
     */
    scopes: v.software === PLEROMA ? 'read write follow push admin' : 'read write follow push',

    /**
     * Ability to manage account security settings.
     * @see POST /api/pleroma/change_password
     * @see POST /api/pleroma/change_email
     * @see POST /api/pleroma/delete_account
     */
    securityAPI: any([
      v.software === PLEROMA,
      v.software === TRUTHSOCIAL,
    ]),

    /**
     * Ability to manage account sessions.
     * @see GET /api/oauth_tokens.json
     * @see DELETE /api/oauth_tokens/:id
     */
    sessionsAPI: v.software === PLEROMA,

    /**
     * Can store client settings in the database.
     * @see PATCH /api/v1/accounts/update_credentials
     */
    settingsStore: any([
      v.software === PLEROMA,
      v.software === TRUTHSOCIAL,
    ]),

    /**
     * Can set content warnings on statuses.
     * @see POST /api/v1/statuses
     */
    spoilers: v.software !== TRUTHSOCIAL,

    /**
     * Can display suggested accounts.
     * @see {@link https://docs.joinmastodon.org/methods/accounts/suggestions/}
     */
    suggestions: any([
      v.software === MASTODON && gte(v.compatVersion, '2.4.3'),
      v.software === TRUTHSOCIAL,
      features.includes('v2_suggestions'),
    ]),

    /**
     * Supports V2 suggested accounts.
     * @see GET /api/v2/suggestions
     */
    suggestionsV2: any([
      v.software === MASTODON && gte(v.compatVersion, '3.4.0'),
      v.software === TRUTHSOCIAL,
      features.includes('v2_suggestions'),
    ]),

    /**
     * Trending statuses.
     * @see GET /api/v1/trends/statuses
     */
    trendingStatuses: v.software === MASTODON && gte(v.compatVersion, '3.5.0'),

    /**
     * Truth Social trending statuses API.
     * @see GET /api/v1/truth/trending/truths
     */
    trendingTruths: v.software === TRUTHSOCIAL,

    /**
     * Can display trending hashtags.
     * @see GET /api/v1/trends
     */
    trends: any([
      v.software === MASTODON && gte(v.compatVersion, '3.0.0'),
      v.software === TRUTHSOCIAL,
    ]),

    /**
     * Whether the backend allows adding users you don't follow to lists.
     * @see POST /api/v1/lists/:id/accounts
     */
    unrestrictedLists: v.software === PLEROMA,
  };
};

/** Features available from a backend */
export type Features = ReturnType<typeof getInstanceFeatures>;

/** Detect backend features to conditionally render elements */
export const getFeatures = createSelector([
  (instance: Instance) => instance,
], (instance): Features => {
  const features = getInstanceFeatures(instance);
  return Object.assign(features, overrides) as Features;
});

/** Fediverse backend */
interface Backend {
  /** Build name, if this software is a fork */
  build: string | null,
  /** Name of the software */
  software: string | null,
  /** API version number */
  version: string,
  /** Mastodon API version this backend is compatible with */
  compatVersion: string,
}

/** Get information about the software from its version string */
export const parseVersion = (version: string): Backend => {
  const regex = /^([\w+.]*)(?: \(compatible; ([\w]*) (.*)\))?$/;
  const match = regex.exec(version);

  const semver = match ? semverParse(match[3] || match[1]) : null;
  const compat = match ? semverParse(match[1]) : null;

  if (match && semver && compat) {
    return {
      build: semver.build[0],
      compatVersion: compat.version,
      software: match[2] || MASTODON,
      version: semver.version,
    };
  } else {
    // If we can't parse the version, this is a new and exotic backend.
    // Fall back to minimal featureset.
    return {
      build: null,
      compatVersion: '0.0.0',
      software: null,
      version: '0.0.0',
    };
  }
};
