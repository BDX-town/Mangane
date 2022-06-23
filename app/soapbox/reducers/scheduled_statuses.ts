import { List as ImmutableList, Map as ImmutableMap, Record as ImmutableRecord, fromJS } from 'immutable';

import { STATUS_IMPORT, STATUSES_IMPORT } from 'soapbox/actions/importer';
import {
  SCHEDULED_STATUSES_FETCH_SUCCESS,
  SCHEDULED_STATUS_CANCEL_REQUEST,
  SCHEDULED_STATUS_CANCEL_SUCCESS,
} from 'soapbox/actions/scheduled_statuses';
import { STATUS_CREATE_SUCCESS } from 'soapbox/actions/statuses';

import type { AnyAction } from 'redux';
import type { StatusVisibility } from 'soapbox/normalizers/status';
import type { APIEntity } from 'soapbox/types/entities';

const ScheduledStatusRecord = ImmutableRecord({
  id: '',
  scheduled_at: new Date(),
  media_attachments: null as ImmutableList<ImmutableMap<string, any>> | null,
  text: '',
  in_reply_to_id: null as string | null,
  media_ids: null as ImmutableList<string> | null,
  sensitive: false,
  spoiler_text: '',
  visibility: 'public' as StatusVisibility,
  poll: null as ImmutableMap<string, any> | null,
});

export type ScheduledStatus = ReturnType<typeof ScheduledStatusRecord>;
type State = ImmutableMap<string, ScheduledStatus>;

const initialState: State = ImmutableMap();

const importStatus = (state: State, { params, ...status }: APIEntity) => {
  if (!status.scheduled_at) return state;
  return state.set(status.id, ScheduledStatusRecord(ImmutableMap(fromJS({ ...status, ...params }))));
};

const importStatuses = (state: State, statuses: APIEntity[]) =>
  state.withMutations(mutable => statuses.forEach(status => importStatus(mutable, status)));

const deleteStatus = (state: State, id: string) => state.delete(id);

export default function scheduled_statuses(state: State = initialState, action: AnyAction) {
  switch (action.type) {
    case STATUS_IMPORT:
    case STATUS_CREATE_SUCCESS:
      return importStatus(state, action.status);
    case STATUSES_IMPORT:
    case SCHEDULED_STATUSES_FETCH_SUCCESS:
      return importStatuses(state, action.statuses);
    case SCHEDULED_STATUS_CANCEL_REQUEST:
    case SCHEDULED_STATUS_CANCEL_SUCCESS:
      return deleteStatus(state, action.id);
    default:
      return state;
  }
}
