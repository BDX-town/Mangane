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

import { normalizeEmoji } from 'soapbox/normalizers/emoji';

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
  // statuses,
  mentions: ImmutableList<Mention>(),
  tags: ImmutableList<ImmutableMap<string, any>>(),
  emojis: ImmutableList<Emoji>(),
  updated_at: Date,
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

export const normalizeAnnouncement = (announcement: Record<string, any>) => {
  return AnnouncementRecord(
    ImmutableMap(fromJS(announcement)).withMutations(announcement => {
      normalizeMentions(announcement);
      normalizeReactions(announcement);
      normalizeEmojis(announcement);
    }),
  );
};
