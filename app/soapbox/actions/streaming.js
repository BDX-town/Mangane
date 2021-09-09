import { connectStream } from '../stream';
import {
  deleteFromTimelines,
  expandHomeTimeline,
  connectTimeline,
  disconnectTimeline,
  processTimelineUpdate,
} from './timelines';
import { updateNotificationsQueue, expandNotifications } from './notifications';
import { updateConversations } from './conversations';
import { fetchFilters } from './filters';
import { getSettings } from 'soapbox/actions/settings';
import messages from 'soapbox/locales/messages';

export const STREAMING_CHAT_UPDATE = 'STREAMING_CHAT_UPDATE';
export const STREAMING_FOLLOW_RELATIONSHIPS_UPDATE = 'STREAMING_FOLLOW_RELATIONSHIPS_UPDATE';

const validLocale = locale => Object.keys(messages).includes(locale);

const getLocale = state => {
  const locale = getSettings(state).get('locale');
  return validLocale(locale) ? locale : 'en';
};

function updateFollowRelationships(relationships) {
  return (dispatch, getState) => {
    const me = getState().get('me');
    return dispatch({
      type: STREAMING_FOLLOW_RELATIONSHIPS_UPDATE,
      me,
      ...relationships,
    });
  };
}

export function connectTimelineStream(timelineId, path, pollingRefresh = null, accept = null) {

  return connectStream (path, pollingRefresh, (dispatch, getState) => {
    const locale = getLocale(getState());

    return {
      onConnect() {
        dispatch(connectTimeline(timelineId));
      },

      onDisconnect() {
        dispatch(disconnectTimeline(timelineId));
      },

      onReceive(data) {
        switch(data.event) {
        case 'update':
          dispatch(processTimelineUpdate(timelineId, JSON.parse(data.payload), accept));
          break;
        case 'delete':
          dispatch(deleteFromTimelines(data.payload));
          break;
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
          dispatch((dispatch, getState) => {
            const chat = JSON.parse(data.payload);
            const me = getState().get('me');
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
        }
      },
    };
  });
}

const refreshHomeTimelineAndNotification = (dispatch, done) => {
  dispatch(expandHomeTimeline({}, () => dispatch(expandNotifications({}, done))));
};

export const connectUserStream      = () => connectTimelineStream('home', 'user', refreshHomeTimelineAndNotification);
export const connectCommunityStream = ({ onlyMedia } = {}) => connectTimelineStream(`community${onlyMedia ? ':media' : ''}`, `public:local${onlyMedia ? ':media' : ''}`);
export const connectPublicStream    = ({ onlyMedia } = {}) => connectTimelineStream(`public${onlyMedia ? ':media' : ''}`, `public${onlyMedia ? ':media' : ''}`);
export const connectRemoteStream    = (instance, { onlyMedia } = {}) => connectTimelineStream(`remote${onlyMedia ? ':media' : ''}:${instance}`, `public:remote${onlyMedia ? ':media' : ''}&instance=${instance}`);
export const connectHashtagStream   = (id, tag, accept) => connectTimelineStream(`hashtag:${id}`, `hashtag&tag=${tag}`, null, accept);
export const connectDirectStream    = () => connectTimelineStream('direct', 'direct');
export const connectListStream      = id => connectTimelineStream(`list:${id}`, `list&list=${id}`);
export const connectGroupStream     = id => connectTimelineStream(`group:${id}`, `group&group=${id}`);
