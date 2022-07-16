import { List as ImmutableList, Record as ImmutableRecord, Set as ImmutableSet } from 'immutable';

import {
  ANNOUNCEMENTS_FETCH_REQUEST,
  ANNOUNCEMENTS_FETCH_SUCCESS,
  ANNOUNCEMENTS_FETCH_FAIL,
  ANNOUNCEMENTS_UPDATE,
  ANNOUNCEMENTS_REACTION_UPDATE,
  ANNOUNCEMENTS_REACTION_ADD_REQUEST,
  ANNOUNCEMENTS_REACTION_ADD_FAIL,
  ANNOUNCEMENTS_REACTION_REMOVE_REQUEST,
  ANNOUNCEMENTS_REACTION_REMOVE_FAIL,
  ANNOUNCEMENTS_TOGGLE_SHOW,
  ANNOUNCEMENTS_DELETE,
  ANNOUNCEMENTS_DISMISS_SUCCESS,
} from 'soapbox/actions/announcements';
import { normalizeAnnouncement, normalizeAnnouncementReaction } from 'soapbox/normalizers';

import type { AnyAction } from 'redux';
import type{ Announcement, AnnouncementReaction, APIEntity } from 'soapbox/types/entities';

const ReducerRecord = ImmutableRecord({
  items: ImmutableList<Announcement>(),
  isLoading: false,
  show: false,
  unread: ImmutableSet<string>(),
});

type State = ReturnType<typeof ReducerRecord>;

const updateReaction = (state: State, id: string, name: string, updater: (a: AnnouncementReaction) => AnnouncementReaction) => state.update('items', list => list.map(announcement => {
  if (announcement.id === id) {
    return announcement.update('reactions', reactions => {
      const idx = reactions.findIndex(reaction => reaction.name === name);

      if (idx > -1) {
        return reactions.update(idx, reaction => updater(reaction!));
      }

      return reactions.push(updater(normalizeAnnouncementReaction({ name, count: 0 })));
    });
  }

  return announcement;
}));

const updateReactionCount = (state: State, reaction: AnnouncementReaction) => updateReaction(state, reaction.announcement_id, reaction.name, x => x.set('count', reaction.count));

const addReaction = (state: State, id: string, name: string) => updateReaction(state, id, name, (x: AnnouncementReaction) => x.set('me', true).update('count', y => y + 1));

const removeReaction = (state: State, id: string, name: string) => updateReaction(state, id, name, (x: AnnouncementReaction) => x.set('me', false).update('count', y => y - 1));

const sortAnnouncements = (list: ImmutableList<Announcement>) => list.sortBy(x => x.starts_at || x.published_at);

const updateAnnouncement = (state: State, announcement: Announcement) => {
  const idx = state.items.findIndex(x => x.id === announcement.id);

  if (idx > -1) {
    // Deep merge is used because announcements from the streaming API do not contain
    // personalized data about which reactions have been selected by the given user,
    // and that is information we want to preserve
    return state.update('items', list => sortAnnouncements(list.update(idx, x => x!.mergeDeep(announcement))));
  }

  return state.update('items', list => sortAnnouncements(list.unshift(announcement)));
};

export default function announcementsReducer(state = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case ANNOUNCEMENTS_TOGGLE_SHOW:
      return state.withMutations(map => {
        map.set('show', !map.show);
      });
    case ANNOUNCEMENTS_FETCH_REQUEST:
      return state.set('isLoading', true);
    case ANNOUNCEMENTS_FETCH_SUCCESS:
      return state.withMutations(map => {
        const items = ImmutableList<Announcement>((action.announcements).map((announcement: APIEntity) => normalizeAnnouncement(announcement)));

        map.set('items', items);
        map.set('isLoading', false);
      });
    case ANNOUNCEMENTS_FETCH_FAIL:
      return state.set('isLoading', false);
    case ANNOUNCEMENTS_UPDATE:
      return updateAnnouncement(state, normalizeAnnouncement(action.announcement));
    case ANNOUNCEMENTS_REACTION_UPDATE:
      return updateReactionCount(state, action.reaction);
    case ANNOUNCEMENTS_REACTION_ADD_REQUEST:
    case ANNOUNCEMENTS_REACTION_REMOVE_FAIL:
      return addReaction(state, action.id, action.name);
    case ANNOUNCEMENTS_REACTION_REMOVE_REQUEST:
    case ANNOUNCEMENTS_REACTION_ADD_FAIL:
      return removeReaction(state, action.id, action.name);
    case ANNOUNCEMENTS_DISMISS_SUCCESS:
      return updateAnnouncement(state, normalizeAnnouncement({ id: action.id, read: true }));
    case ANNOUNCEMENTS_DELETE:
      return state.update('items', list => {
        const idx = list.findIndex(x => x.id === action.id);

        if (idx > -1) {
          return list.delete(idx);
        }

        return list;
      });
    default:
      return state;
  }
}