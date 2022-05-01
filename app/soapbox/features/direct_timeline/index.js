import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { directComposeById } from 'soapbox/actions/compose';
import AccountSearch from 'soapbox/components/account_search';

import { connectDirectStream } from '../../actions/streaming';
import { expandDirectTimeline } from '../../actions/timelines';
import ColumnHeader from '../../components/column_header';
import { Column } from '../../components/ui';
import StatusListContainer from '../ui/containers/status_list_container';

const messages = defineMessages({
  title: { id: 'column.direct', defaultMessage: 'Direct messages' },
  searchPlaceholder: { id: 'direct.search_placeholder', defaultMessage: 'Send a message to…' },
});

const mapStateToProps = state => ({
  hasUnread: state.getIn(['timelines', 'direct', 'unread']) > 0,
});

export default @connect(mapStateToProps)
@injectIntl
class DirectTimeline extends React.PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(expandDirectTimeline());
    this.disconnect = dispatch(connectDirectStream());
  }

  componentWillUnmount() {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  handleSuggestion = accountId => {
    this.props.dispatch(directComposeById(accountId));
  }

  handleLoadMore = maxId => {
    this.props.dispatch(expandDirectTimeline({ maxId }));
  }

  render() {
    const { intl, hasUnread } = this.props;

    return (
      <Column label={intl.formatMessage(messages.title)} transparent>
        <ColumnHeader
          icon='envelope'
          active={hasUnread}
          title={intl.formatMessage(messages.title)}
          onPin={this.handlePin}
        />

        <AccountSearch
          placeholder={intl.formatMessage(messages.searchPlaceholder)}
          onSelected={this.handleSuggestion}
        />

        <StatusListContainer
          scrollKey='direct_timeline'
          timelineId='direct'
          onLoadMore={this.handleLoadMore}
          emptyMessage={<FormattedMessage id='empty_column.direct' defaultMessage="You don't have any direct messages yet. When you send or receive one, it will show up here." />}
          divideType='space'
        />
      </Column>
    );
  }

}
