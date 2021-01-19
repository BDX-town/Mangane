import { defineMessages } from 'react-intl';
import { openModal } from 'soapbox/actions/modal';
import { deactivateUsers, deleteUsers, deleteStatus } from 'soapbox/actions/admin';
import snackbar from 'soapbox/actions/snackbar';

const messages = defineMessages({
  deactivateUserPrompt: { id: 'confirmations.admin.deactivate_user.message', defaultMessage: 'You are about to deactivate @{acct}. Deactivating a user is a reversible action.' },
  deactivateUserConfirm: { id: 'confirmations.admin.deactivate_user.confirm', defaultMessage: 'Deactivate @{name}' },
  userDeactivated: { id: 'admin.users.user_deactivated_message', defaultMessage: '@{acct} was deactivated' },
  deleteUserPrompt: { id: 'confirmations.admin.delete_user.message', defaultMessage: 'You are about to delete @{acct}. THIS IS A DESTRUCTIVE ACTION THAT CANNOT BE UNDONE.' },
  deleteUserConfirm: { id: 'confirmations.admin.delete_user.confirm', defaultMessage: 'Delete @{name}' },
  userDeleted: { id: 'admin.users.user_deleted_message', defaultMessage: '@{acct} was deleted' },
  deleteStatusPrompt: { id: 'confirmations.admin.delete_status.message', defaultMessage: 'You are about to delete a post by @{acct}. This action cannot be undone.' },
  deleteStatusConfirm: { id: 'confirmations.admin.delete_status.confirm', defaultMessage: 'Delete post' },
  statusDeleted: { id: 'admin.statuses.status_deleted_message', defaultMessage: 'Post by @{acct} was deleted' },
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
        dispatch(deactivateUsers([acct])).then(() => {
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

    dispatch(openModal('CONFIRM', {
      message: intl.formatMessage(messages.deleteUserPrompt, { acct }),
      confirm: intl.formatMessage(messages.deleteUserConfirm, { name }),
      onConfirm: () => {
        dispatch(deleteUsers([acct])).then(() => {
          const message = intl.formatMessage(messages.userDeleted, { acct });
          dispatch(snackbar.success(message));
          afterConfirm();
        }).catch(() => {});
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
