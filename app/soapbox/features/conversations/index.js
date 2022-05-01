import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { directComposeById } from 'soapbox/actions/compose';
import AccountSearch from 'soapbox/components/account_search';

import { mountConversations, unmountConversations, expandConversations } from '../../actions/conversations';
import { connectDirectStream } from '../../actions/streaming';
import { Column } from '../../components/ui';

import ConversationsListContainer from './containers/conversations_list_container';

const messages = defineMessages({
  title: { id: 'column.direct', defaultMessage: 'Direct messages' },
  searchPlaceholder: { id: 'direct.search_placeholder', defaultMessage: 'Send a message to…' },
});

export default @connect()
@injectIntl
class ConversationsTimeline extends React.PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(mountConversations());
    dispatch(expandConversations());
    this.disconnect = dispatch(connectDirectStream());
  }

  componentWillUnmount() {
    this.props.dispatch(unmountConversations());

    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  handleSuggestion = accountId => {
    this.props.dispatch(directComposeById(accountId));
  }

  handleLoadMore = maxId => {
    this.props.dispatch(expandConversations({ maxId }));
  }

  render() {
    const { intl } = this.props;

    return (
      <Column label={intl.formatMessage(messages.title)}>
        <AccountSearch
          placeholder={intl.formatMessage(messages.searchPlaceholder)}
          onSelected={this.handleSuggestion}
        />

        <ConversationsListContainer
          scrollKey='direct_timeline'
          timelineId='direct'
          onLoadMore={this.handleLoadMore}
          emptyMessage={<FormattedMessage id='empty_column.direct' defaultMessage="You don't have any direct messages yet. When you send or receive one, it will show up here." />}
        />
      </Column>
    );
  }

}
