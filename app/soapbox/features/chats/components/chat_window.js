import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Avatar from 'soapbox/components/avatar';
import { acctFull } from 'soapbox/utils/accounts';
import IconButton from 'soapbox/components/icon_button';
import { closeChat, toggleChat, fetchChatMessages, sendChatMessage } from 'soapbox/actions/chats';
import { List as ImmutableList } from 'immutable';

const mapStateToProps = (state, { pane }) => ({
  chatMessages: state.getIn(['chat_messages', pane.get('chat_id')], ImmutableList()).reverse(),
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

  handleKeyDown = (chatId) => {
    return (e) => {
      if (e.key === 'Enter') {
        this.props.dispatch(sendChatMessage(chatId, this.state));
        this.setState({ content: '' });
      }
    };
  }

  handleContentChange = (e) => {
    this.setState({ content: e.target.value });
  }

  scrollToBottom = () => {
    if (!this.messagesEnd) return;
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  }

  focusInput = () => {
    if (!this.inputElem) return;
    this.inputElem.focus();
  }

  setMessageEndRef = (el) => this.messagesEnd = el;
  setInputRef = (el) => this.inputElem = el;

  componentDidMount() {
    const { dispatch, pane, chatMessages } = this.props;
    this.scrollToBottom();
    if (chatMessages && chatMessages.count() < 1)
      dispatch(fetchChatMessages(pane.get('chat_id')));
    if (pane.get('state') === 'open')
      this.focusInput();
  }

  componentDidUpdate(prevProps) {
    this.scrollToBottom();

    const oldState = prevProps.pane.get('state');
    const newState = this.props.pane.get('state');

    if (oldState !== newState && newState === 'open')
      this.focusInput();
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
            {chatMessages.map(chatMessage => (
              <div className='chat-message' key={chatMessage.get('id')}>
                <span className='chat-message__bubble'>
                  {chatMessage.get('content')}
                </span>
              </div>
            ))}
            <div style={{ float: 'left', clear: 'both' }} ref={this.setMessageEndRef} />
          </div>
          <div className='pane__actions'>
            <input
              type='text'
              placeholder='Send a message...'
              onKeyDown={this.handleKeyDown(chat.get('id'))}
              onChange={this.handleContentChange}
              value={this.state.content}
              ref={this.setInputRef}
            />
          </div>
        </div>
      </div>
    );
  }

}
