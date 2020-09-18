import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Chat from './chat';
import { makeGetChat } from 'soapbox/selectors';

const chatDateComparator = (chatA, chatB) => {
  // Sort most recently updated chats at the top
  const a = new Date(chatA.get('updated_at'));
  const b = new Date(chatB.get('updated_at'));

  if (a === b) return 0;
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
};

const mapStateToProps = state => {
  const getChat = makeGetChat();

  const chats = state.get('chats')
    .map(chat => getChat(state, chat.toJS()))
    .toList()
    .sort(chatDateComparator);

  return {
    chats,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class ChatList extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    onClickChat: PropTypes.func,
    emptyMessage: PropTypes.node,
  };

  render() {
    const { chats, emptyMessage } = this.props;

    return (
      <div className='chat-list'>
        <div className='chat-list__content'>
          {chats.count() === 0 &&
            <div className='empty-column-indicator'>{emptyMessage}</div>
          }
          {chats.map(chat => (
            <div key={chat.get('id')} className='chat-list-item'>
              <Chat
                chat={chat}
                onClick={this.props.onClickChat}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

}
