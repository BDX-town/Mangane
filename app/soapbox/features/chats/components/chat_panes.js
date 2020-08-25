import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { getSettings } from 'soapbox/actions/settings';
import ChatList from './chat_list';
import { FormattedMessage } from 'react-intl';
import { makeGetChat } from 'soapbox/selectors';
import Avatar from 'soapbox/components/avatar';
import { acctFull } from 'soapbox/utils/accounts';
import { openChat, closeChat, toggleChat } from 'soapbox/actions/chats';
import IconButton from 'soapbox/components/icon_button';

const addChatsToPanes = (state, panesData) => {
  const getChat = makeGetChat();

  const newPanes = panesData.get('panes').map(pane => {
    const chat = getChat(state, { id: pane.get('chat_id') });
    return pane.set('chat', chat);
  });

  return panesData.set('panes', newPanes);
};

const mapStateToProps = state => {
  const panesData = getSettings(state).get('chats');

  return {
    panesData: addChatsToPanes(state, panesData),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class ChatPanes extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    panesData: ImmutablePropTypes.map,
  }

  handleClickChat = (chat) => {
    this.props.dispatch(openChat(chat.get('id')));
    // TODO: Focus chat input
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

  renderChatPane = (pane, i) => {
    const chat = pane.get('chat');
    const account = pane.getIn(['chat', 'account']);
    if (!chat || !account) return null;

    const right = (285 * (i + 1)) + 20;

    return (
      <div key={i} className={`pane pane--${pane.get('state')}`} style={{ right: `${right}px` }}>
        <div className='pane__header'>
          <Avatar account={account} size={18} />
          <div className='display-name__account'>
            <a onClick={this.handleChatToggle(chat.get('id'))}>
              @{acctFull(account)}
            </a>
          </div>
          <div className='pane__close'>
            <IconButton icon='close' title='Close chat' onClick={this.handleChatClose(chat.get('id'))} />
          </div>
        </div>
        <div className='pane__content'>
          <div style={{ padding: '10px' }}>TODO: Show the chat messages</div>
          <div className='pane__actions'>
            <input type='text' placeholder='Send a message...' />
          </div>
        </div>
      </div>
    );
  }

  renderChatPanes = (panes) => (
    panes.map((pane, i) =>
      this.renderChatPane(pane, i)
    )
  )

  render() {
    const panes = this.props.panesData.get('panes');

    return (
      <div className='chat-panes'>
        <div className='pane pane--main'>
          <div className='pane__header'>
            <FormattedMessage id='chat_panels.main_window.title' defaultMessage='Chats' />
          </div>
          <div className='pane__content'>
            <ChatList onClickChat={this.handleClickChat} />
          </div>
        </div>
        {this.renderChatPanes(panes)}
      </div>
    );
  }

}
