import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { fetchUsers } from 'soapbox/actions/admin';
import { FormattedMessage } from 'react-intl';
import AccountContainer from 'soapbox/containers/account_container';
import Column from 'soapbox/features/ui/components/column';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Set as ImmutableSet, OrderedSet as ImmutableOrderedSet, is } from 'immutable';

export default @connect()
class UserIndex extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  state = {
    isLoading: true,
    filters: ImmutableSet(['local', 'active']),
    accountIds: ImmutableOrderedSet(),
    total: Infinity,
    page: 0,
  }

  clearState = () => {
    this.setState({
      isLoading: true,
      page: 0,
    });
  }

  fetchNextPage = () => {
    const { filters, page } = this.state;
    const nextPage = page + 1;

    this.props.dispatch(fetchUsers(filters, nextPage))
      .then(({ users, count }) => {
        const newIds = users.map(user => user.id);

        this.setState({
          isLoading: false,
          accountIds: this.state.accountIds.union(newIds),
          total: count,
          page: nextPage,
        });
      })
      .catch(() => {});
  }

  componentDidMount() {
    this.fetchNextPage();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!is(this.state.filters, prevState.filters) || !is(this.state.q, prevState.q)) {
      this.clearState();
      this.fetchNextPage();
    }
  }

  handleLoadMore = debounce(() => {
    this.fetchNextPage();
  }, 2000, { leading: true });

  render() {
    const { accountIds, isLoading } = this.state;
    const hasMore = accountIds.count() < this.state.total;

    const showLoading = isLoading && accountIds.isEmpty();

    return (
      <Column>
        <ScrollableList
          scrollKey='user-index'
          hasMore={hasMore}
          isLoading={isLoading}
          showLoading={showLoading}
          onLoadMore={this.handleLoadMore}
          emptyMessage={<FormattedMessage id='admin.user_index.empty' defaultMessage='No users found.' />}
        >
          {accountIds.map(id =>
            <AccountContainer key={id} id={id} withNote={false} />,
          )}
        </ScrollableList>
      </Column>
    );
  }

}
