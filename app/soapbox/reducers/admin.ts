import {
  Map as ImmutableMap,
  List as ImmutableList,
  Set as ImmutableSet,
  Record as ImmutableRecord,
  OrderedSet as ImmutableOrderedSet,
  fromJS,
  is,
} from 'immutable';

import {
  ADMIN_CONFIG_FETCH_SUCCESS,
  ADMIN_CONFIG_UPDATE_SUCCESS,
  ADMIN_REPORTS_FETCH_SUCCESS,
  ADMIN_REPORTS_PATCH_REQUEST,
  ADMIN_REPORTS_PATCH_SUCCESS,
  ADMIN_USERS_FETCH_SUCCESS,
  ADMIN_USERS_DELETE_REQUEST,
  ADMIN_USERS_DELETE_SUCCESS,
  ADMIN_USERS_APPROVE_REQUEST,
  ADMIN_USERS_APPROVE_SUCCESS,
} from '../actions/admin';

import type { AnyAction } from 'redux';
import type { Config } from 'soapbox/utils/config_db';

const ReducerRecord = ImmutableRecord({
  reports: ImmutableMap<string, any>(),
  openReports: ImmutableOrderedSet<string>(),
  users: ImmutableMap<string, any>(),
  latestUsers: ImmutableOrderedSet<string>(),
  awaitingApproval: ImmutableOrderedSet<string>(),
  configs: ImmutableList<Config>(),
  needsReboot: false,
});

type State = ReturnType<typeof ReducerRecord>;

// Umm... based?
// https://itnext.io/typescript-extract-unpack-a-type-from-a-generic-baca7af14e51
type InnerRecord<R> = R extends ImmutableRecord<infer TProps> ? TProps : never;

type InnerState = InnerRecord<State>;

// Lol https://javascript.plainenglish.io/typescript-essentials-conditionally-filter-types-488705bfbf56
type FilterConditionally<Source, Condition> = Pick<Source, {[K in keyof Source]: Source[K] extends Condition ? K : never}[keyof Source]>;

type SetKeys = keyof FilterConditionally<InnerState, ImmutableOrderedSet<string>>;

type APIReport = { id: string, state: string, statuses: any[] };
type APIUser = { id: string, email: string, nickname: string, registration_reason: string };

type Filter = 'local' | 'need_approval' | 'active';

const FILTER_UNAPPROVED: Filter[] = ['local', 'need_approval'];
const FILTER_LATEST: Filter[]     = ['local', 'active'];

const filtersMatch = (f1: string[], f2: string[]) => is(ImmutableSet(f1), ImmutableSet(f2));
const toIds = (items: any[]) => items.map(item => item.id);

const mergeSet = (state: State, key: SetKeys, users: APIUser[]): State => {
  const newIds = toIds(users);
  return state.update(key, (ids: ImmutableOrderedSet<string>) => ids.union(newIds));
};

const replaceSet = (state: State, key: SetKeys, users: APIUser[]): State => {
  const newIds = toIds(users);
  return state.set(key, ImmutableOrderedSet(newIds));
};

const maybeImportUnapproved = (state: State, users: APIUser[], filters: Filter[]): State => {
  if (filtersMatch(FILTER_UNAPPROVED, filters)) {
    return mergeSet(state, 'awaitingApproval', users);
  } else {
    return state;
  }
};

const maybeImportLatest = (state: State, users: APIUser[], filters: Filter[], page: number): State => {
  if (page === 1 && filtersMatch(FILTER_LATEST, filters)) {
    return replaceSet(state, 'latestUsers', users);
  } else {
    return state;
  }
};

const importUser = (state: State, user: APIUser): State => (
  state.setIn(['users', user.id], ImmutableMap({
    email: user.email,
    registration_reason: user.registration_reason,
  }))
);

function importUsers(state: State, users: APIUser[], filters: Filter[], page: number): State {
  return state.withMutations(state => {
    maybeImportUnapproved(state, users, filters);
    maybeImportLatest(state, users, filters, page);

    users.forEach(user => {
      importUser(state, user);
    });
  });
}

function deleteUsers(state: State, accountIds: string[]): State {
  return state.withMutations(state => {
    accountIds.forEach(id => {
      state.update('awaitingApproval', orderedSet => orderedSet.delete(id));
      state.deleteIn(['users', id]);
    });
  });
}

function approveUsers(state: State, users: APIUser[]): State {
  return state.withMutations(state => {
    users.forEach(user => {
      state.update('awaitingApproval', orderedSet => orderedSet.delete(user.nickname));
      state.setIn(['users', user.nickname], fromJS(user));
    });
  });
}

function importReports(state: State, reports: APIReport[]): State {
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

function handleReportDiffs(state: State, reports: APIReport[]) {
  // Note: the reports here aren't full report objects
  // hence the need for a new function.
  return state.withMutations(state => {
    reports.forEach(report => {
      switch (report.state) {
        case 'open':
          state.update('openReports', orderedSet => orderedSet.add(report.id));
          break;
        default:
          state.update('openReports', orderedSet => orderedSet.delete(report.id));
      }
    });
  });
}

const normalizeConfig = (config: any): Config => ImmutableMap(fromJS(config));

const normalizeConfigs = (configs: any): ImmutableList<Config> => {
  return ImmutableList(fromJS(configs)).map(normalizeConfig);
};

const importConfigs = (state: State, configs: any): State => {
  return state.set('configs', normalizeConfigs(configs));
};

export default function admin(state: State = ReducerRecord(), action: AnyAction): State {
  switch (action.type) {
    case ADMIN_CONFIG_FETCH_SUCCESS:
    case ADMIN_CONFIG_UPDATE_SUCCESS:
      return importConfigs(state, action.configs);
    case ADMIN_REPORTS_FETCH_SUCCESS:
      return importReports(state, action.reports);
    case ADMIN_REPORTS_PATCH_REQUEST:
    case ADMIN_REPORTS_PATCH_SUCCESS:
      return handleReportDiffs(state, action.reports);
    case ADMIN_USERS_FETCH_SUCCESS:
      return importUsers(state, action.users, action.filters, action.page);
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
}
