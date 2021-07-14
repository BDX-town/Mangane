import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { fetchUsers } from 'soapbox/actions/admin';
import { injectIntl, defineMessages } from 'react-intl';
import AccountContainer from 'soapbox/containers/account_container';
import Column from 'soapbox/features/ui/components/column';
import ScrollableList from 'soapbox/components/scrollable_list';
import { SimpleForm, TextInput } from 'soapbox/features/forms';
import { Set as ImmutableSet, OrderedSet as ImmutableOrderedSet, is } from 'immutable';

const messages = defineMessages({
  empty: { id: 'admin.user_index.empty', defaultMessage: 'No users found.' },
  searchPlaceholder: { id: 'admin.user_index.search_input_placeholder', defaultMessage: 'Who are you looking for?' },
});

export default @connect()
@injectIntl
class UserIndex extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  state = {
    isLoading: true,
    filters: ImmutableSet(['local', 'active']),
    accountIds: ImmutableOrderedSet(),
    total: Infinity,
    pageSize: 50,
    page: 0,
    query: '',
  }

  clearState = callback => {
    this.setState({
      isLoading: true,
      accountIds: ImmutableOrderedSet(),
      page: 0,
    }, callback);
  }

  fetchNextPage = () => {
    const { filters, page, query, pageSize } = this.state;
    const nextPage = page + 1;

    this.props.dispatch(fetchUsers(filters, nextPage, query, pageSize))
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

  refresh = () => {
    this.clearState(() => {
      this.fetchNextPage();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { filters, query } = this.state;
    const filtersChanged = !is(filters, prevState.filters);
    const queryChanged = query !== prevState.query;

    if (filtersChanged || queryChanged) {
      this.refresh();
    }
  }

  handleLoadMore = debounce(() => {
    this.fetchNextPage();
  }, 2000, { leading: true });

  updateQuery = debounce(query => {
    this.setState({ query });
  }, 900)

  handleQueryChange = e => {
    this.updateQuery(e.target.value);
  };

  render() {
    const { intl } = this.props;
    const { accountIds, isLoading } = this.state;
    const hasMore = accountIds.count() < this.state.total;

    const showLoading = isLoading && accountIds.isEmpty();

    return (
      <Column>
        <SimpleForm style={{ paddingBottom: 0 }}>
          <TextInput
            value={this.state.q}
            onChange={this.handleQueryChange}
            placeholder={intl.formatMessage(messages.searchPlaceholder)}
          />
        </SimpleForm>
        <ScrollableList
          scrollKey='user-index'
          hasMore={hasMore}
          isLoading={isLoading}
          showLoading={showLoading}
          onLoadMore={this.handleLoadMore}
          emptyMessage={intl.formatMessage(messages.empty)}
        >
          {accountIds.map(id =>
            <AccountContainer key={id} id={id} withDate />,
          )}
        </ScrollableList>
      </Column>
    );
  }

}
