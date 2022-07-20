/**
 * Announcement reaction normalizer:
 * Converts API announcement emoji reactions into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/announcementreaction/}
 */
import { Map as ImmutableMap, Record as ImmutableRecord, fromJS } from 'immutable';

// https://docs.joinmastodon.org/entities/announcement/
export const AnnouncementReactionRecord = ImmutableRecord({
  name: '',
  count: 0,
  me: false,
  url: null as string | null,
  static_url: null as string | null,
  announcement_id: '',
});

export const normalizeAnnouncementReaction = (announcementReaction: Record<string, any>, announcementId?: string) => {
  return AnnouncementReactionRecord(ImmutableMap(fromJS(announcementReaction)).withMutations(reaction => {
    reaction.set('announcement_id', announcementId as any);
  }));
};
