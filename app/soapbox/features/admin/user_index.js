import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { debounce } from 'lodash';
import LoadingIndicator from 'soapbox/components/loading_indicator';
import { fetchUsers } from 'soapbox/actions/admin';
import { FormattedMessage } from 'react-intl';
import AccountContainer from 'soapbox/containers/account_container';
import Column from 'soapbox/features/ui/components/column';
import ScrollableList from 'soapbox/components/scrollable_list';

const mapStateToProps = state => {
  return {
    accountIds: state.getIn(['admin', 'usersList']),
    hasMore: false,
  };
};

export default @connect(mapStateToProps)
class UserIndex extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.orderedSet,
    hasMore: PropTypes.bool,
    diffCount: PropTypes.number,
    isAccount: PropTypes.bool,
    unavailable: PropTypes.bool,
  };

  componentDidMount() {
    this.props.dispatch(fetchUsers({ filters: 'local,active' }));
  }

  handleLoadMore = debounce(() => {
    // if (this.props.accountId && this.props.accountId !== -1) {
    //   this.props.dispatch(expandFollowers(this.props.accountId));
    // }
  }, 300, { leading: true });

  render() {
    const { accountIds, hasMore } = this.props;

    if (!accountIds) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    }

    return (
      <Column>
        <ScrollableList
          scrollKey='user-index'
          hasMore={hasMore}
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
