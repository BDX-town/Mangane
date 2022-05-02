import api from '../api';

import { openModal } from './modals';

export const REPORT_INIT   = 'REPORT_INIT';
export const REPORT_CANCEL = 'REPORT_CANCEL';

export const REPORT_SUBMIT_REQUEST = 'REPORT_SUBMIT_REQUEST';
export const REPORT_SUBMIT_SUCCESS = 'REPORT_SUBMIT_SUCCESS';
export const REPORT_SUBMIT_FAIL    = 'REPORT_SUBMIT_FAIL';

export const REPORT_STATUS_TOGGLE  = 'REPORT_STATUS_TOGGLE';
export const REPORT_COMMENT_CHANGE = 'REPORT_COMMENT_CHANGE';
export const REPORT_FORWARD_CHANGE = 'REPORT_FORWARD_CHANGE';
export const REPORT_BLOCK_CHANGE   = 'REPORT_BLOCK_CHANGE';

export const REPORT_RULE_CHANGE    = 'REPORT_RULE_CHANGE';

export function initReport(account, status) {
  return dispatch => {
    dispatch({
      type: REPORT_INIT,
      account,
      status,
    });

    dispatch(openModal('REPORT'));
  };
}

export function initReportById(accountId) {
  return (dispatch, getState) => {
    dispatch({
      type: REPORT_INIT,
      account: getState().getIn(['accounts', accountId]),
    });

    dispatch(openModal('REPORT'));
  };
}

export function cancelReport() {
  return {
    type: REPORT_CANCEL,
  };
}

export function toggleStatusReport(statusId, checked) {
  return {
    type: REPORT_STATUS_TOGGLE,
    statusId,
    checked,
  };
}

export function submitReport() {
  return (dispatch, getState) => {
    dispatch(submitReportRequest());
    const { reports } = getState();

    return api(getState).post('/api/v1/reports', {
      account_id: reports.getIn(['new', 'account_id']),
      status_ids: reports.getIn(['new', 'status_ids']),
      rule_ids: reports.getIn(['new', 'rule_ids']),
      comment: reports.getIn(['new', 'comment']),
      forward: reports.getIn(['new', 'forward']),
    });
  };
}

export function submitReportRequest() {
  return {
    type: REPORT_SUBMIT_REQUEST,
  };
}

export function submitReportSuccess() {
  return {
    type: REPORT_SUBMIT_SUCCESS,
  };
}

export function submitReportFail(error) {
  return {
    type: REPORT_SUBMIT_FAIL,
    error,
  };
}

export function changeReportComment(comment) {
  return {
    type: REPORT_COMMENT_CHANGE,
    comment,
  };
}

export function changeReportForward(forward) {
  return {
    type: REPORT_FORWARD_CHANGE,
    forward,
  };
}

export function changeReportBlock(block) {
  return {
    type: REPORT_BLOCK_CHANGE,
    block,
  };
}

export function changeReportRule(ruleId) {
  return {
    type: REPORT_RULE_CHANGE,
    rule_id: ruleId,
  };
}
