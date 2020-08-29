import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { debounce } from 'lodash';
import LoadingIndicator from '../../components/loading_indicator';
import Column from '../ui/components/column';
import AccountAuthorizeContainer from './containers/account_authorize_container';
import { fetchFollowRequests, expandFollowRequests } from '../../actions/accounts';
import ScrollableList from '../../components/scrollable_list';

const messages = defineMessages({
  heading: { id: 'column.manage_follows', defaultMessage: 'Manage follows' },
});

const mapStateToProps = state => ({
  accountIds: state.getIn(['user_lists', 'follow_requests', 'items']),
  hasMore: !!state.getIn(['user_lists', 'follow_requests', 'next']),
});

export default @connect(mapStateToProps)
@injectIntl
class ManageFollows extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    hasMore: PropTypes.bool,
    accountIds: ImmutablePropTypes.list,
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
      <Column icon='user-times' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <ScrollableList
          scrollKey='follow_requests'
          onLoadMore={this.handleLoadMore}
          hasMore={hasMore}
          emptyMessage={emptyMessage}
        >
          {accountIds.map(id =>
            <AccountAuthorizeContainer key={id} id={id} />
          )}
        </ScrollableList>
      </Column>
    );
  }

}
