import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  closeChat,
  toggleChat,
} from 'soapbox/actions/chats';
import Avatar from 'soapbox/components/avatar';
import HoverRefWrapper from 'soapbox/components/hover_ref_wrapper';
import IconButton from 'soapbox/components/icon_button';
import { makeGetChat } from 'soapbox/selectors';
import { getAcct } from 'soapbox/utils/accounts';
import { shortNumberFormat } from 'soapbox/utils/numbers';
import { displayFqn } from 'soapbox/utils/state';

import ChatBox from './chat_box';

const makeMapStateToProps = () => {
  const getChat = makeGetChat();

  const mapStateToProps = (state, { chatId }) => {
    const chat = state.getIn(['chats', 'items', chatId]);

    return {
      me: state.get('me'),
      chat: chat ? getChat(state, chat.toJS()) : undefined,
      displayFqn: displayFqn(state),
    };
  };

  return mapStateToProps;
};

export default @connect(makeMapStateToProps)
@injectIntl
class ChatWindow extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    chatId: PropTypes.string.isRequired,
    windowState: PropTypes.string.isRequired,
    idx: PropTypes.number,
    chat: ImmutablePropTypes.record,
    me: PropTypes.node,
    displayFqn: PropTypes.bool,
  }

  state = {
    content: '',
  }

  handleChatClose = (chatId) => {
    return (e) => {
      this.props.dispatch(closeChat(chatId));
    };
  }

  handleChatToggle = (chatId) => {
    return (e) => {
      this.props.dispatch(toggleChat(chatId));
    };
  }

  handleContentChange = (e) => {
    this.setState({ content: e.target.value });
  }

  handleInputRef = (el) => {
    this.inputElem = el;
    this.focusInput();
  };

  focusInput = () => {
    if (!this.inputElem) return;
    this.inputElem.focus();
  }

  componentDidUpdate(prevProps) {
    const oldState = prevProps.windowState;
    const newState = this.props.windowState;

    if (oldState !== newState && newState === 'open')
      this.focusInput();
  }

  render() {
    const { windowState, idx, chat, displayFqn } = this.props;
    if (!chat) return null;
    const account = chat.get('account');

    const right = (285 * (idx + 1)) + 20;
    const unreadCount = chat.get('unread');

    const unreadIcon = (
      <i className='icon-with-badge__badge'>
        {shortNumberFormat(unreadCount)}
      </i>
    );

    const avatar = (
      <HoverRefWrapper accountId={account.get('id')}>
        <Link to={`/@${account.get('acct')}`}>
          <Avatar account={account} size={18} />
        </Link>
      </HoverRefWrapper>
    );

    return (
      <div className={`pane pane--${windowState}`} style={{ right: `${right}px` }}>
        <div className='pane__header'>
          {unreadCount > 0 ? unreadIcon : avatar }
          <button className='pane__title' onClick={this.handleChatToggle(chat.get('id'))}>
            @{getAcct(account, displayFqn)}
          </button>
          <div className='pane__close'>
            <IconButton src={require('@tabler/icons/icons/x.svg')} title='Close chat' onClick={this.handleChatClose(chat.get('id'))} />
          </div>
        </div>
        <div className='pane__content'>
          <ChatBox
            chatId={chat.get('id')}
            onSetInputRef={this.handleInputRef}
          />
        </div>
      </div>
    );
  }

}
