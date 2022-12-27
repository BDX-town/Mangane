import { getSettings } from 'soapbox/actions/settings';
import messages from 'soapbox/locales/messages';

import { connectStream } from '../stream';

import {
  deleteAnnouncement,
  fetchAnnouncements,
  updateAnnouncements,
  updateReaction as updateAnnouncementsReaction,
} from './announcements';
import { updateConversations } from './conversations';
import { fetchFilters } from './filters';
import { MARKER_FETCH_SUCCESS } from './markers';
import { updateNotificationsQueue, expandNotifications } from './notifications';
import { updateStatus } from './statuses';
import {
  // deleteFromTimelines,
  expandHomeTimeline,
  connectTimeline,
  disconnectTimeline,
  processTimelineUpdate,
} from './timelines';

import type { AppDispatch, RootState } from 'soapbox/store';
import type { APIEntity } from 'soapbox/types/entities';

const STREAMING_CHAT_UPDATE = 'STREAMING_CHAT_UPDATE';
const STREAMING_FOLLOW_RELATIONSHIPS_UPDATE = 'STREAMING_FOLLOW_RELATIONSHIPS_UPDATE';

const validLocale = (locale: string) => Object.keys(messages).includes(locale);

const getLocale = (state: RootState) => {
  const locale = getSettings(state).get('locale') as string;
  return validLocale(locale) ? locale : 'en';
};

const updateFollowRelationships = (relationships: APIEntity) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const me = getState().me;
    return dispatch({
      type: STREAMING_FOLLOW_RELATIONSHIPS_UPDATE,
      me,
      ...relationships,
    });
  };

const connectTimelineStream = (
  timelineId: string,
  path: string,
  pollingRefresh: ((dispatch: AppDispatch, done?: () => void) => void) | null = null,
  accept: ((status: APIEntity) => boolean) | null = null,
) => connectStream(path, pollingRefresh, (dispatch: AppDispatch, getState: () => RootState) => {
  const locale = getLocale(getState());

  return {
    onConnect() {
      dispatch(connectTimeline(timelineId));
    },

    onDisconnect() {
      dispatch(disconnectTimeline(timelineId));
    },

    onReceive(data: any) {
      switch (data.event) {
        case 'update':
          dispatch(processTimelineUpdate(timelineId, JSON.parse(data.payload), accept));
          break;
        case 'status.update':
          dispatch(updateStatus(JSON.parse(data.payload)));
          break;
        // FIXME: We think delete & redraft is causing jumpy timelines.
        // Fix that in ScrollableList then re-enable this!
        //
        // case 'delete':
        //   dispatch(deleteFromTimelines(data.payload));
        //   break;
        case 'notification':
          messages[locale]().then(messages => {
            dispatch(updateNotificationsQueue(JSON.parse(data.payload), messages, locale, window.location.pathname));
          }).catch(error => {
            console.error(error);
          });
          break;
        case 'conversation':
          dispatch(updateConversations(JSON.parse(data.payload)));
          break;
        case 'filters_changed':
          dispatch(fetchFilters());
          break;
        case 'pleroma:chat_update':
          dispatch((dispatch: AppDispatch, getState: () => RootState) => {
            const chat = JSON.parse(data.payload);
            const me = getState().me;
            const messageOwned = !(chat.last_message && chat.last_message.account_id !== me);

            dispatch({
              type: STREAMING_CHAT_UPDATE,
              chat,
              me,
              // Only play sounds for recipient messages
              meta: !messageOwned && getSettings(getState()).getIn(['chats', 'sound']) && { sound: 'chat' },
            });
          });
          break;
        case 'pleroma:follow_relationships_update':
          dispatch(updateFollowRelationships(JSON.parse(data.payload)));
          break;
        case 'announcement':
          dispatch(updateAnnouncements(JSON.parse(data.payload)));
          break;
        case 'announcement.reaction':
          dispatch(updateAnnouncementsReaction(JSON.parse(data.payload)));
          break;
        case 'announcement.delete':
          dispatch(deleteAnnouncement(data.payload));
          break;
        case 'marker':
          dispatch({ type: MARKER_FETCH_SUCCESS, marker: JSON.parse(data.payload) });
          break;
      }
    },
  };
});

const refreshHomeTimelineAndNotification = (dispatch: AppDispatch, done?: () => void) =>
  dispatch(expandHomeTimeline({}, () =>
    dispatch(expandNotifications({}, () =>
      dispatch(fetchAnnouncements(done))))));

const connectUserStream      = () =>
  connectTimelineStream('home', 'user', refreshHomeTimelineAndNotification);

const connectCommunityStream = ({ onlyMedia }: Record<string, any> = {}) =>
  connectTimelineStream(`community${onlyMedia ? ':media' : ''}`, `public:local${onlyMedia ? ':media' : ''}`);

// Bubble stream doesnt exists for now
// const connectBubbleStream = ({ onlyMedia }: Record<string, any> = {}) =>
//   connectTimelineStream(`bubble${onlyMedia ? ':media' : ''}`, `bubble${onlyMedia ? ':media' : ''}`);

const connectPublicStream    = ({ onlyMedia }: Record<string, any> = {}) =>
  connectTimelineStream(`public${onlyMedia ? ':media' : ''}`, `public${onlyMedia ? ':media' : ''}`);

const connectRemoteStream    = (instance: string, { onlyMedia }: Record<string, any> = {}) =>
  connectTimelineStream(`remote${onlyMedia ? ':media' : ''}:${instance}`, `public:remote${onlyMedia ? ':media' : ''}&instance=${instance}`);

const connectHashtagStream   = (id: string, tag: string, accept: (status: APIEntity) => boolean) =>
  connectTimelineStream(`hashtag:${id}`, `hashtag&tag=${tag}`, null, accept);

const connectDirectStream    = () =>
  connectTimelineStream('direct', 'direct');

const connectListStream      = (id: string) =>
  connectTimelineStream(`list:${id}`, `list&list=${id}`);

const connectGroupStream     = (id: string) =>
  connectTimelineStream(`group:${id}`, `group&group=${id}`);

export {
  STREAMING_CHAT_UPDATE,
  STREAMING_FOLLOW_RELATIONSHIPS_UPDATE,
  connectTimelineStream,
  connectUserStream,
  connectCommunityStream,
  connectPublicStream,
  connectRemoteStream,
  connectHashtagStream,
  connectDirectStream,
  connectListStream,
  connectGroupStream,
  // connectBubbleStream,
};
