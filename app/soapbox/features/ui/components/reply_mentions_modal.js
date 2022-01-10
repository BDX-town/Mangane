import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import IconButton from 'soapbox/components/icon_button';
import { statusToMentionsAccountIdsArray } from 'soapbox/reducers/compose';
import { makeGetStatus } from 'soapbox/selectors';

import Account from '../../reply_mentions/account';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  confirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
});

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  return state => {
    const status = getStatus(state, { id: state.getIn(['compose', 'in_reply_to']) });

    if (!status) {
      return {
        isReply: false,
      };
    }

    const me = state.get('me');
    const account = state.getIn(['accounts', me]);

    const mentions = statusToMentionsAccountIdsArray(state, status, account);

    return {
      mentions,
      author: status.getIn(['account', 'id']),
      to: state.getIn(['compose', 'to']),
      isReply: true,
    };
  };
};

class ComposeModal extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    author: PropTypes.string,
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    inReplyTo: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  };

  onClickClose = () => {
    const { onClose, onCancel } = this.props;
    onClose('COMPOSE');
    if (onCancel) onCancel();
  };

  render() {
    const { intl, mentions, author } = this.props;

    return (
      <div className='modal-root__modal reply-mentions-modal'>
        <div className='reply-mentions-modal__header'>
          <IconButton
            className='reply-mentions-modal__back'
            src={require('@tabler/icons/icons/arrow-left.svg')}
            onClick={this.onClickClose}
            aria-label={intl.formatMessage(messages.close)}
            title={intl.formatMessage(messages.close)}
          />
          <h3 className='reply-mentions-modal__header__title'>
            <FormattedMessage id='navigation_bar.in_reply_to' defaultMessage='In reply to' />
          </h3>
        </div>
        <div className='reply-mentions-modal__accounts'>
          {mentions.map(accountId => <Account key={accountId} accountId={accountId} added author={author === accountId} />)}
        </div>
      </div>
    );
  }

}

export default injectIntl(connect(makeMapStateToProps)(ComposeModal));
