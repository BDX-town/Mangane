import { combineReducers } from 'redux-immutable';
import dropdown_menu from './dropdown_menu';
import timelines from './timelines';
import meta from './meta';
import alerts from './alerts';
import { loadingBarReducer } from 'react-redux-loading-bar';
import modal from './modal';
import user_lists from './user_lists';
import domain_lists from './domain_lists';
import accounts from './accounts';
import accounts_counters from './accounts_counters';
import statuses from './statuses';
import relationships from './relationships';
import settings from './settings';
import push_notifications from './push_notifications';
import status_lists from './status_lists';
import mutes from './mutes';
import reports from './reports';
import contexts from './contexts';
import compose from './compose';
import search from './search';
import media_attachments from './media_attachments';
import notifications from './notifications';
import height_cache from './height_cache';
import custom_emojis from './custom_emojis';
import lists from './lists';
import listEditor from './list_editor';
import listAdder from './list_adder';
import filters from './filters';
import conversations from './conversations';
import suggestions from './suggestions';
import polls from './polls';
import identity_proofs from './identity_proofs';
import trends from './trends';
import groups from './groups';
import group_relationships from './group_relationships';
import group_lists from './group_lists';
import group_editor from './group_editor';
import sidebar from './sidebar';
import patron from './patron';
import soapbox from './soapbox';
import instance from './instance';
import me from './me';
import auth from './auth';
import admin from './admin';
import chats from './chats';
import chat_messages from './chat_messages';
import chat_message_lists from './chat_message_lists';

const reducers = {
  dropdown_menu,
  timelines,
  meta,
  alerts,
  loadingBar: loadingBarReducer,
  modal,
  user_lists,
  domain_lists,
  status_lists,
  accounts,
  accounts_counters,
  statuses,
  relationships,
  settings,
  push_notifications,
  mutes,
  reports,
  contexts,
  compose,
  search,
  media_attachments,
  notifications,
  height_cache,
  custom_emojis,
  identity_proofs,
  lists,
  listEditor,
  listAdder,
  filters,
  conversations,
  suggestions,
  polls,
  trends,
  groups,
  group_relationships,
  group_lists,
  group_editor,
  sidebar,
  patron,
  soapbox,
  instance,
  me,
  auth,
  admin,
  chats,
  chat_messages,
  chat_message_lists,
};

export default combineReducers(reducers);
