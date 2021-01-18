import { defineMessages } from 'react-intl';
import { openModal } from 'soapbox/actions/modal';
import { deactivateUsers, deleteUsers } from 'soapbox/actions/admin';
import snackbar from 'soapbox/actions/snackbar';

const messages = defineMessages({
  deactivateUserPrompt: { id: 'confirmations.admin.deactivate_user.message', defaultMessage: 'You are about to deactivate {acct}. Deactivating a user is a reversible action.' },
  deactivateUserConfirm: { id: 'confirmations.admin.deactivate_user.confirm', defaultMessage: 'Deactivate {acct}' },
  userDeactivated: { id: 'admin.reports.user_deactivated_message', defaultMessage: '{acct} was deactivated' },
  deleteUserPrompt: { id: 'confirmations.admin.delete_user.message', defaultMessage: 'You are about to delete {acct}. THIS IS A DESTRUCTIVE ACTION THAT CANNOT BE UNDONE.' },
  deleteUserConfirm: { id: 'confirmations.admin.delete_user.confirm', defaultMessage: 'Delete {acct}' },
  userDeleted: { id: 'admin.reports.user_deleted_message', defaultMessage: '{acct} was deleted' },
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
