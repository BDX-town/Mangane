import React from 'react';
import { connect } from 'react-redux';
import Status from '../components/status';
import { makeGetStatus } from '../selectors';
import {
  replyCompose,
  mentionCompose,
  directCompose,
} from '../actions/compose';
import {
  reblog,
  favourite,
  unreblog,
  unfavourite,
  bookmark,
  unbookmark,
  pin,
  unpin,
} from '../actions/interactions';
import { blockAccount } from '../actions/accounts';
import {
  muteStatus,
  unmuteStatus,
  deleteStatus,
  hideStatus,
  revealStatus,
} from '../actions/statuses';
import { initMuteModal } from '../actions/mutes';
import { initReport } from '../actions/reports';
import { openModal } from '../actions/modal';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { showAlertForError } from '../actions/alerts';
import {
  createRemovedAccount,
  groupRemoveStatus,
} from '../actions/groups';
import { getSettings } from '../actions/settings';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { deactivateUserModal, deleteUserModal, deleteStatusModal, toggleStatusSensitivityModal } from 'soapbox/actions/moderation';

const messages = defineMessages({
  deleteConfirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
  deleteMessage: { id: 'confirmations.delete.message', defaultMessage: 'Are you sure you want to delete this post?' },
  redraftConfirm: { id: 'confirmations.redraft.confirm', defaultMessage: 'Delete & redraft' },
  redraftMessage: { id: 'confirmations.redraft.message', defaultMessage: 'Are you sure you want to delete this post and re-draft it? Favorites and reposts will be lost, and replies to the original post will be orphaned.' },
  blockConfirm: { id: 'confirmations.block.confirm', defaultMessage: 'Block' },
  replyConfirm: { id: 'confirmations.reply.confirm', defaultMessage: 'Reply' },
  replyMessage: { id: 'confirmations.reply.message', defaultMessage: 'Replying now will overwrite the message you are currently composing. Are you sure you want to proceed?' },
  blockAndReport: { id: 'confirmations.block.block_and_report', defaultMessage: 'Block & Report' },
});

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = (state, props) => {
    const soapbox = getSoapboxConfig(state);

    return {
      status: getStatus(state, props),
      displayMedia: getSettings(state).get('displayMedia'),
      allowedEmoji: soapbox.get('allowedEmoji'),
    };
  };

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
    if (status.get('reblogged')) {
      dispatch(unreblog(status));
    } else {
      dispatch(reblog(status));
    }
  },

  onReblog(status, e) {
    dispatch((_, getState) => {
      const boostModal = getSettings(getState()).get('boostModal');
      if (e.shiftKey || !boostModal) {
        this.onModalReblog(status);
      } else {
        dispatch(openModal('BOOST', { status, onReblog: this.onModalReblog }));
      }
    });
  },

  onFavourite(status) {
    if (status.get('favourited')) {
      dispatch(unfavourite(status));
    } else {
      dispatch(favourite(status));
    }
  },

  onBookmark(status) {
    if (status.get('bookmarked')) {
      dispatch(unbookmark(intl, status));
    } else {
      dispatch(bookmark(intl, status));
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
          message: intl.formatMessage(withRedraft ? messages.redraftMessage : messages.deleteMessage),
          confirm: intl.formatMessage(withRedraft ? messages.redraftConfirm : messages.deleteConfirm),
          onConfirm: () => dispatch(deleteStatus(status.get('id'), history, withRedraft)),
        }));
      }
    });
  },

  onDirect(account, router) {
    dispatch(directCompose(account, router));
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

  onOpenAudio(media, time) {
    dispatch(openModal('AUDIO', { media, time }));
  },

  onBlock(status) {
    const account = status.get('account');
    dispatch(openModal('CONFIRM', {
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

  onGroupRemoveAccount(groupId, accountId) {
    dispatch(createRemovedAccount(groupId, accountId));
  },

  onGroupRemoveStatus(groupId, statusId) {
    dispatch(groupRemoveStatus(groupId, statusId));
  },

  onDeactivateUser(status) {
    dispatch(deactivateUserModal(intl, status.getIn(['account', 'id'])));
  },

  onDeleteUser(status) {
    dispatch(deleteUserModal(intl, status.getIn(['account', 'id'])));
  },

  onDeleteStatus(status) {
    dispatch(deleteStatusModal(intl, status.get('id')));
  },

  onToggleStatusSensitivity(status) {
    dispatch(toggleStatusSensitivityModal(intl, status.get('id'), status.get('sensitive')));
  },

});

export default injectIntl(connect(makeMapStateToProps, mapDispatchToProps)(Status));
