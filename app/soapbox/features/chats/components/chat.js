import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import Avatar from '../../../components/avatar';
import DisplayName from '../../../components/display_name';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { shortNumberFormat } from 'soapbox/utils/numbers';
import emojify from 'soapbox/features/emoji/emoji';
import DropdownMenuContainer from 'soapbox/containers/dropdown_menu_container';
import { removeChat } from 'soapbox/actions/chats';
import { initReportById } from 'soapbox/actions/reports';

const messages = defineMessages({
  more: { id: 'chat_list.actions.more', defaultMessage: 'More' },
  remove: { id: 'chat_list.actions.remove', defaultMessage: 'Remove chat' },
  report: { id: 'chat_list.actions.report', defaultMessage: 'Report user' },
});

export default @connect()
@injectIntl
class Chat extends ImmutablePureComponent {

  static propTypes = {
    chat: ImmutablePropTypes.map.isRequired,
    intl: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  };

  handleClick = () => {
    this.props.onClick(this.props.chat);
  }

  handleRemoveChat = (chatId) => {
    return () => {
      this.props.dispatch(removeChat(chatId));
    };
  }

  handleReportUser = (userId) => {
    return () => {
      this.props.dispatch(initReportById(userId));
    };
  }

  render() {
    const { chat, intl } = this.props;
    if (!chat) return null;
    const account = chat.get('account');
    const accountId = chat.getIn(['account', 'id']);
    const unreadCount = chat.get('unread');
    const content = chat.getIn(['last_message', 'content']);
    const parsedContent = content ? emojify(content) : '';
    const menu = [
      { text: intl.formatMessage(messages.remove), action: this.handleRemoveChat(chat.get('id')) },
      { text: intl.formatMessage(messages.report), action: this.handleReportUser(accountId) },
    ];

    return (
      <div className='account'>
        <button className='floating-link' onClick={this.handleClick} />
        <div className='account__wrapper'>
          <div key={account.get('id')} className='account__display-name'>
            <div className='account__avatar-wrapper'>
              <Avatar account={account} size={36} />
            </div>
            <DisplayName account={account} />
            <span
              className='chat__last-message'
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
            <div className='chat__menu'>
              <DropdownMenuContainer
                items={menu}
                icon='ellipsis-h'
                size={18}
                direction='top'
                title={intl.formatMessage(messages.more)}
              />
            </div>
            {unreadCount > 0 && <i className='icon-with-badge__badge'>{shortNumberFormat(unreadCount)}</i>}
          </div>
        </div>
      </div>
    );
  }

}
