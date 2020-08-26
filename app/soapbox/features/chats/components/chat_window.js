import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Avatar from 'soapbox/components/avatar';
import { acctFull } from 'soapbox/utils/accounts';
import IconButton from 'soapbox/components/icon_button';
import { closeChat, toggleChat, fetchChatMessages } from 'soapbox/actions/chats';
import { List as ImmutableList } from 'immutable';

const mapStateToProps = (state, { pane }) => ({
  chatMessages: state.getIn(['chat_messages', pane.get('chat_id')], ImmutableList()),
});

export default @connect(mapStateToProps)
@injectIntl
class ChatWindow extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    pane: ImmutablePropTypes.map.isRequired,
    idx: PropTypes.number,
    chatMessages: ImmutablePropTypes.list,
  }

  static defaultProps = {
    chatMessages: ImmutableList(),
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

  componentDidMount() {
    const { dispatch, pane, chatMessages } = this.props;
    if (chatMessages && chatMessages.count() < 1)
      dispatch(fetchChatMessages(pane.get('chat_id')));
  }

  render() {
    const { pane, idx, chatMessages } = this.props;
    const chat = pane.get('chat');
    const account = pane.getIn(['chat', 'account']);
    if (!chat || !account) return null;

    const right = (285 * (idx + 1)) + 20;

    return (
      <div className={`pane pane--${pane.get('state')}`} style={{ right: `${right}px` }}>
        <div className='pane__header'>
          <Avatar account={account} size={18} />
          <button className='pane__title' onClick={this.handleChatToggle(chat.get('id'))}>
            @{acctFull(account)}
          </button>
          <div className='pane__close'>
            <IconButton icon='close' title='Close chat' onClick={this.handleChatClose(chat.get('id'))} />
          </div>
        </div>
        <div className='pane__content'>
          <div className='chat-messages'>
            {chatMessages.map(chatMessage =>
              <div class='chat-message'>{chatMessage.get('content')}</div>
            )}
          </div>
          <div className='pane__actions'>
            <input type='text' placeholder='Send a message...' />
          </div>
        </div>
      </div>
    );
  }

}
