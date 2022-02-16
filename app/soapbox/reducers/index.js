import { Map as ImmutableMap } from 'immutable';
import { combineReducers } from 'redux-immutable';

import { AUTH_LOGGED_OUT } from 'soapbox/actions/auth';

import accounts from './accounts';
import accounts_counters from './accounts_counters';
import accounts_meta from './accounts_meta';
import admin from './admin';
import admin_log from './admin_log';
import alerts from './alerts';
import aliases from './aliases';
import auth from './auth';
import backups from './backups';
import chat_message_lists from './chat_message_lists';
import chat_messages from './chat_messages';
import chats from './chats';
import compose from './compose';
import contexts from './contexts';
import conversations from './conversations';
import custom_emojis from './custom_emojis';
import domain_lists from './domain_lists';
import dropdown_menu from './dropdown_menu';
import filters from './filters';
import group_editor from './group_editor';
import group_lists from './group_lists';
import group_relationships from './group_relationships';
import groups from './groups';
import height_cache from './height_cache';
import identity_proofs from './identity_proofs';
import instance from './instance';
import listAdder from './list_adder';
import listEditor from './list_editor';
import lists from './lists';
import me from './me';
import meta from './meta';
import modals from './modals';
import mutes from './mutes';
import notifications from './notifications';
import patron from './patron';
import pending_statuses from './pending_statuses';
import polls from './polls';
import profile_hover_card from './profile_hover_card';
import push_notifications from './push_notifications';
import relationships from './relationships';
import reports from './reports';
import scheduled_statuses from './scheduled_statuses';
import search from './search';
import security from './security';
import settings from './settings';
import sidebar from './sidebar';
import soapbox from './soapbox';
import status_lists from './status_lists';
import statuses from './statuses';
import suggestions from './suggestions';
import timelines from './timelines';
import trends from './trends';
import user_lists from './user_lists';

const appReducer = combineReducers({
  dropdown_menu,
  timelines,
  meta,
  alerts,
  modals,
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
  profile_hover_card,
  backups,
  admin_log,
  security,
  scheduled_statuses,
  pending_statuses,
  aliases,
  accounts_meta,
});

// Clear the state (mostly) when the user logs out
const logOut = (state = ImmutableMap()) => {
  const whitelist = ['instance', 'soapbox', 'custom_emojis', 'auth'];

  return ImmutableMap(
    whitelist.reduce((acc, curr) => {
      acc[curr] = state.get(curr);
      return acc;
    }, {}),
  );
};

const rootReducer = (state, action) => {
  switch(action.type) {
  case AUTH_LOGGED_OUT:
    return appReducer(logOut(state), action);
  default:
    return appReducer(state, action);
  }
};

export default rootReducer;
