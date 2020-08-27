import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { fetchChats } from 'soapbox/actions/chats';
import ChatListAccount from './chat_list_account';
import { makeGetChat } from 'soapbox/selectors';

const mapStateToProps = state => {
  const getChat = makeGetChat();
  return {
    chats: state.get('chats').map(chat => getChat(state, chat.toJS())),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class ChatList extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    onClickChat: PropTypes.func,
  };

  componentDidMount() {
    this.props.dispatch(fetchChats());
  }

  render() {
    const { chats } = this.props;

    return (
      <div className='chat-list'>
        <div className='chat-list__content'>
          {chats.toList().map(chat => (
            <div key={chat.get('id')} className='chat-list-item'>
              <ChatListAccount
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
