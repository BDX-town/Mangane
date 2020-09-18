import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import LoadingIndicator from '../../components/loading_indicator';
import MissingIndicator from '../../components/missing_indicator';
import { fetchReblogs } from '../../actions/interactions';
import { fetchStatus } from '../../actions/statuses';
import { FormattedMessage } from 'react-intl';
import AccountContainer from '../../containers/account_container';
import Column from '../ui/components/column';
import ScrollableList from '../../components/scrollable_list';
import { makeGetStatus } from '../../selectors';

const mapStateToProps = (state, props) => {
  const getStatus = makeGetStatus();
  const status = getStatus(state, {
    id: props.params.statusId,
    username: props.params.username,
  });

  return {
    status,
    accountIds: state.getIn(['user_lists', 'reblogged_by', props.params.statusId]),
  };
};

export default @connect(mapStateToProps)
class Reblogs extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.orderedSet,
    status: ImmutablePropTypes.map,
  };

  componentDidMount() {
    this.props.dispatch(fetchReblogs(this.props.params.statusId));
    this.props.dispatch(fetchStatus(this.props.params.statusId));
  }

  componentDidUpdate(prevProps) {
    const { params } = this.props;
    if (params.statusId !== prevProps.params.statusId && params.statusId) {
      prevProps.dispatch(fetchReblogs(params.statusId));
      prevProps.dispatch(fetchStatus(params.statusId));
    }
  }

  render() {
    const { accountIds, status } = this.props;

    if (!accountIds) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    }

    if (!status) {
      return (
        <Column>
          <MissingIndicator />
        </Column>
      );
    }

    const emptyMessage = <FormattedMessage id='status.reblogs.empty' defaultMessage='No one has reposted this post yet. When someone does, they will show up here.' />;

    return (
      <Column>
        <ScrollableList
          scrollKey='reblogs'
          emptyMessage={emptyMessage}
        >
          {accountIds.map(id =>
            <AccountContainer key={id} id={id} withNote={false} />
          )}
        </ScrollableList>
      </Column>
    );
  }

}
