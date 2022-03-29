import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import MissingIndicator from 'soapbox/components/missing_indicator';

import { fetchPinnedStatuses } from '../../actions/pin_statuses';
import StatusList from '../../components/status_list';
import Column from '../ui/components/column';

const messages = defineMessages({
  heading: { id: 'column.pins', defaultMessage: 'Pinned posts' },
});

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
    const { intl, statusIds, hasMore, isMyAccount } = this.props;

    if (!isMyAccount) {
      return (
        <MissingIndicator />
      );
    }

    return (
      <Column label={intl.formatMessage(messages.heading)}>
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
