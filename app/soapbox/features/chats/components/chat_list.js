import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Chat from './chat';
import { createSelector } from 'reselect';

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
    chatIds: sortedChatIdsSelector(state.get('chats')),
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
    emptyMessage: PropTypes.node,
  };

  render() {
    const { chatIds, emptyMessage } = this.props;

    return (
      <div className='chat-list'>
        <div className='chat-list__content'>
          {chatIds.count() === 0 &&
            <div className='empty-column-indicator'>{emptyMessage}</div>
          }
          {chatIds.map(chatId => (
            <div key={chatId} className='chat-list-item'>
              <Chat
                chatId={chatId}
                onClick={this.props.onClickChat}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

}
