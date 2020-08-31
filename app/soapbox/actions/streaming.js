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

const validLocale = locale => Object.keys(messages).includes(locale);

const getLocale = state => {
  const locale = getSettings(state).get('locale');
  return validLocale(locale) ? locale : 'en';
};

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
          }).catch(() => {});
          break;
        case 'conversation':
          dispatch(updateConversations(JSON.parse(data.payload)));
          break;
        case 'filters_changed':
          dispatch(fetchFilters());
          break;
        case 'pleroma:chat_update':
          dispatch({ type: STREAMING_CHAT_UPDATE, chat: JSON.parse(data.payload), me: getState().get('me') });
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
export const connectHashtagStream   = (id, tag, accept) => connectTimelineStream(`hashtag:${id}`, `hashtag&tag=${tag}`, null, accept);
export const connectDirectStream    = () => connectTimelineStream('direct', 'direct');
export const connectListStream      = id => connectTimelineStream(`list:${id}`, `list&list=${id}`);
export const connectGroupStream      = id => connectTimelineStream(`group:${id}`, `group&group=${id}`);
