import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import ScrollableList from 'soapbox/components/scrollable_list';

import { fetchScheduledStatuses, expandScheduledStatuses } from '../../actions/scheduled_statuses';
import Column from '../ui/components/column';

import ScheduledStatus from './components/scheduled_status';

const messages = defineMessages({
  heading: { id: 'column.scheduled_statuses', defaultMessage: 'Scheduled Posts' },
});

const mapStateToProps = state => ({
  statusIds: state.getIn(['status_lists', 'scheduled_statuses', 'items']),
  isLoading: state.getIn(['status_lists', 'scheduled_statuses', 'isLoading'], true),
  hasMore: !!state.getIn(['status_lists', 'scheduled_statuses', 'next']),
});

export default @connect(mapStateToProps)
@injectIntl
class ScheduledStatuses extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.orderedSet.isRequired,
    intl: PropTypes.object.isRequired,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchScheduledStatuses());
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandScheduledStatuses());
  }, 300, { leading: true })


  render() {
    const { intl, statusIds, hasMore, isLoading } = this.props;
    const emptyMessage = <FormattedMessage id='empty_column.scheduled_statuses' defaultMessage="You don't have any scheduled statuses yet. When you add one, it will show up here." />;

    return (
      <Column icon='calendar' label={intl.formatMessage(messages.heading)}>
        <ScrollableList
          scrollKey='scheduled_statuses'
          emptyMessage={emptyMessage}
          isLoading={isLoading}
          hasMore={hasMore}
        >
          {statusIds.map(id => <ScheduledStatus key={id} statusId={id} />)}
        </ScrollableList>
      </Column>
    );
  }

}
