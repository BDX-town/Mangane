import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
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
  };

  componentDidMount() {
    this.props.dispatch(fetchChats());
  }

  handleClickChat = () => {
    // TODO: Open or focus chat panel
  }

  render() {
    const { chats } = this.props;

    return (
      <div className='chat-list'>
        <div className='chat-list__header'>
          <FormattedMessage id='chat_list.title' defaultMessage='Chats' />
        </div>
        <div className='chat-list__content'>
          {chats.toList().map(chat => (
            <div key={chat.get('id')} className='chat-list-item'>
              <ChatListAccount
                account={chat.get('account')}
                onClick={this.handleClickChat}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

}
