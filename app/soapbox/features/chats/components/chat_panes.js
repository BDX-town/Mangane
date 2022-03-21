import { List as ImmutableList } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import { injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createSelector } from 'reselect';

import { openChat, launchChat, toggleMainWindow } from 'soapbox/actions/chats';
import { getSettings } from 'soapbox/actions/settings';
import AccountSearch from 'soapbox/components/account_search';
import AudioToggle from 'soapbox/features/chats/components/audio_toggle';
import { shortNumberFormat } from 'soapbox/utils/numbers';

import ChatList from './chat_list';
import ChatWindow from './chat_window';

const messages = defineMessages({
  searchPlaceholder: { id: 'chats.search_placeholder', defaultMessage: 'Start a chat with…' },
});

const getChatsUnreadCount = state => {
  const chats = state.getIn(['chats', 'items']);
  return chats.reduce((acc, curr) => acc + Math.min(curr.get('unread', 0), 1), 0);
};

// Filter out invalid chats
const normalizePanes = (chats, panes = ImmutableList()) => (
  panes.filter(pane => chats.get(pane.get('chat_id')))
);

const makeNormalizeChatPanes = () => createSelector([
  state => state.getIn(['chats', 'items']),
  state => getSettings(state).getIn(['chats', 'panes']),
], normalizePanes);

const makeMapStateToProps = () => {
  const mapStateToProps = state => {
    const normalizeChatPanes = makeNormalizeChatPanes();

    return {
      panes: normalizeChatPanes(state),
      mainWindowState: getSettings(state).getIn(['chats', 'mainWindow']),
      unreadCount: getChatsUnreadCount(state),
    };
  };

  return mapStateToProps;
};

export default @connect(makeMapStateToProps)
@injectIntl
@withRouter
class ChatPanes extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    mainWindowState: PropTypes.string,
    panes: ImmutablePropTypes.list,
    history: PropTypes.object,
  }

  handleClickChat = (chat) => {
    this.props.dispatch(openChat(chat.get('id')));
  }

  handleSuggestion = accountId => {
    this.props.dispatch(launchChat(accountId, this.props.history));
  }

  handleMainWindowToggle = () => {
    this.props.dispatch(toggleMainWindow());
  }

  render() {
    const { intl, panes, mainWindowState, unreadCount } = this.props;
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
          {open && (
            <>
              <ChatList
                onClickChat={this.handleClickChat}
              />
              <AccountSearch
                placeholder={intl.formatMessage(messages.searchPlaceholder)}
                onSelected={this.handleSuggestion}
              />
            </>
          )}
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
