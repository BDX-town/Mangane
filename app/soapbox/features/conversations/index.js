import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { directComposeById } from 'soapbox/actions/compose';

import { mountConversations, unmountConversations, expandConversations } from '../../actions/conversations';
import { connectDirectStream } from '../../actions/streaming';
import { Card, CardBody, Column, Stack, Text } from '../../components/ui';

const messages = defineMessages({
  title: { id: 'column.direct', defaultMessage: 'Direct messages' },
  searchPlaceholder: { id: 'direct.search_placeholder', defaultMessage: 'Send a message to…' },
  body: { id: 'direct.body', defaultMessage: 'A new direct messaging experience will be available soon. Please stay tuned.' },
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
      <Column label={intl.formatMessage(messages.title)} transparent>
        <Card variant='rounded'>
          <CardBody>
            <Stack space={2}>
              <Text size='lg' align='center' weight='bold'>{intl.formatMessage(messages.title)}</Text>
              <Text theme='muted' align='center'>{intl.formatMessage(messages.body)}</Text>
            </Stack>
          </CardBody>
        </Card>
      </Column>
    );

    // return (
    //   <Column label={intl.formatMessage(messages.title)}>
    //     <ColumnHeader icon='envelope' active={hasUnread} title={intl.formatMessage(messages.title)} />

    //     <AccountSearch
    //       placeholder={intl.formatMessage(messages.searchPlaceholder)}
    //       onSelected={this.handleSuggestion}
    //     />

    //     <ConversationsListContainer
    //       scrollKey='direct_timeline'
    //       timelineId='direct'
    //       onLoadMore={this.handleLoadMore}
    //       emptyMessage={<FormattedMessage id='empty_column.direct' defaultMessage="You don't have any direct messages yet. When you send or receive one, it will show up here." />}
    //     />
    //   </Column>
    // );
  }

}
