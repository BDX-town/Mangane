import React from 'react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { blockAccount } from 'soapbox/actions/accounts';
import { showAlertForError } from 'soapbox/actions/alerts';
import { launchChat } from 'soapbox/actions/chats';
import {
  replyCompose,
  mentionCompose,
  directCompose,
} from 'soapbox/actions/compose';
import {
  reblog,
  favourite,
  unreblog,
  unfavourite,
  bookmark,
  unbookmark,
  pin,
  unpin,
} from 'soapbox/actions/interactions';
import { openModal } from 'soapbox/actions/modals';
import { deactivateUserModal, deleteUserModal, deleteStatusModal, toggleStatusSensitivityModal } from 'soapbox/actions/moderation';
import { initMuteModal } from 'soapbox/actions/mutes';
import { initReport } from 'soapbox/actions/reports';
import { getSettings } from 'soapbox/actions/settings';
import {
  muteStatus,
  unmuteStatus,
  deleteStatus,
  hideStatus,
  revealStatus,
  editStatus,
} from 'soapbox/actions/statuses';
import { makeGetStatus } from 'soapbox/selectors';

import DetailedStatus from '../components/detailed-status';

const messages = defineMessages({
  deleteConfirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
  deleteHeading: { id: 'confirmations.delete.heading', defaultMessage: 'Delete post' },
  deleteMessage: { id: 'confirmations.delete.message', defaultMessage: 'Are you sure you want to delete this post?' },
  redraftConfirm: { id: 'confirmations.redraft.confirm', defaultMessage: 'Delete & redraft' },
  redraftHeading: { id: 'confirmations.redraft.heading', defaultMessage: 'Delete & redraft' },
  redraftMessage: { id: 'confirmations.redraft.message', defaultMessage: 'Are you sure you want to delete this post and re-draft it? Favorites and reposts will be lost, and replies to the original post will be orphaned.' },
  blockConfirm: { id: 'confirmations.block.confirm', defaultMessage: 'Block' },
  replyConfirm: { id: 'confirmations.reply.confirm', defaultMessage: 'Reply' },
  replyMessage: { id: 'confirmations.reply.message', defaultMessage: 'Replying now will overwrite the message you are currently composing. Are you sure you want to proceed?' },
  blockAndReport: { id: 'confirmations.block.block_and_report', defaultMessage: 'Block & Report' },
});

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = (state, props) => ({
    status: getStatus(state, props),
    domain: state.getIn(['meta', 'domain']),
  });

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, { intl }) => ({

  onReply(status, router) {
    dispatch((_, getState) => {
      const state = getState();
      if (state.getIn(['compose', 'text']).trim().length !== 0) {
        dispatch(openModal('CONFIRM', {
          message: intl.formatMessage(messages.replyMessage),
          confirm: intl.formatMessage(messages.replyConfirm),
          onConfirm: () => dispatch(replyCompose(status, router)),
        }));
      } else {
        dispatch(replyCompose(status, router));
      }
    });
  },

  onModalReblog(status) {
    dispatch(reblog(status));
  },

  onReblog(status, e) {
    dispatch((_, getState) => {
      const boostModal = getSettings(getState()).get('boostModal');
      if (status.get('reblogged')) {
        dispatch(unreblog(status));
      } else {
        if (e.shiftKey || !boostModal) {
          this.onModalReblog(status);
        } else {
          dispatch(openModal('BOOST', { status, onReblog: this.onModalReblog }));
        }
      }
    });
  },

  onBookmark(status) {
    if (status.get('bookmarked')) {
      dispatch(unbookmark(status));
    } else {
      dispatch(bookmark(status));
    }
  },

  onFavourite(status) {
    if (status.get('favourited')) {
      dispatch(unfavourite(status));
    } else {
      dispatch(favourite(status));
    }
  },

  onPin(status) {
    if (status.get('pinned')) {
      dispatch(unpin(status));
    } else {
      dispatch(pin(status));
    }
  },

  onEmbed(status) {
    dispatch(openModal('EMBED', {
      url: status.get('url'),
      onError: error => dispatch(showAlertForError(error)),
    }));
  },

  onDelete(status, history, withRedraft = false) {
    dispatch((_, getState) => {
      const deleteModal = getSettings(getState()).get('deleteModal');
      if (!deleteModal) {
        dispatch(deleteStatus(status.get('id'), history, withRedraft));
      } else {
        dispatch(openModal('CONFIRM', {
          icon: withRedraft ? require('@tabler/icons/icons/edit.svg') : require('@tabler/icons/icons/trash.svg'),
          heading: intl.formatMessage(withRedraft ? messages.redraftHeading : messages.deleteHeading),
          message: intl.formatMessage(withRedraft ? messages.redraftMessage : messages.deleteMessage),
          confirm: intl.formatMessage(withRedraft ? messages.redraftConfirm : messages.deleteConfirm),
          onConfirm: () => dispatch(deleteStatus(status.get('id'), history, withRedraft)),
        }));
      }
    });
  },

  onEdit(status) {
    dispatch(editStatus(status.get('id')));
  },

  onDirect(account, router) {
    dispatch(directCompose(account, router));
  },

  onChat(account, router) {
    dispatch(launchChat(account.get('id'), router));
  },

  onMention(account, router) {
    dispatch(mentionCompose(account, router));
  },

  onOpenMedia(media, index) {
    dispatch(openModal('MEDIA', { media, index }));
  },

  onOpenVideo(media, time) {
    dispatch(openModal('VIDEO', { media, time }));
  },

  onBlock(status) {
    const account = status.get('account');
    dispatch(openModal('CONFIRM', {
      icon: require('@tabler/icons/icons/ban.svg'),
      heading: <FormattedMessage id='confirmations.block.heading' defaultMessage='Block @{name}' values={{ name: account.get('acct') }} />,
      message: <FormattedMessage id='confirmations.block.message' defaultMessage='Are you sure you want to block {name}?' values={{ name: <strong>@{account.get('acct')}</strong> }} />,
      confirm: intl.formatMessage(messages.blockConfirm),
      onConfirm: () => dispatch(blockAccount(account.get('id'))),
      secondary: intl.formatMessage(messages.blockAndReport),
      onSecondary: () => {
        dispatch(blockAccount(account.get('id')));
        dispatch(initReport(account, status));
      },
    }));
  },

  onReport(status) {
    dispatch(initReport(status.get('account'), status));
  },

  onMute(account) {
    dispatch(initMuteModal(account));
  },

  onMuteConversation(status) {
    if (status.get('muted')) {
      dispatch(unmuteStatus(status.get('id')));
    } else {
      dispatch(muteStatus(status.get('id')));
    }
  },

  onToggleHidden(status) {
    if (status.get('hidden')) {
      dispatch(revealStatus(status.get('id')));
    } else {
      dispatch(hideStatus(status.get('id')));
    }
  },

  onDeactivateUser(status) {
    dispatch(deactivateUserModal(intl, status.getIn(['account', 'id'])));
  },

  onDeleteUser(status) {
    dispatch(deleteUserModal(intl, status.getIn(['account', 'id'])));
  },

  onToggleStatusSensitivity(status) {
    dispatch(toggleStatusSensitivityModal(intl, status.get('id'), status.get('sensitive')));
  },

  onDeleteStatus(status) {
    dispatch(deleteStatusModal(intl, status.get('id')));
  },

  onOpenCompareHistoryModal(status) {
    dispatch(openModal('COMPARE_HISTORY', {
      statusId: status.get('id'),
    }));
  },

});

export default injectIntl(connect(makeMapStateToProps, mapDispatchToProps)(DetailedStatus));
