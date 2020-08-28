import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { fetchChat } from 'soapbox/actions/chats';
import ChatBox from './components/chat_box';
import Column from 'soapbox/features/ui/components/column';

const mapStateToProps = (state, { params }) => ({
  me: state.get('me'),
  chat: state.getIn(['chats', params.chatId]),
});

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

    return (
      <Column>
        <ChatBox
          chatId={chat.get('id')}
          onSetInputRef={this.handleInputRef}
        />
      </Column>
    );
  }

}
