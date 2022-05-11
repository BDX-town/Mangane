import {
  Map as ImmutableMap,
  List as ImmutableList,
  Record as ImmutableRecord,
  fromJS,
} from 'immutable';

import {
  PATRON_INSTANCE_FETCH_SUCCESS,
  PATRON_ACCOUNT_FETCH_SUCCESS,
} from '../actions/patron';

import type { AnyAction } from 'redux';

const PatronAccountRecord = ImmutableRecord({
  is_patron: false,
  url: '',
});

const PatronInstanceRecord = ImmutableRecord({
  funding: ImmutableMap(),
  goals: ImmutableList(),
  url: '',
});

const ReducerRecord = ImmutableRecord({
  instance: PatronInstanceRecord() as PatronInstance,
  accounts: ImmutableMap<string, PatronAccount>(),
});

type State = ReturnType<typeof ReducerRecord>;

export type PatronAccount = ReturnType<typeof PatronAccountRecord>;
export type PatronInstance = ReturnType<typeof PatronInstanceRecord>;

const normalizePatronAccount = (state: State, account: Record<string, any>) => {
  const normalized = PatronAccountRecord(account);
  return state.setIn(['accounts', normalized.url], normalized);
};

export default function patron(state = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case PATRON_INSTANCE_FETCH_SUCCESS:
      return state.set('instance', PatronInstanceRecord(ImmutableMap(fromJS(action.instance))));
    case PATRON_ACCOUNT_FETCH_SUCCESS:
      return normalizePatronAccount(state, action.account);
    default:
      return state;
  }
}
