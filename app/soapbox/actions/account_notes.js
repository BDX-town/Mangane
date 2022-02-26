import api from '../api';

import { openModal, closeModal } from './modals';

export const ACCOUNT_NOTE_SUBMIT_REQUEST = 'ACCOUNT_NOTE_SUBMIT_REQUEST';
export const ACCOUNT_NOTE_SUBMIT_SUCCESS = 'ACCOUNT_NOTE_SUBMIT_SUCCESS';
export const ACCOUNT_NOTE_SUBMIT_FAIL    = 'ACCOUNT_NOTE_SUBMIT_FAIL';

export const ACCOUNT_NOTE_INIT_MODAL = 'ACCOUNT_NOTE_INIT_MODAL';

export const ACCOUNT_NOTE_CHANGE_COMMENT = 'ACCOUNT_NOTE_CHANGE_COMMENT';

export function submitAccountNote() {
  return (dispatch, getState) => {
    dispatch(submitAccountNoteRequest());

    const id = getState().getIn(['account_notes', 'edit', 'account_id']);

    api(getState).post(`/api/v1/accounts/${id}/note`, {
      comment: getState().getIn(['account_notes', 'edit', 'comment']),
    }).then(response => {
      dispatch(closeModal());
      dispatch(submitAccountNoteSuccess(response.data));
    }).catch(error => dispatch(submitAccountNoteFail(error)));
  };
}

export function submitAccountNoteRequest() {
  return {
    type: ACCOUNT_NOTE_SUBMIT_REQUEST,
  };
}

export function submitAccountNoteSuccess(relationship) {
  return {
    type: ACCOUNT_NOTE_SUBMIT_SUCCESS,
    relationship,
  };
}

export function submitAccountNoteFail(error) {
  return {
    type: ACCOUNT_NOTE_SUBMIT_FAIL,
    error,
  };
}

export function initAccountNoteModal(account) {
  return (dispatch, getState) => {
    const comment = getState().getIn(['relationships', account.get('id'), 'note']);

    dispatch({
      type: ACCOUNT_NOTE_INIT_MODAL,
      account,
      comment,
    });

    dispatch(openModal('ACCOUNT_NOTE'));
  };
}

export function changeAccountNoteComment(comment) {
  return {
    type: ACCOUNT_NOTE_CHANGE_COMMENT,
    comment,
  };
}