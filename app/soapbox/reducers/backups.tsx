import { Map as ImmutableMap, Record as ImmutableRecord } from 'immutable';

import {
  BACKUPS_FETCH_SUCCESS,
  BACKUPS_CREATE_SUCCESS,
} from '../actions/backups';

import type { AnyAction } from 'redux';
import type { APIEntity } from 'soapbox/types/entities';

const BackupRecord = ImmutableRecord({
  id: null as number | null,
  content_type: '',
  url: '',
  file_size: null as number | null,
  processed: false,
  inserted_at: '',
});

type Backup = ReturnType<typeof BackupRecord>;
type State = ImmutableMap<string, Backup>;

const initialState: State = ImmutableMap();

const importBackup = (state: State, backup: APIEntity) => {
  return state.set(backup.inserted_at, BackupRecord(backup));
};

const importBackups = (state: State, backups: APIEntity[]) => {
  return state.withMutations(mutable => {
    backups.forEach(backup => importBackup(mutable, backup));
  });
};

export default function backups(state = initialState, action: AnyAction) {
  switch (action.type) {
    case BACKUPS_FETCH_SUCCESS:
    case BACKUPS_CREATE_SUCCESS:
      return importBackups(state, action.backups);
    default:
      return state;
  }
}
