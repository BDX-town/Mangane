import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Avatar from 'soapbox/components/avatar';
import { acctFull } from 'soapbox/utils/accounts';
import IconButton from 'soapbox/components/icon_button';
import {
  closeChat,
  toggleChat,
  fetchChatMessages,
  sendChatMessage,
  markChatRead,
} from 'soapbox/actions/chats';
import { List as ImmutableList, OrderedSet as ImmutableOrderedSet } from 'immutable';
import ChatMessageList from './chat_message_list';
import { shortNumberFormat } from 'soapbox/utils/numbers';

const mapStateToProps = (state, { pane }) => ({
  me: state.get('me'),
  chat: state.getIn(['chats', pane.get('chat_id')]),
  chatMessageIds: state.getIn(['chat_message_lists', pane.get('chat_id')], ImmutableOrderedSet()),
});

export default @connect(mapStateToProps)
@injectIntl
class ChatWindow extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    pane: ImmutablePropTypes.map.isRequired,
    idx: PropTypes.number,
    chatMessageIds: ImmutablePropTypes.orderedSet,
    chat: ImmutablePropTypes.map,
    me: PropTypes.node,
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
        e.preventDefault();
      }
    };
  }

  handleContentChange = (e) => {
    this.setState({ content: e.target.value });
  }

  handleReadChat = (e) => {
    const { dispatch, chat } = this.props;
    dispatch(markChatRead(chat.get('id')));
  }

  focusInput = () => {
    if (!this.inputElem) return;
    this.inputElem.focus();
  }

  setInputRef = (el) => {
    const { pane } = this.props;
    this.inputElem = el;
    if (pane.get('state') === 'open') this.focusInput();
  };

  componentDidMount() {
    const { dispatch, pane, chatMessages } = this.props;
    if (chatMessages && chatMessages.count() < 1)
      dispatch(fetchChatMessages(pane.get('chat_id')));
  }

  componentDidUpdate(prevProps) {
    const oldState = prevProps.pane.get('state');
    const newState = this.props.pane.get('state');

    if (oldState !== newState && newState === 'open')
      this.focusInput();

    const markReadConditions = [
      () => this.props.chat !== undefined,
      () => document.activeElement === this.inputElem,
      () => this.props.chat.get('unread') > 0,
    ];

    if (markReadConditions.every(c => c() === true))
      this.handleReadChat();
  }

  render() {
    const { pane, idx, chatMessageIds, chat } = this.props;
    const account = pane.getIn(['chat', 'account']);
    if (!chat || !account) return null;

    const right = (285 * (idx + 1)) + 20;
    const unreadCount = chat.get('unread');

    return (
      <div className={`pane pane--${pane.get('state')}`} style={{ right: `${right}px` }} onMouseOver={this.handleReadChat}>
        <div className='pane__header'>
          {unreadCount > 0
            ? <i className='icon-with-badge__badge'>{shortNumberFormat(unreadCount)}</i>
            : <Avatar account={account} size={18} />
          }
          <button className='pane__title' onClick={this.handleChatToggle(chat.get('id'))}>
            @{acctFull(account)}
          </button>
          <div className='pane__close'>
            <IconButton icon='close' title='Close chat' onClick={this.handleChatClose(chat.get('id'))} />
          </div>
        </div>
        <div className='pane__content'>
          <ChatMessageList chatMessageIds={chatMessageIds} />
          <div className='pane__actions simple_form'>
            <textarea
              rows={1}
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
