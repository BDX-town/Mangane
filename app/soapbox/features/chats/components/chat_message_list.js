import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import { fetchChatMessages } from 'soapbox/actions/chats';
import emojify from 'soapbox/features/emoji/emoji';
import classNames from 'classnames';
import { escape, throttle } from 'lodash';

const scrollBottom = (elem) => elem.scrollHeight - elem.offsetHeight - elem.scrollTop;

const makeEmojiMap = record => record.get('emojis', ImmutableList()).reduce((map, emoji) => {
  return map.set(`:${emoji.get('shortcode')}:`, emoji);
}, ImmutableMap());

const mapStateToProps = (state, { chatMessageIds }) => ({
  me: state.get('me'),
  chatMessages: chatMessageIds.reduce((acc, curr) => {
    const chatMessage = state.getIn(['chat_messages', curr]);
    return chatMessage ? acc.push(chatMessage) : acc;
  }, ImmutableList()),
});

export default @connect(mapStateToProps)
@injectIntl
class ChatMessageList extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    chatId: PropTypes.string,
    chatMessages: ImmutablePropTypes.list,
    chatMessageIds: ImmutablePropTypes.orderedSet,
    me: PropTypes.node,
  }

  static defaultProps = {
    chatMessages: ImmutableList(),
  }

  state = {
    isLoading: false,
  }

  scrollToBottom = () => {
    if (!this.messagesEnd) return;
    this.messagesEnd.scrollIntoView();
  }

  setMessageEndRef = (el) => {
    this.messagesEnd = el;
  };

  getFormattedTimestamp = (chatMessage) => {
    const { intl } = this.props;
    return intl.formatDate(
      new Date(chatMessage.get('created_at')), {
        hour12: false,
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  };

  setBubbleRef = (c) => {
    if (!c) return;
    const links = c.querySelectorAll('a[rel="ugc"]');

    links.forEach(link => {
      link.classList.add('chat-link');
      link.setAttribute('rel', 'ugc nofollow noopener');
      link.setAttribute('target', '_blank');
    });
  }

  componentDidMount() {
    const { dispatch, chatId } = this.props;
    dispatch(fetchChatMessages(chatId));

    this.node.addEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate(prevProps) {
    const oldCount = prevProps.chatMessages.count();
    const newCount = this.props.chatMessages.count();
    const isNearBottom = scrollBottom(this.node) < 150;
    const historyAdded = prevProps.chatMessages.getIn([-1, 'id']) !== this.props.chatMessages.getIn([-1, 'id']);

    if (oldCount !== newCount) {
      if (isNearBottom) this.scrollToBottom();
      if (historyAdded) this.setState({ isLoading: false });
    }
  }

  componentWillUnmount() {
    this.node.removeEventListener('scroll', this.handleScroll);
  }

  handleLoadMore = () => {
    const { dispatch, chatId, chatMessages } = this.props;
    const maxId = chatMessages.getIn([-1, 'id']);
    dispatch(fetchChatMessages(chatId, maxId));
    this.setState({ isLoading: true });
  }

  handleScroll = throttle(() => {
    if (this.node.scrollTop < 150 && !this.state.isLoading) this.handleLoadMore();
  }, 150, {
    trailing: true,
  });

  parsePendingContent = content => {
    return escape(content).replace(/(?:\r\n|\r|\n)/g, '<br>');
  }

  parseContent = chatMessage => {
    const content = chatMessage.get('content') || '';
    const pending = chatMessage.get('pending', false);
    const formatted = pending ? this.parsePendingContent(content) : content;
    const emojiMap = makeEmojiMap(chatMessage);
    return emojify(formatted, emojiMap.toJS());
  }

  setRef = (c) => {
    this.node = c;
  }

  render() {
    const { chatMessages, me } = this.props;

    return (
      <div className='chat-messages' ref={this.setRef}>
        <div style={{ float: 'left', clear: 'both' }} ref={this.setMessageEndRef} />
        {chatMessages.map(chatMessage => (
          <div
            className={classNames('chat-message', {
              'chat-message--me': chatMessage.get('account_id') === me,
              'chat-message--pending': chatMessage.get('pending', false) === true,
            })}
            key={chatMessage.get('id')}
          >
            <span
              title={this.getFormattedTimestamp(chatMessage)}
              className='chat-message__bubble'
              dangerouslySetInnerHTML={{ __html: this.parseContent(chatMessage) }}
              ref={this.setBubbleRef}
            />
          </div>
        ))}
      </div>
    );
  }

}
