import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import { fetchChats, launchChat } from 'soapbox/actions/chats';
import AudioToggle from 'soapbox/features/chats/components/audio_toggle';
import AccountSearch from 'soapbox/components/account_search';
import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';
import ChatList from './components/chat_list';

const messages = defineMessages({
  title: { id: 'column.chats', defaultMessage: 'Chats' },
  searchPlaceholder: { id: 'chats.search_placeholder', defaultMessage: 'Start a chat with…' },
});

export default @connect()
@injectIntl
class ChatIndex extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  handleSuggestion = accountId => {
    this.props.dispatch(launchChat(accountId, this.context.router.history, true));
  }

  handleClickChat = (chat) => {
    this.context.router.history.push(`/chats/${chat.get('id')}`);
  }

  handleRefresh = () => {
    const { dispatch } = this.props;
    return dispatch(fetchChats());
  }

  render() {
    const { intl } = this.props;

    return (
      <Column label={intl.formatMessage(messages.title)}>
        <ColumnHeader
          icon='comment'
          title={intl.formatMessage(messages.title)}
        />

        <div className='column__switch'>
          <AudioToggle />
        </div>

        <AccountSearch
          placeholder={intl.formatMessage(messages.searchPlaceholder)}
          onSelected={this.handleSuggestion}
        />

        <ChatList
          onClickChat={this.handleClickChat}
          onRefresh={this.handleRefresh}
        />
      </Column>
    );
  }

}
