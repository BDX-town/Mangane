/**
 * Announcement normalizer:
 * Converts API announcements into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/announcement/}
 */
import {
  Map as ImmutableMap,
  List as ImmutableList,
  Record as ImmutableRecord,
  fromJS,
} from 'immutable';

import emojify from 'soapbox/features/emoji/emoji';
import { normalizeEmoji } from 'soapbox/normalizers/emoji';
import { makeEmojiMap } from 'soapbox/utils/normalizers';

import { normalizeAnnouncementReaction } from './announcement_reaction';
import { normalizeMention } from './mention';

import type {  AnnouncementReaction, Emoji, Mention } from 'soapbox/types/entities';

// https://docs.joinmastodon.org/entities/announcement/
export const AnnouncementRecord = ImmutableRecord({
  id: '',
  content: '',
  starts_at: null as Date | null,
  ends_at: null as Date | null,
  all_day: false,
  read: false,
  published_at: Date,
  reactions: ImmutableList<AnnouncementReaction>(),
  statuses: ImmutableMap<string, string>(),
  mentions: ImmutableList<Mention>(),
  tags: ImmutableList<ImmutableMap<string, any>>(),
  emojis: ImmutableList<Emoji>(),
  updated_at: Date,

  // Internal fields
  contentHtml: '',
});

const normalizeMentions = (announcement: ImmutableMap<string, any>) => {
  return announcement.update('mentions', ImmutableList(), mentions => {
    return mentions.map(normalizeMention);
  });
};

// Normalize reactions
const normalizeReactions = (announcement: ImmutableMap<string, any>) => {
  return announcement.update('reactions', ImmutableList(), reactions => {
    return reactions.map((reaction: ImmutableMap<string, any>) => normalizeAnnouncementReaction(reaction, announcement.get('id')));
  });
};

// Normalize emojis
const normalizeEmojis = (announcement: ImmutableMap<string, any>) => {
  return announcement.update('emojis', ImmutableList(), emojis => {
    return emojis.map(normalizeEmoji);
  });
};

const normalizeContent = (announcement: ImmutableMap<string, any>) => {
  const emojiMap   = makeEmojiMap(announcement.get('emojis'));
  const contentHtml = emojify(announcement.get('content'), emojiMap);

  return announcement.set('contentHtml', contentHtml);
};

const normalizeStatuses = (announcement: ImmutableMap<string, any>) => {
  const statuses = announcement
    .get('statuses', ImmutableList())
    .reduce((acc: ImmutableMap<string, string>, curr: ImmutableMap<string, any>) => acc.set(curr.get('url'), `/@${curr.getIn(['account', 'acct'])}/${curr.get('id')}`), ImmutableMap());

  return announcement.set('statuses', statuses);
};

export const normalizeAnnouncement = (announcement: Record<string, any>) => {
  return AnnouncementRecord(
    ImmutableMap(fromJS(announcement)).withMutations(announcement => {
      normalizeMentions(announcement);
      normalizeReactions(announcement);
      normalizeEmojis(announcement);
      normalizeContent(announcement);
      normalizeStatuses(announcement);
    }),
  );
};
