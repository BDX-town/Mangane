import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { expandChats } from 'soapbox/actions/chats';
import ScrollableList from 'soapbox/components/scrollable_list';
import PlaceholderChat from 'soapbox/features/placeholder/components/placeholder_chat';

import Chat from './chat';

const messages = defineMessages({
  emptyMessage: { id: 'chat_panels.main_window.empty', defaultMessage: 'No chats found. To start a chat, visit a user\'s profile' },
});

const getSortedChatIds = chats => (
  chats
    .toList()
    .sort(chatDateComparator)
    .map(chat => chat.get('id'))
);

const chatDateComparator = (chatA, chatB) => {
  // Sort most recently updated chats at the top
  const a = new Date(chatA.get('updated_at'));
  const b = new Date(chatB.get('updated_at'));

  if (a === b) return 0;
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
};

const makeMapStateToProps = () => {
  const sortedChatIdsSelector = createSelector(
    [getSortedChatIds],
    chats => chats,
  );

  const mapStateToProps = state => ({
    chatIds: sortedChatIdsSelector(state.getIn(['chats', 'items'])),
    hasMore: !!state.getIn(['chats', 'next']),
    isLoading: state.getIn(['chats', 'loading']),
  });

  return mapStateToProps;
};

export default @connect(makeMapStateToProps)
@injectIntl
class ChatList extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    chatIds: ImmutablePropTypes.list,
    onClickChat: PropTypes.func,
    onRefresh: PropTypes.func,
    hasMore: PropTypes.func,
    isLoading: PropTypes.bool,
  };

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandChats());
  }, 300, { leading: true });

  render() {
    const { intl, chatIds, hasMore, isLoading } = this.props;

    return (
      <ScrollableList
        className='chat-list'
        scrollKey='awaiting-approval'
        emptyMessage={intl.formatMessage(messages.emptyMessage)}
        hasMore={hasMore}
        isLoading={isLoading}
        showLoading={isLoading && chatIds.size === 0}
        onLoadMore={this.handleLoadMore}
        onRefresh={this.props.onRefresh}
        placeholderComponent={PlaceholderChat}
        placeholderCount={20}
      >
        {chatIds.map(chatId => (
          <div key={chatId} className='chat-list-item'>
            <Chat
              chatId={chatId}
              onClick={this.props.onClickChat}
            />
          </div>
        ))}
      </ScrollableList>
    );
  }

}
