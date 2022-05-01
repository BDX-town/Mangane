import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { Spinner } from 'soapbox/components/ui';

import {
  fetchRemovedAccounts,
  expandRemovedAccounts,
  removeRemovedAccount,
} from '../../../actions/groups';
import ScrollableList from '../../../components/scrollable_list';
import AccountContainer from '../../../containers/account_container';
import Column from '../../ui/components/column';

const messages = defineMessages({
  remove: { id: 'groups.removed_accounts', defaultMessage: 'Allow joining' },
});

const mapStateToProps = (state, { params: { id } }) => ({
  group: state.getIn(['groups', id]),
  accountIds: state.getIn(['user_lists', 'groups_removed_accounts', id, 'items']),
  hasMore: !!state.getIn(['user_lists', 'groups_removed_accounts', id, 'next']),
});

export default @connect(mapStateToProps)
@injectIntl
class GroupRemovedAccounts extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.orderedSet,
    hasMore: PropTypes.bool,
  };

  componentDidMount() {
    const { params: { id } } = this.props;

    this.props.dispatch(fetchRemovedAccounts(id));
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.id !== prevProps.params.id) {
      this.props.dispatch(fetchRemovedAccounts(this.props.params.id));
    }
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandRemovedAccounts(this.props.params.id));
  }, 300, { leading: true });

  handleOnActionClick = (group, id) => {
    return () => {
      this.props.dispatch(removeRemovedAccount(group.get('id'), id));
    };
  }

  render() {
    const { accountIds, hasMore, group, intl } = this.props;

    if (!group || !accountIds) {
      return (
        <Column>
          <Spinner />
        </Column>
      );
    }

    return (
      <Column>
        <ScrollableList
          scrollKey='removed_accounts'
          hasMore={hasMore}
          onLoadMore={this.handleLoadMore}
          emptyMessage={<FormattedMessage id='group.removed_accounts.empty' defaultMessage='This group does not has any removed accounts.' />}
        >
          {accountIds.map(id => (<AccountContainer
            key={id}
            id={id}
            actionIcon={require('@tabler/icons/icons/x.svg')}
            onActionClick={this.handleOnActionClick(group, id)}
            actionTitle={intl.formatMessage(messages.remove)}
          />))}
        </ScrollableList>
      </Column>
    );
  }

}
