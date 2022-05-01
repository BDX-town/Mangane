import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';

import Icon from 'soapbox/components/icon';
import { Modal, Stack, Text } from 'soapbox/components/ui';
import ReplyIndicator from 'soapbox/features/compose/components/reply_indicator';

const messages = defineMessages({
  cancel_reblog: { id: 'status.cancel_reblog_private', defaultMessage: 'Un-repost' },
  reblog: { id: 'status.reblog', defaultMessage: 'Repost' },
});

export default @injectIntl @withRouter
class BoostModal extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.record.isRequired,
    onReblog: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.object,
  };

  handleReblog = () => {
    this.props.onReblog(this.props.status);
    this.props.onClose();
  }

  handleAccountClick = (e) => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.props.onClose();
      this.props.history.push(`/@${this.props.status.getIn(['account', 'acct'])}`);
    }
  }

  handleStatusClick = (e) => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.props.onClose();
      this.props.history.push(`/@${this.props.status.getIn(['account', 'acct'])}/posts/${this.props.status.get('url')}`);
    }
  }

  render() {
    const { status, intl } = this.props;
    const buttonText = status.get('reblogged') ? messages.cancel_reblog : messages.reblog;

    return (
      <Modal
        title='Repost?'
        confirmationAction={this.handleReblog}
        confirmationText={intl.formatMessage(buttonText)}
      >
        <Stack space={4}>
          <ReplyIndicator status={status} hideActions />

          <Text>
            <FormattedMessage id='boost_modal.combo' defaultMessage='You can press {combo} to skip this next time' values={{ combo: <span>Shift + <Icon id='retweet' /></span> }} />
          </Text>
        </Stack>
      </Modal>
    );
  }

}
