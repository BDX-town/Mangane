import { List as ImmutableList, Map as ImmutableMap, Record as ImmutableRecord, fromJS } from 'immutable';

import {
  STATUS_CREATE_REQUEST,
  STATUS_CREATE_SUCCESS,
} from 'soapbox/actions/statuses';

import type { AnyAction } from 'redux';
import type { StatusVisibility } from 'soapbox/normalizers/status';

const PendingStatusRecord = ImmutableRecord({
  content_type: '',
  in_reply_to_id: null as string | null,
  media_ids: null as ImmutableList<string> | null,
  quote_id: null as string | null,
  poll: null as ImmutableMap<string, any> | null,
  sensitive: false,
  spoiler_text: '',
  status: '',
  to: null as ImmutableList<string> | null,
  visibility: 'public' as StatusVisibility,
});

export type PendingStatus = ReturnType<typeof PendingStatusRecord>;
type State = ImmutableMap<string, PendingStatus>;

const initialState: State = ImmutableMap();

const importStatus = (state: State, params: ImmutableMap<string, any>, idempotencyKey: string) => {
  return state.set(idempotencyKey, PendingStatusRecord(params));
};

const deleteStatus = (state: State, idempotencyKey: string) => state.delete(idempotencyKey);

export default function pending_statuses(state = initialState, action: AnyAction) {
  switch (action.type) {
    case STATUS_CREATE_REQUEST:
      return importStatus(state, ImmutableMap(fromJS(action.params)), action.idempotencyKey);
    case STATUS_CREATE_SUCCESS:
      return deleteStatus(state, action.idempotencyKey);
    default:
      return state;
  }
}
