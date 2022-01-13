import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { fetchFollowRequests, expandFollowRequests } from '../../actions/accounts';
import LoadingIndicator from '../../components/loading_indicator';
import ScrollableList from '../../components/scrollable_list';
import Column from '../ui/components/column';

import AccountAuthorizeContainer from './containers/account_authorize_container';

const messages = defineMessages({
  heading: { id: 'column.follow_requests', defaultMessage: 'Follow requests' },
});

const mapStateToProps = state => ({
  accountIds: state.getIn(['user_lists', 'follow_requests', 'items']),
  hasMore: !!state.getIn(['user_lists', 'follow_requests', 'next']),
});

export default @connect(mapStateToProps)
@injectIntl
class FollowRequests extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    hasMore: PropTypes.bool,
    accountIds: ImmutablePropTypes.orderedSet,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(fetchFollowRequests());
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandFollowRequests());
  }, 300, { leading: true });

  render() {
    const { intl, accountIds, hasMore } = this.props;

    if (!accountIds) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    }

    const emptyMessage = <FormattedMessage id='empty_column.follow_requests' defaultMessage="You don't have any follow requests yet. When you receive one, it will show up here." />;

    return (
      <Column icon='user-plus' heading={intl.formatMessage(messages.heading)}>
        <ScrollableList
          scrollKey='follow_requests'
          onLoadMore={this.handleLoadMore}
          hasMore={hasMore}
          emptyMessage={emptyMessage}
        >
          {accountIds.map(id =>
            <AccountAuthorizeContainer key={id} id={id} />,
          )}
        </ScrollableList>
      </Column>
    );
  }

}
