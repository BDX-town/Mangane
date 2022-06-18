import api from '../api';

import { openModal, closeModal } from './modals';

import type { AxiosError } from 'axios';
import type { AnyAction } from 'redux';
import type { RootState } from 'soapbox/store';
import type { Account } from 'soapbox/types/entities';

const ACCOUNT_NOTE_SUBMIT_REQUEST = 'ACCOUNT_NOTE_SUBMIT_REQUEST';
const ACCOUNT_NOTE_SUBMIT_SUCCESS = 'ACCOUNT_NOTE_SUBMIT_SUCCESS';
const ACCOUNT_NOTE_SUBMIT_FAIL = 'ACCOUNT_NOTE_SUBMIT_FAIL';

const ACCOUNT_NOTE_INIT_MODAL = 'ACCOUNT_NOTE_INIT_MODAL';

const ACCOUNT_NOTE_CHANGE_COMMENT = 'ACCOUNT_NOTE_CHANGE_COMMENT';

const submitAccountNote = () => (dispatch: React.Dispatch<AnyAction>, getState: () => RootState) => {
  dispatch(submitAccountNoteRequest());

  const id = getState().account_notes.edit.account;

  return api(getState)
    .post(`/api/v1/accounts/${id}/note`, {
      comment: getState().account_notes.edit.comment,
    })
    .then(response => {
      dispatch(closeModal());
      dispatch(submitAccountNoteSuccess(response.data));
    })
    .catch(error => dispatch(submitAccountNoteFail(error)));
};

function submitAccountNoteRequest() {
  return {
    type: ACCOUNT_NOTE_SUBMIT_REQUEST,
  };
}

function submitAccountNoteSuccess(relationship: any) {
  return {
    type: ACCOUNT_NOTE_SUBMIT_SUCCESS,
    relationship,
  };
}

function submitAccountNoteFail(error: AxiosError) {
  return {
    type: ACCOUNT_NOTE_SUBMIT_FAIL,
    error,
  };
}

const initAccountNoteModal = (account: Account) => (dispatch: React.Dispatch<AnyAction>, getState: () => RootState) => {
  const comment = getState().relationships.get(account.id)!.note;

  dispatch({
    type: ACCOUNT_NOTE_INIT_MODAL,
    account,
    comment,
  });

  dispatch(openModal('ACCOUNT_NOTE'));
};

function changeAccountNoteComment(comment: string) {
  return {
    type: ACCOUNT_NOTE_CHANGE_COMMENT,
    comment,
  };
}

export {
  submitAccountNote,
  initAccountNoteModal,
  changeAccountNoteComment,
  ACCOUNT_NOTE_SUBMIT_REQUEST,
  ACCOUNT_NOTE_SUBMIT_SUCCESS,
  ACCOUNT_NOTE_SUBMIT_FAIL,
  ACCOUNT_NOTE_INIT_MODAL,
  ACCOUNT_NOTE_CHANGE_COMMENT,
};
