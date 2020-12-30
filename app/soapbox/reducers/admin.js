import {
  ADMIN_REPORTS_FETCH_SUCCESS,
  ADMIN_USERS_FETCH_SUCCESS,
  ADMIN_USERS_DELETE_REQUEST,
  ADMIN_USERS_DELETE_SUCCESS,
  ADMIN_USERS_APPROVE_REQUEST,
  ADMIN_USERS_APPROVE_SUCCESS,
} from '../actions/admin';
import {
  Map as ImmutableMap,
  List as ImmutableList,
  OrderedSet as ImmutableOrderedSet,
  fromJS,
} from 'immutable';

const initialState = ImmutableMap({
  reports: ImmutableList(),
  users: ImmutableMap(),
  open_report_count: 0,
  awaitingApproval: ImmutableOrderedSet(),
});

function importUsers(state, users) {
  return state.withMutations(state => {
    users.forEach(user => {
      if (user.approval_pending) {
        state.update('awaitingApproval', orderedSet => orderedSet.add(user.nickname));
      }
      state.setIn(['users', user.nickname], fromJS(user));
    });
  });
}

function deleteUsers(state, nicknames) {
  return state.withMutations(state => {
    nicknames.forEach(nickname => {
      state.update('awaitingApproval', orderedSet => orderedSet.delete(nickname));
      state.deleteIn(['users', nickname]);
    });
  });
}

function approveUsers(state, users) {
  return state.withMutations(state => {
    users.forEach(user => {
      state.update('awaitingApproval', orderedSet => orderedSet.delete(user.nickname));
      state.setIn(['users', user.nickname], fromJS(user));
    });
  });
}

export default function admin(state = initialState, action) {
  switch(action.type) {
  case ADMIN_REPORTS_FETCH_SUCCESS:
    if (action.params && action.params.state === 'open') {
      return state
        .set('reports', fromJS(action.data.reports))
        .set('open_report_count', action.data.total);
    } else {
      return state.set('reports', fromJS(action.data.reports));
    }
  case ADMIN_USERS_FETCH_SUCCESS:
    return importUsers(state, action.data.users);
  case ADMIN_USERS_DELETE_REQUEST:
  case ADMIN_USERS_DELETE_SUCCESS:
    return deleteUsers(state, action.nicknames);
  case ADMIN_USERS_APPROVE_REQUEST:
  case ADMIN_USERS_APPROVE_SUCCESS:
    return approveUsers(state, action.users);
  default:
    return state;
  }
};
