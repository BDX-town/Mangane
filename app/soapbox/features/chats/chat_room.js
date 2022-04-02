import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { fetchChat, markChatRead } from 'soapbox/actions/chats';
import { Column } from 'soapbox/components/ui';
import { makeGetChat } from 'soapbox/selectors';
import { getAcct } from 'soapbox/utils/accounts';
import { displayFqn } from 'soapbox/utils/state';

import ChatBox from './components/chat_box';

const mapStateToProps = (state, { params }) => {
  const getChat = makeGetChat();
  const chat = state.getIn(['chats', 'items', params.chatId], ImmutableMap()).toJS();

  return {
    me: state.get('me'),
    chat: getChat(state, chat),
    displayFqn: displayFqn(state),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class ChatRoom extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    chat: ImmutablePropTypes.map,
    displayFqn: PropTypes.bool,
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

  markRead = () => {
    const { dispatch, chat } = this.props;
    if (!chat) return;
    dispatch(markChatRead(chat.get('id')));
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    dispatch(fetchChat(params.chatId));
    this.markRead();
  }

  componentDidUpdate(prevProps) {
    const markReadConditions = [
      () => this.props.chat,
      () => this.props.chat.get('unread') > 0,
    ];

    if (markReadConditions.every(c => c()))
      this.markRead();
  }

  render() {
    const { chat, displayFqn } = this.props;
    if (!chat) return null;
    const account = chat.get('account');

    return (
      <Column label={`@${getAcct(account, displayFqn)}`}>
        {/* <div className='chatroom__back'>
          <ColumnBackButton />
          <Link to={`/@${account.get('acct')}`} className='chatroom__header'>
            <Avatar account={account} size={18} />
            <div className='chatroom__title'>
              @{getAcct(account, displayFqn)}
            </div>
          </Link>
        </div> */}
        <ChatBox
          chatId={chat.get('id')}
          onSetInputRef={this.handleInputRef}
        />
      </Column>
    );
  }

}
