import {
  ADMIN_CONFIG_FETCH_SUCCESS,
  ADMIN_REPORTS_FETCH_SUCCESS,
  ADMIN_REPORTS_PATCH_REQUEST,
  ADMIN_REPORTS_PATCH_SUCCESS,
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
import { normalizePleromaUserFields } from 'soapbox/utils/pleroma';

const initialState = ImmutableMap({
  reports: ImmutableMap(),
  openReports: ImmutableOrderedSet(),
  users: ImmutableMap(),
  awaitingApproval: ImmutableOrderedSet(),
  configs: ImmutableList(),
  needsReboot: false,
});

function importUsers(state, users) {
  return state.withMutations(state => {
    users.forEach(user => {
      user = normalizePleromaUserFields(user);
      if (!user.is_approved) {
        state.update('awaitingApproval', orderedSet => orderedSet.add(user.id));
      }
      state.setIn(['users', user.id], ImmutableMap({
        email: user.email,
        registration_reason: user.registration_reason,
      }));
    });
  });
}

function deleteUsers(state, accountIds) {
  return state.withMutations(state => {
    accountIds.forEach(id => {
      state.update('awaitingApproval', orderedSet => orderedSet.delete(id));
      state.deleteIn(['users', id]);
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

function importReports(state, reports) {
  return state.withMutations(state => {
    reports.forEach(report => {
      report.statuses = report.statuses.map(status => status.id);
      if (report.state === 'open') {
        state.update('openReports', orderedSet => orderedSet.add(report.id));
      }
      state.setIn(['reports', report.id], fromJS(report));
    });
  });
}

function handleReportDiffs(state, reports) {
  // Note: the reports here aren't full report objects
  // hence the need for a new function.
  return state.withMutations(state => {
    reports.forEach(report => {
      switch(report.state) {
      case 'open':
        state.update('openReports', orderedSet => orderedSet.add(report.id));
        break;
      default:
        state.update('openReports', orderedSet => orderedSet.delete(report.id));
      }
    });
  });
}

export default function admin(state = initialState, action) {
  switch(action.type) {
  case ADMIN_CONFIG_FETCH_SUCCESS:
    return state.set('configs', fromJS(action.configs));
  case ADMIN_REPORTS_FETCH_SUCCESS:
    return importReports(state, action.reports);
  case ADMIN_REPORTS_PATCH_REQUEST:
  case ADMIN_REPORTS_PATCH_SUCCESS:
    return handleReportDiffs(state, action.reports);
  case ADMIN_USERS_FETCH_SUCCESS:
    return importUsers(state, action.users);
  case ADMIN_USERS_DELETE_REQUEST:
  case ADMIN_USERS_DELETE_SUCCESS:
    return deleteUsers(state, action.accountIds);
  case ADMIN_USERS_APPROVE_REQUEST:
    return state.update('awaitingApproval', set => set.subtract(action.accountIds));
  case ADMIN_USERS_APPROVE_SUCCESS:
    return approveUsers(state, action.users);
  default:
    return state;
  }
};
