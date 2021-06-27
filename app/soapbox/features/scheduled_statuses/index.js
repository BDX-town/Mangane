import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Column from '../ui/components/column';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import StatusList from '../../components/status_list';
import { fetchScheduledStatuses, expandScheduledStatuses } from '../../actions/scheduled_statuses';
import { debounce } from 'lodash';

const messages = defineMessages({
  heading: { id: 'column.scheduled_statuses', defaultMessage: 'Scheduled Statuses' },
});

const mapStateToProps = state => ({
  statusIds: state.getIn(['status_lists', 'scheduled_statuses', 'items']),
  isLoading: state.getIn(['status_lists', 'scheduled_statuses', 'isLoading'], true),
  hasMore: !!state.getIn(['status_lists', 'scheduled_statuses', 'next']),
});

export default @connect(mapStateToProps)
@injectIntl
class ScheduledStatuses extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    shouldUpdateScroll: PropTypes.func,
    statusIds: ImmutablePropTypes.list.isRequired,
    intl: PropTypes.object.isRequired,
    columnId: PropTypes.string,
    multiColumn: PropTypes.bool,
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
    const { intl, shouldUpdateScroll, statusIds, columnId, multiColumn, hasMore, isLoading } = this.props;
    const pinned = !!columnId;

    const emptyMessage = <FormattedMessage id='empty_column.scheduled_statuses' defaultMessage="You don't have any scheduled statuses yet. When you add one, it will show up here." />;

    return (
      <Column icon='edit' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <StatusList
          trackScroll={!pinned}
          statusIds={statusIds}
          scrollKey={`scheduled_statuses-${columnId}`}
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={this.handleLoadMore}
          shouldUpdateScroll={shouldUpdateScroll}
          emptyMessage={emptyMessage}
          bindToDocument={!multiColumn}
        />
      </Column>
    );
  }

}
