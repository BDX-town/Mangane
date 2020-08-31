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
  fetchFollowers,
  expandFollowers,
} from '../../actions/accounts';

const messages = defineMessages({
  heading: { id: 'column.manage_followers', defaultMessage: 'Manage followers' },
  remove: { id: 'column.manage_followers.remove', defaultMessage: 'Remove' },
});

const mapStateToProps = state => {
  const accountId = state.get('me');

  return {
    accountId,
    accountIds: state.getIn(['user_lists', 'followers', accountId, 'items']),
    hasMore: !!state.getIn(['user_lists', 'followers', accountId, 'next']),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class ManageFollowers extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    hasMore: PropTypes.bool,
    accountIds: ImmutablePropTypes.list,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { accountId } = this.props;
    this.props.dispatch(fetchFollowers(accountId));
  }

  componentDidUpdate(prevProps) {
    const { accountId } = this.props;
    this.props.dispatch(fetchFollowers(accountId));
  }

  handleLoadMore = debounce(() => {
    const { accountId } = this.props;
    this.props.dispatch(expandFollowers(accountId));
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

    const emptyMessage = <FormattedMessage id='empty_column.followers' defaultMessage="You don't have any followers yet. When you do, they will show up here." />;

    return (
      <Column icon='users' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <ScrollableList
          scrollKey='followers'
          onLoadMore={this.handleLoadMore}
          hasMore={hasMore}
          emptyMessage={emptyMessage}
        >
          {accountIds && accountIds.map(id =>
            (
              <AccountContainer key={id} id={id} withNote={false} />
            )
          )}
        </ScrollableList>
      </Column>
    );
  }

}
