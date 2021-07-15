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
export const STREAMING_NOTIFICATION_UPDATE = 'STREAMING_NOTIFICATION_UPDATE';
export const STREAMING_TIMELINE_UPDATE = 'STREAMING_TIMELINE_UPDATE';

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

function updateChat(chat) {
  return (dispatch, getState) => {
    const me = getState().get('me');
    const messageOwned = !(chat.last_message && chat.last_message.account_id !== me);

    dispatch({
      type: STREAMING_CHAT_UPDATE,
      chat,
      me,
      // Only play sounds for recipient messages
      meta: !messageOwned && getSettings(getState()).getIn(['chats', 'sound']) && { sound: 'chat' },
    });
  };
};

function updateNotification(notification) {
  return (dispatch, getState) => {
    const locale = getLocale(getState());

    dispatch({
      type: STREAMING_NOTIFICATION_UPDATE,
      notification,
    });

    messages[locale]().then(messages => {
      dispatch(updateNotificationsQueue(notification, messages, locale, window.location.pathname));
    }).catch(error => {
      console.error(error);
    });
  };
};

function updateTimeline(timelineId, status, accept) {
  return (dispatch, getState) => {
    dispatch({
      type: STREAMING_TIMELINE_UPDATE,
      timelineId,
      status,
    });

    dispatch(processTimelineUpdate(timelineId, status, accept));
  };
};

function handleEvent(timelineId, { event, payload }, accept) {
  return (dispatch, getState) => {
    switch(event) {
    case 'update':
      dispatch(updateTimeline(timelineId, JSON.parse(payload), accept));
      break;
    case 'delete':
      dispatch(deleteFromTimelines(payload));
      break;
    case 'notification':
      dispatch(updateNotification(JSON.parse(payload)));
      break;
    case 'conversation':
      dispatch(updateConversations(JSON.parse(payload)));
      break;
    case 'filters_changed':
      dispatch(fetchFilters());
      break;
    case 'pleroma:chat_update':
      dispatch(updateChat(JSON.parse(payload)));
      break;
    case 'pleroma:follow_relationships_update':
      dispatch(updateFollowRelationships(JSON.parse(payload)));
      break;
    }
  };
};

export function connectTimelineStream(timelineId, path, pollingRefresh = null, accept = null) {

  return connectStream (path, pollingRefresh, (dispatch, getState) => {

    return {
      onConnect() {
        dispatch(connectTimeline(timelineId));
      },

      onDisconnect() {
        dispatch(disconnectTimeline(timelineId));
      },

      onReceive(data) {
        dispatch(handleEvent(timelineId, data, accept));
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
