import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { debounce } from 'lodash';
import LoadingIndicator from '../../components/loading_indicator';
import Column from '../ui/components/column';
import AccountContainer from '../../containers/account_container';
import ScrollableList from '../../components/scrollable_list';
import {
  fetchFollowing,
  expandFollowing,
} from '../../actions/accounts';

const messages = defineMessages({
  heading: { id: 'column.manage_follows', defaultMessage: 'Manage who you follow' },
});

const mapStateToProps = state => {
  const accountId = state.get('me');

  return {
    accountId,
    accountIds: state.getIn(['user_lists', 'following', accountId, 'items']),
    hasMore: !!state.getIn(['user_lists', 'following', accountId, 'next']),
  };
};

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
    const { accountId } = this.props;
    this.props.dispatch(fetchFollowing(accountId));
  }

  componentDidUpdate(prevProps) {
    const { accountId } = this.props;
    this.props.dispatch(fetchFollowing(accountId));
  }

  handleLoadMore = debounce(() => {
    const { accountId } = this.props;
    this.props.dispatch(expandFollowing(accountId));
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

    const emptyMessage = <FormattedMessage id='empty_column.follows' defaultMessage="You don't follow anyone yet. When you do, they will show up here." />;

    return (
      <Column icon='user-times' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <ScrollableList
          scrollKey='following'
          onLoadMore={this.handleLoadMore}
          hasMore={hasMore}
          emptyMessage={emptyMessage}
        >
          {accountIds && accountIds.map(id =>
            <AccountContainer key={id} id={id} withNote={false} />
          )}
        </ScrollableList>
      </Column>
    );
  }

}
