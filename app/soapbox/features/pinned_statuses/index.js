import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { fetchPinnedStatuses } from '../../actions/pin_statuses';
import Column from '../ui/components/column';
import StatusList from '../../components/status_list';
import { injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import MissingIndicator from 'soapbox/components/missing_indicator';

const mapStateToProps = (state, { params }) => {
  const username = params.username || '';
  const me = state.get('me');
  const meUsername = state.getIn(['accounts', me, 'username'], '');
  return {
    isMyAccount: (username.toLowerCase() === meUsername.toLowerCase()),
    statusIds: state.getIn(['status_lists', 'pins', 'items']),
    hasMore: !!state.getIn(['status_lists', 'pins', 'next']),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class PinnedStatuses extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.orderedSet.isRequired,
    intl: PropTypes.object.isRequired,
    hasMore: PropTypes.bool.isRequired,
    isMyAccount: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(fetchPinnedStatuses());
  }

  render() {
    const { statusIds, hasMore, isMyAccount } = this.props;

    if (!isMyAccount) {
      return (
        <Column>
          <MissingIndicator />
        </Column>
      );
    }

    return (
      <Column>
        <StatusList
          statusIds={statusIds}
          scrollKey='pinned_statuses'
          hasMore={hasMore}
          emptyMessage={<FormattedMessage id='pinned_statuses.none' defaultMessage='No pins to show.' />}
        />
      </Column>
    );
  }

}
