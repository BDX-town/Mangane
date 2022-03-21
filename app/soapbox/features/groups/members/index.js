import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { Spinner } from 'soapbox/components/ui';

import {
  fetchMembers,
  expandMembers,
} from '../../../actions/groups';
import ScrollableList from '../../../components/scrollable_list';
import AccountContainer from '../../../containers/account_container';
import Column from '../../ui/components/column';

const mapStateToProps = (state, { params: { id } }) => ({
  group: state.getIn(['groups', id]),
  accountIds: state.getIn(['user_lists', 'groups', id, 'items']),
  hasMore: !!state.getIn(['user_lists', 'groups', id, 'next']),
});

export default @connect(mapStateToProps)
class GroupMembers extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.orderedSet,
    hasMore: PropTypes.bool,
  };

  componentDidMount() {
    const { params: { id } } = this.props;

    this.props.dispatch(fetchMembers(id));
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.id !== prevProps.params.id) {
      this.props.dispatch(fetchMembers(this.props.params.id));
    }
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandMembers(this.props.params.id));
  }, 300, { leading: true });

  render() {
    const { accountIds, hasMore, group } = this.props;

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
          scrollKey='members'
          hasMore={hasMore}
          onLoadMore={this.handleLoadMore}
          emptyMessage={<FormattedMessage id='group.members.empty' defaultMessage='This group does not has any members.' />}
        >
          {accountIds.map(id => <AccountContainer key={id} id={id} withNote={false} />)}
        </ScrollableList>
      </Column>
    );
  }

}
