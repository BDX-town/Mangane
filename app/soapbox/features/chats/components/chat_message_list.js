import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { List as ImmutableList } from 'immutable';
import emojify from 'soapbox/features/emoji/emoji';
import classNames from 'classnames';

const mapStateToProps = (state, { chatMessageIds }) => ({
  me: state.get('me'),
  chatMessages: chatMessageIds.reduce((acc, curr) => {
    const chatMessage = state.getIn(['chat_messages', curr]);
    return chatMessage ? acc.push(chatMessage) : acc;
  }, ImmutableList()).sort(),
});

export default @connect(mapStateToProps)
@injectIntl
class ChatMessageList extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    chatMessages: ImmutablePropTypes.list,
    chatMessageIds: ImmutablePropTypes.orderedSet,
    me: PropTypes.node,
  }

  static defaultProps = {
    chatMessages: ImmutableList(),
  }

  scrollToBottom = () => {
    if (!this.messagesEnd) return;
    this.messagesEnd.scrollIntoView();
  }

  setMessageEndRef = (el) => {
    this.messagesEnd = el;
    this.scrollToBottom();
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

  componentDidUpdate(prevProps) {
    if (prevProps.chatMessages !== this.props.chatMessages)
      this.scrollToBottom();
  }

  render() {
    const { chatMessages, me } = this.props;

    return (
      <div className='chat-messages'>
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
              dangerouslySetInnerHTML={{ __html: emojify(chatMessage.get('content') || '') }}
            />
          </div>
        ))}
        <div style={{ float: 'left', clear: 'both' }} ref={this.setMessageEndRef} />
      </div>
    );
  }

}
