import { defineMessages } from 'react-intl';
import { openModal } from 'soapbox/actions/modal';
import { deactivateUsers, deleteUsers, deleteStatus, toggleStatusSensitivity } from 'soapbox/actions/admin';
import snackbar from 'soapbox/actions/snackbar';

const messages = defineMessages({
  deactivateUserPrompt: { id: 'confirmations.admin.deactivate_user.message', defaultMessage: 'You are about to deactivate {acct}. Deactivating a user is a reversible action.' },
  deactivateUserConfirm: { id: 'confirmations.admin.deactivate_user.confirm', defaultMessage: 'Deactivate {acct}' },
  userDeactivated: { id: 'admin.users.user_deactivated_message', defaultMessage: '{acct} was deactivated' },
  deleteUserPrompt: { id: 'confirmations.admin.delete_user.message', defaultMessage: 'You are about to delete {acct}. THIS IS A DESTRUCTIVE ACTION THAT CANNOT BE UNDONE.' },
  deleteUserConfirm: { id: 'confirmations.admin.delete_user.confirm', defaultMessage: 'Delete {acct}' },
  userDeleted: { id: 'admin.users.user_deleted_message', defaultMessage: '{acct} was deleted' },
  deleteStatusPrompt: { id: 'confirmations.admin.delete_status.message', defaultMessage: 'You are about to delete a post by {acct}. This action cannot be undone.' },
  deleteStatusConfirm: { id: 'confirmations.admin.delete_status.confirm', defaultMessage: 'Delete post' },
  statusDeleted: { id: 'admin.statuses.status_deleted_message', defaultMessage: 'Post by {acct} was deleted' },
  markStatusSensitivePrompt: { id: 'confirmations.admin.mark_status_sensitive.message', defaultMessage: 'You are about to mark a post by {acct} sensitive.' },
  markStatusNotSensitivePrompt: { id: 'confirmations.admin.mark_status_not_sensitive.message', defaultMessage: 'You are about to mark a post by {acct} not sensitive.' },
  markStatusSensitiveConfirm: { id: 'confirmations.admin.mark_status_sensitive.confirm', defaultMessage: 'Mark post sensitive' },
  markStatusNotSensitiveConfirm: { id: 'confirmations.admin.mark_status_not_sensitive.confirm', defaultMessage: 'Mark post not sensitive' },
  statusMarkedSensitive: { id: 'admin.statuses.status_marked_message_sensitive', defaultMessage: 'Post by {acct} was marked sensitive' },
  statusMarkedNotSensitive: { id: 'admin.statuses.status_marked_message_not_sensitive', defaultMessage: 'Post by {acct} was marked not sensitive' },
});

export function deactivateUserModal(intl, accountId, afterConfirm = () => {}) {
  return function(dispatch, getState) {
    const state = getState();
    const acct = state.getIn(['accounts', accountId, 'acct']);
    dispatch(openModal('CONFIRM', {
      message: intl.formatMessage(messages.deactivateUserPrompt, { acct: `@${acct}` }),
      confirm: intl.formatMessage(messages.deactivateUserConfirm, { acct: `@${acct}` }),
      onConfirm: () => {
        dispatch(deactivateUsers([acct])).then(() => {
          const message = intl.formatMessage(messages.userDeactivated, { acct: `@${acct}` });
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
    dispatch(openModal('CONFIRM', {
      message: intl.formatMessage(messages.deleteUserPrompt, { acct: `@${acct}` }),
      confirm: intl.formatMessage(messages.deleteUserConfirm, { acct: `@${acct}` }),
      onConfirm: () => {
        dispatch(deleteUsers([acct])).then(() => {
          const message = intl.formatMessage(messages.userDeleted, { acct: `@${acct}` });
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
      message: intl.formatMessage(sensitive === false ? messages.markStatusSensitivePrompt : messages.markStatusNotSensitivePrompt, { acct: `@${acct}` }),
      confirm: intl.formatMessage(sensitive === false ? messages.markStatusSensitiveConfirm : messages.markStatusNotSensitiveConfirm),
      onConfirm: () => {
        dispatch(toggleStatusSensitivity(statusId, sensitive)).then(() => {
          const message = intl.formatMessage(sensitive === false ? messages.statusMarkedSensitive : messages.statusMarkedNotSensitive, { acct: `@${acct}` });
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
      message: intl.formatMessage(messages.deleteStatusPrompt, { acct: `@${acct}` }),
      confirm: intl.formatMessage(messages.deleteStatusConfirm),
      onConfirm: () => {
        dispatch(deleteStatus(statusId)).then(() => {
          const message = intl.formatMessage(messages.statusDeleted, { acct: `@${acct}` });
          dispatch(snackbar.success(message));
        }).catch(() => {});
        afterConfirm();
      },
    }));
  };
}
