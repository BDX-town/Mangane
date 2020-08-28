import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Avatar from 'soapbox/components/avatar';
import { acctFull } from 'soapbox/utils/accounts';
import { fetchChat } from 'soapbox/actions/chats';
import ChatBox from './components/chat_box';
import Column from 'soapbox/components/column';
import ColumnBackButton from 'soapbox/components/column_back_button';
import { makeGetChat } from 'soapbox/selectors';

const mapStateToProps = (state, { params }) => {
  const getChat = makeGetChat();

  return {
    me: state.get('me'),
    chat: getChat(state, { id: params.chatId }),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class ChatRoom extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    chat: ImmutablePropTypes.map,
    me: PropTypes.node,
  }

  handleInputRef = (el) => {
    this.inputElem = el;
    this.focusInput();
  };

  focusInput = () => {
    if (!this.inputElem) return;
    this.inputElem.focus();
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    dispatch(fetchChat(params.chatId));
  }

  render() {
    const { chat } = this.props;
    if (!chat) return null;
    const account = chat.get('account');

    return (
      <Column>
        <div className='chatroom__back'>
          <ColumnBackButton />
          <div className='chatroom__header'>
            <Avatar account={account} size={18} />
            <div className='chatroom__title'>
              @{acctFull(account)}
            </div>
          </div>
        </div>
        <ChatBox
          chatId={chat.get('id')}
          onSetInputRef={this.handleInputRef}
        />
      </Column>
    );
  }

}
