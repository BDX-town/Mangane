import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { getSettings } from 'soapbox/actions/settings';
import ChatList from './chat_list';
import { FormattedMessage } from 'react-intl';
import { openChat, toggleMainWindow } from 'soapbox/actions/chats';
import ChatWindow from './chat_window';
import { shortNumberFormat } from 'soapbox/utils/numbers';
import AudioToggle from 'soapbox/features/chats/components/audio_toggle';

const mapStateToProps = state => {
  const settings = getSettings(state);

  return {
    panes: settings.getIn(['chats', 'panes']),
    mainWindowState: settings.getIn(['chats', 'mainWindow']),
    unreadCount: state.get('chats').reduce((acc, curr) => acc + Math.min(curr.get('unread', 0), 1), 0),
  };
};

export default @connect(mapStateToProps)
class ChatPanes extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    mainWindowState: PropTypes.string,
    panes: ImmutablePropTypes.list,
  }

  handleClickChat = (chat) => {
    this.props.dispatch(openChat(chat.get('id')));
  }

  handleMainWindowToggle = () => {
    this.props.dispatch(toggleMainWindow());
  }

  render() {
    const { panes, mainWindowState, unreadCount } = this.props;
    const open = mainWindowState === 'open';

    const mainWindowPane = (
      <div className={`pane pane--main pane--${mainWindowState}`}>
        <div className='pane__header'>
          {unreadCount > 0 && <i className='icon-with-badge__badge'>{shortNumberFormat(unreadCount)}</i>}
          <button className='pane__title' onClick={this.handleMainWindowToggle}>
            <FormattedMessage id='chat_panels.main_window.title' defaultMessage='Chats' />
          </button>
          <AudioToggle />
        </div>
        <div className='pane__content'>
          {open && <ChatList
            onClickChat={this.handleClickChat}
            emptyMessage={<FormattedMessage id='chat_panels.main_window.empty' defaultMessage="No chats found. To start a chat, visit a user's profile." />}
          />}
        </div>
      </div>
    );

    return (
      <div className='chat-panes'>
        {mainWindowPane}
        {panes.map((pane, i) => (
          <ChatWindow
            idx={i}
            key={pane.get('chat_id')}
            chatId={pane.get('chat_id')}
            windowState={pane.get('state')}
          />
        ))}
      </div>
    );
  }

}
