import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { withRouter } from 'react-router-dom';

import StatusContainer from '../../../containers/status_container';

export default @withRouter
class Conversation extends ImmutablePureComponent {

  static propTypes = {
    conversationId: PropTypes.string.isRequired,
    accounts: ImmutablePropTypes.list.isRequired,
    lastStatusId: PropTypes.string,
    unread: PropTypes.bool.isRequired,
    onMoveUp: PropTypes.func,
    onMoveDown: PropTypes.func,
    markRead: PropTypes.func.isRequired,
    history: PropTypes.object,
  };

  handleClick = () => {
    if (!this.props.history) {
      return;
    }

    const { lastStatusId, unread, markRead } = this.props;

    if (unread) {
      markRead();
    }

    this.props.history.push(`/statuses/${lastStatusId}`);
  }

  handleHotkeyMoveUp = () => {
    this.props.onMoveUp(this.props.conversationId);
  }

  handleHotkeyMoveDown = () => {
    this.props.onMoveDown(this.props.conversationId);
  }

  render() {
    const { accounts, lastStatusId, unread } = this.props;

    if (lastStatusId === null) {
      return null;
    }

    return (
      <StatusContainer
        id={lastStatusId}
        unread={unread}
        otherAccounts={accounts}
        onMoveUp={this.handleHotkeyMoveUp}
        onMoveDown={this.handleHotkeyMoveDown}
        onClick={this.handleClick}
      />
    );
  }

}
