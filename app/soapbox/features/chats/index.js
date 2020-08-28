import React from 'react';
import PropTypes from 'prop-types';
import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ChatList from './components/chat_list';

const messages = defineMessages({
  title: { id: 'column.chats', defaultMessage: 'Chats' },
});

export default @injectIntl
class ChatIndex extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  handleClickChat = (chat) => {
    this.context.router.history.push(`/chats/${chat.get('id')}`);
  }

  render() {
    const { intl } = this.props;

    return (
      <Column label={intl.formatMessage(messages.title)}>
        <ColumnHeader
          icon='comment'
          title={intl.formatMessage(messages.title)}
        />

        <ChatList
          onClickChat={this.handleClickChat}
          emptyMessage={<FormattedMessage id='chat_panels.main_window.empty' defaultMessage="No chats found. To start a chat, visit a user's profile." />}
        />
      </Column>
    );
  }

}
