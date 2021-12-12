import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Avatar from '../../../components/avatar';
import DisplayName from '../../../components/display_name';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { shortNumberFormat } from 'soapbox/utils/numbers';
import emojify from 'soapbox/features/emoji/emoji';
import { makeGetChat } from 'soapbox/selectors';
import Icon from 'soapbox/components/icon';

const makeMapStateToProps = () => {
  const getChat = makeGetChat();

  const mapStateToProps = (state, { chatId }) => {
    const chat = state.getIn(['chats', 'items', chatId]);

    return {
      chat: chat ? getChat(state, chat.toJS()) : undefined,
    };
  };

  return mapStateToProps;
};

export default @connect(makeMapStateToProps)
class Chat extends ImmutablePureComponent {

  static propTypes = {
    chatId: PropTypes.string.isRequired,
    chat: ImmutablePropTypes.map,
    onClick: PropTypes.func,
  };

  handleClick = () => {
    this.props.onClick(this.props.chat);
  }

  render() {
    const { chat } = this.props;
    if (!chat) return null;
    const account = chat.get('account');
    const unreadCount = chat.get('unread');
    const content = chat.getIn(['last_message', 'content']);
    const attachment = chat.getIn(['last_message', 'attachment']);
    const image = attachment && attachment.getIn(['pleroma', 'mime_type'], '').startsWith('image/');
    const parsedContent = content ? emojify(content) : '';

    return (
      <div className='account'>
        <button className='floating-link' onClick={this.handleClick} />
        <div className='account__wrapper'>
          <div key={account.get('id')} className='account__display-name'>
            <div className='account__avatar-wrapper'>
              <Avatar account={account} size={36} />
            </div>
            <DisplayName account={account} />
            {attachment && (
              <Icon
                className='chat__attachment-icon'
                src={image ? require('@tabler/icons/icons/photo.svg') : require('@tabler/icons/icons/paperclip.svg')}
              />
            )}
            {content ? (
              <span
                className='chat__last-message'
                dangerouslySetInnerHTML={{ __html: parsedContent }}
              />
            ) : attachment && (
              <span
                className='chat__last-message attachment'
              >
                {image ? <FormattedMessage id='chats.attachment_image' defaultMessage='Image' /> : <FormattedMessage id='chats.attachment' defaultMessage='Attachment' />}
              </span>
            )}
            {unreadCount > 0 && <i className='icon-with-badge__badge'>{shortNumberFormat(unreadCount)}</i>}
          </div>
        </div>
      </div>
    );
  }

}
