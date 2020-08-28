import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import {
  fetchChatMessages,
  sendChatMessage,
  markChatRead,
} from 'soapbox/actions/chats';
import { List as ImmutableList, OrderedSet as ImmutableOrderedSet } from 'immutable';
import ChatMessageList from './components/chat_message_list';
import Column from 'soapbox/features/ui/components/column';

const mapStateToProps = (state, { params }) => ({
  me: state.get('me'),
  chat: state.getIn(['chats', params.chatId]),
  chatMessageIds: state.getIn(['chat_message_lists', params.chatId], ImmutableOrderedSet()),
});

export default @connect(mapStateToProps)
@injectIntl
class ChatWindow extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
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
    this.inputElem = el;
    this.focusInput();
  };

  componentDidMount() {
    const { dispatch, chatMessages, params } = this.props;
    if (chatMessages && chatMessages.count() < 1)
      dispatch(fetchChatMessages(params.chatId));
  }

  componentDidUpdate(prevProps) {
    const markReadConditions = [
      () => this.props.chat !== undefined,
      () => document.activeElement === this.inputElem,
      () => this.props.chat.get('unread') > 0,
    ];

    if (markReadConditions.every(c => c() === true))
      this.handleReadChat();
  }

  render() {
    const { chatMessageIds, chat } = this.props;
    if (!chat) return null;

    return (
      <Column>
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
      </Column>
    );
  }

}
