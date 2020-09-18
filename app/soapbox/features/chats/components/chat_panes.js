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
import { openChat, toggleMainWindow } from 'soapbox/actions/chats';
import ChatWindow from './chat_window';
import { shortNumberFormat } from 'soapbox/utils/numbers';

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
    unreadCount: state.get('chats').reduce((acc, curr) => acc + curr.get('unread'), 0),
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
  }

  handleMainWindowToggle = () => {
    this.props.dispatch(toggleMainWindow());
  }

  render() {
    const { panesData, unreadCount } = this.props;
    const panes = panesData.get('panes');
    const mainWindow = panesData.get('mainWindow');

    const mainWindowPane = (
      <div className={`pane pane--main pane--${mainWindow}`}>
        <div className='pane__header'>
          {unreadCount > 0 && <i className='icon-with-badge__badge'>{shortNumberFormat(unreadCount)}</i>}
          <button className='pane__title' onClick={this.handleMainWindowToggle}>
            <FormattedMessage id='chat_panels.main_window.title' defaultMessage='Chats' />
          </button>
        </div>
        <div className='pane__content'>
          <ChatList
            onClickChat={this.handleClickChat}
            emptyMessage={<FormattedMessage id='chat_panels.main_window.empty' defaultMessage="No chats found. To start a chat, visit a user's profile." />}
          />
        </div>
      </div>
    );

    return (
      <div className='chat-panes'>
        {mainWindowPane}
        {panes.map((pane, i) =>
          <ChatWindow idx={i} pane={pane} key={pane.get('chat_id')} />
        )}
      </div>
    );
  }

}
