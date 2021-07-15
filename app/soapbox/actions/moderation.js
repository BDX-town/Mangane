import React from 'react';
import { defineMessages } from 'react-intl';
import { openModal } from 'soapbox/actions/modal';
import { deactivateUsers, deleteUsers, deleteStatus, toggleStatusSensitivity } from 'soapbox/actions/admin';
import { fetchAccountByUsername } from 'soapbox/actions/accounts';
import snackbar from 'soapbox/actions/snackbar';
import AccountContainer from 'soapbox/containers/account_container';
import { isLocal } from 'soapbox/utils/accounts';

const messages = defineMessages({
  deactivateUserPrompt: { id: 'confirmations.admin.deactivate_user.message', defaultMessage: 'You are about to deactivate @{acct}. Deactivating a user is a reversible action.' },
  deactivateUserConfirm: { id: 'confirmations.admin.deactivate_user.confirm', defaultMessage: 'Deactivate @{name}' },
  userDeactivated: { id: 'admin.users.user_deactivated_message', defaultMessage: '@{acct} was deactivated' },
  deleteUserPrompt: { id: 'confirmations.admin.delete_user.message', defaultMessage: 'You are about to delete @{acct}. THIS IS A DESTRUCTIVE ACTION THAT CANNOT BE UNDONE.' },
  deleteUserConfirm: { id: 'confirmations.admin.delete_user.confirm', defaultMessage: 'Delete @{name}' },
  deleteLocalUserCheckbox: { id: 'confirmations.admin.delete_local_user.checkbox', defaultMessage: 'I understand that I am about to delete a local user.' },
  userDeleted: { id: 'admin.users.user_deleted_message', defaultMessage: '@{acct} was deleted' },
  deleteStatusPrompt: { id: 'confirmations.admin.delete_status.message', defaultMessage: 'You are about to delete a post by @{acct}. This action cannot be undone.' },
  deleteStatusConfirm: { id: 'confirmations.admin.delete_status.confirm', defaultMessage: 'Delete post' },
  statusDeleted: { id: 'admin.statuses.status_deleted_message', defaultMessage: 'Post by @{acct} was deleted' },
  markStatusSensitivePrompt: { id: 'confirmations.admin.mark_status_sensitive.message', defaultMessage: 'You are about to mark a post by @{acct} sensitive.' },
  markStatusNotSensitivePrompt: { id: 'confirmations.admin.mark_status_not_sensitive.message', defaultMessage: 'You are about to mark a post by @{acct} not sensitive.' },
  markStatusSensitiveConfirm: { id: 'confirmations.admin.mark_status_sensitive.confirm', defaultMessage: 'Mark post sensitive' },
  markStatusNotSensitiveConfirm: { id: 'confirmations.admin.mark_status_not_sensitive.confirm', defaultMessage: 'Mark post not sensitive' },
  statusMarkedSensitive: { id: 'admin.statuses.status_marked_message_sensitive', defaultMessage: 'Post by @{acct} was marked sensitive' },
  statusMarkedNotSensitive: { id: 'admin.statuses.status_marked_message_not_sensitive', defaultMessage: 'Post by @{acct} was marked not sensitive' },
});

export function deactivateUserModal(intl, accountId, afterConfirm = () => {}) {
  return function(dispatch, getState) {
    const state = getState();
    const acct = state.getIn(['accounts', accountId, 'acct']);
    const name = state.getIn(['accounts', accountId, 'username']);

    dispatch(openModal('CONFIRM', {
      message: intl.formatMessage(messages.deactivateUserPrompt, { acct }),
      confirm: intl.formatMessage(messages.deactivateUserConfirm, { name }),
      onConfirm: () => {
        dispatch(deactivateUsers([accountId])).then(() => {
          const message = intl.formatMessage(messages.userDeactivated, { acct });
          dispatch(snackbar.success(message));
          afterConfirm();
        }).catch(() => {});
      },
    }));
  };
}

export function deleteUserModal(intl, accountId, afterConfirm = () => {}) {
  return function(dispatch, getState) {
    const state = getState();
    const acct = state.getIn(['accounts', accountId, 'acct']);
    const name = state.getIn(['accounts', accountId, 'username']);
    const favicon = state.getIn(['accounts', accountId, 'pleroma', 'favicon']);
    const local = isLocal(state.getIn(['accounts', accountId]));

    const message = (<>
      <AccountContainer id={accountId} />
      {intl.formatMessage(messages.deleteUserPrompt, { acct })}
    </>);

    const confirm = (<>
      {favicon &&
        <div className='submit__favicon'>
          <img src={favicon} alt='' />
        </div>}
      {intl.formatMessage(messages.deleteUserConfirm, { name })}
    </>);

    const checkbox = local ? intl.formatMessage(messages.deleteLocalUserCheckbox) : false;

    dispatch(openModal('CONFIRM', {
      message,
      confirm,
      checkbox,
      onConfirm: () => {
        dispatch(deleteUsers([accountId])).then(() => {
          const message = intl.formatMessage(messages.userDeleted, { acct });
          dispatch(fetchAccountByUsername(acct));
          dispatch(snackbar.success(message));
          afterConfirm();
        }).catch(() => {});
      },
    }));
  };
}

export function toggleStatusSensitivityModal(intl, statusId, sensitive, afterConfirm = () => {}) {
  return function(dispatch, getState) {
    const state = getState();
    const accountId = state.getIn(['statuses', statusId, 'account']);
    const acct = state.getIn(['accounts', accountId, 'acct']);

    dispatch(openModal('CONFIRM', {
      message: intl.formatMessage(sensitive === false ? messages.markStatusSensitivePrompt : messages.markStatusNotSensitivePrompt, { acct }),
      confirm: intl.formatMessage(sensitive === false ? messages.markStatusSensitiveConfirm : messages.markStatusNotSensitiveConfirm),
      onConfirm: () => {
        dispatch(toggleStatusSensitivity(statusId, sensitive)).then(() => {
          const message = intl.formatMessage(sensitive === false ? messages.statusMarkedSensitive : messages.statusMarkedNotSensitive, { acct });
          dispatch(snackbar.success(message));
        }).catch(() => {});
        afterConfirm();
      },
    }));
  };
}

export function deleteStatusModal(intl, statusId, afterConfirm = () => {}) {
  return function(dispatch, getState) {
    const state = getState();
    const accountId = state.getIn(['statuses', statusId, 'account']);
    const acct = state.getIn(['accounts', accountId, 'acct']);

    dispatch(openModal('CONFIRM', {
      message: intl.formatMessage(messages.deleteStatusPrompt, { acct }),
      confirm: intl.formatMessage(messages.deleteStatusConfirm),
      onConfirm: () => {
        dispatch(deleteStatus(statusId)).then(() => {
          const message = intl.formatMessage(messages.statusDeleted, { acct });
          dispatch(snackbar.success(message));
        }).catch(() => {});
        afterConfirm();
      },
    }));
  };
}
