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
import { openModal } from 'soapbox/actions/modal';
import { escape, throttle } from 'lodash';
import { MediaGallery } from 'soapbox/features/ui/util/async-components';
import Bundle from 'soapbox/features/ui/components/bundle';

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
    initialLoad: true,
    isLoading: false,
  }

  scrollToBottom = () => {
    if (!this.messagesEnd) return;
    this.messagesEnd.scrollIntoView(false);
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

  isNearBottom = () => {
    const elem = this.node;
    if (!elem) return false;

    const scrollBottom = elem.scrollHeight - elem.offsetHeight - elem.scrollTop;
    return scrollBottom < elem.offsetHeight * 1.5;
  }

  handleResize = (e) => {
    if (this.isNearBottom()) this.scrollToBottom();
  }

  componentDidMount() {
    const { dispatch, chatId } = this.props;
    dispatch(fetchChatMessages(chatId));

    this.node.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
    this.scrollToBottom();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    const { scrollHeight, scrollTop } = this.node;
    return scrollHeight - scrollTop;
  }

  restoreScrollPosition = (scrollBottom) => {
    this.lastComputedScroll = this.node.scrollHeight - scrollBottom;
    this.node.scrollTop = this.lastComputedScroll;
  }

  componentDidUpdate(prevProps, prevState, scrollBottom) {
    const { initialLoad } = this.state;
    const oldCount = prevProps.chatMessages.count();
    const newCount = this.props.chatMessages.count();
    const isNearBottom = this.isNearBottom();
    const historyAdded = prevProps.chatMessages.getIn([0, 'id']) !== this.props.chatMessages.getIn([0, 'id']);

    // Retain scroll bar position when loading old messages
    this.restoreScrollPosition(scrollBottom);

    if (oldCount !== newCount) {
      if (isNearBottom || initialLoad) this.scrollToBottom();
      if (historyAdded) this.setState({ isLoading: false, initialLoad: false });
    }
  }

  componentWillUnmount() {
    this.node.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  }

  handleLoadMore = () => {
    const { dispatch, chatId, chatMessages } = this.props;
    const maxId = chatMessages.getIn([0, 'id']);
    dispatch(fetchChatMessages(chatId, maxId));
    this.setState({ isLoading: true });
  }

  handleScroll = throttle(() => {
    const { lastComputedScroll } = this;
    const { isLoading, initialLoad } = this.state;
    const { scrollTop, offsetHeight } = this.node;
    const computedScroll = lastComputedScroll === scrollTop;
    const nearTop = scrollTop < offsetHeight * 2;

    if (nearTop && !isLoading && !initialLoad && !computedScroll)
      this.handleLoadMore();
  }, 150, {
    trailing: true,
  });

  onOpenMedia = (media, index) => {
    this.props.dispatch(openModal('MEDIA', { media, index }));
  };

  maybeRenderMedia = chatMessage => {
    const attachment = chatMessage.get('attachment');
    if (!attachment) return null;
    return (
      <div className='chat-message__media'>
        <Bundle fetchComponent={MediaGallery}>
          {Component => (
            <Component
              media={ImmutableList([attachment])}
              height={120}
              onOpenMedia={this.onOpenMedia}
            />
          )}
        </Bundle>
      </div>
    );
  }

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
        {chatMessages.map(chatMessage => (
          <div
            className={classNames('chat-message', {
              'chat-message--me': chatMessage.get('account_id') === me,
              'chat-message--pending': chatMessage.get('pending', false) === true,
            })}
            key={chatMessage.get('id')}
          >
            <div
              title={this.getFormattedTimestamp(chatMessage)}
              className='chat-message__bubble'
              ref={this.setBubbleRef}
            >
              {this.maybeRenderMedia(chatMessage)}
              <span
                className='chat-message__content'
                dangerouslySetInnerHTML={{ __html: this.parseContent(chatMessage) }}
              />
            </div>
          </div>
        ))}
        <div style={{ float: 'left', clear: 'both' }} ref={this.setMessageEndRef} />
      </div>
    );
  }

}
