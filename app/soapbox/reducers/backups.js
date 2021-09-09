import {
  BACKUPS_FETCH_SUCCESS,
  BACKUPS_CREATE_SUCCESS,
} from '../actions/backups';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap();

const importBackup = (state, backup) => {
  return state.set(backup.get('inserted_at'), backup);
};

const importBackups = (state, backups) => {
  return state.withMutations(mutable => {
    backups.forEach(backup => importBackup(mutable, backup));
  });
};

export default function backups(state = initialState, action) {
  switch(action.type) {
  case BACKUPS_FETCH_SUCCESS:
  case BACKUPS_CREATE_SUCCESS:
    return importBackups(state, fromJS(action.backups));
  default:
    return state;
  }
}
