import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, defineMessages } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import {
  fetchChatMessages,
  sendChatMessage,
  markChatRead,
} from 'soapbox/actions/chats';
import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import ChatMessageList from './chat_message_list';

const messages = defineMessages({
  placeholder: { id: 'chat_box.input.placeholder', defaultMessage: 'Send a message…' },
});

const mapStateToProps = (state, { chatId }) => ({
  me: state.get('me'),
  chat: state.getIn(['chats', chatId]),
  chatMessageIds: state.getIn(['chat_message_lists', chatId], ImmutableOrderedSet()),
});

export default @connect(mapStateToProps)
@injectIntl
class ChatBox extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    chatId: PropTypes.string.isRequired,
    chatMessageIds: ImmutablePropTypes.orderedSet,
    chat: ImmutablePropTypes.map,
    onSetInputRef: PropTypes.func,
    me: PropTypes.node,
  }

  state = {
    content: '',
  }

  sendMessage = () => {
    const { chatId } = this.props;
    if (this.state.content.length < 1) return;
    this.props.dispatch(sendChatMessage(chatId, this.state));
    this.setState({ content: '' });
  }

  insertLine = () => {
    const { content } = this.state;
    this.setState({ content: content + '\n' });
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      this.insertLine();
      e.preventDefault();
    } else if (e.key === 'Enter') {
      this.sendMessage();
      e.preventDefault();
    }
  }

  handleContentChange = (e) => {
    this.setState({ content: e.target.value });
  }

  markRead = () => {
    const { dispatch, chatId } = this.props;
    dispatch(markChatRead(chatId));
  }

  handleHover = () => {
    this.markRead();
  }

  setInputRef = (el) => {
    const { onSetInputRef } = this.props;
    this.inputElem = el;
    onSetInputRef(el);
  };

  componentDidMount() {
    const { dispatch, chatId } = this.props;
    dispatch(fetchChatMessages(chatId));
  }

  componentDidUpdate(prevProps) {
    const markReadConditions = [
      () => this.props.chat !== undefined,
      () => document.activeElement === this.inputElem,
      () => this.props.chat.get('unread') > 0,
    ];

    if (markReadConditions.every(c => c() === true))
      this.markRead();
  }

  render() {
    const { chatMessageIds, intl } = this.props;
    if (!chatMessageIds) return null;

    return (
      <div className='chat-box' onMouseOver={this.handleHover}>
        <ChatMessageList chatMessageIds={chatMessageIds} />
        <div className='chat-box__actions simple_form'>
          <textarea
            rows={1}
            placeholder={intl.formatMessage(messages.placeholder)}
            onKeyDown={this.handleKeyDown}
            onChange={this.handleContentChange}
            value={this.state.content}
            ref={this.setInputRef}
          />
        </div>
      </div>
    );
  }

}
