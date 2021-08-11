import { connect } from 'react-redux';
import StatusList from '../../../components/status_list';
import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import { makeGetStatusIds } from 'soapbox/selectors';
import { debounce } from 'lodash';
import { dequeueTimeline } from 'soapbox/actions/timelines';
import { scrollTopTimeline } from '../../../actions/timelines';

const makeMapStateToProps = () => {
  const getStatusIds = makeGetStatusIds();

  const mapStateToProps = (state, { timelineId }) => {
    const lastStatusId = state.getIn(['timelines', timelineId, 'items'], ImmutableOrderedSet()).last();

    return {
      statusIds: getStatusIds(state, { type: timelineId }),
      lastStatusId: lastStatusId,
      isLoading: state.getIn(['timelines', timelineId, 'isLoading'], true),
      isPartial: state.getIn(['timelines', timelineId, 'isPartial'], false),
      hasMore:   state.getIn(['timelines', timelineId, 'hasMore']),
      totalQueuedItemsCount: state.getIn(['timelines', timelineId, 'totalQueuedItemsCount']),
    };
  };

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDequeueTimeline(timelineId) {
    dispatch(dequeueTimeline(timelineId, ownProps.onLoadMore));
  },
  onScrollToTop: debounce(() => {
    dispatch(scrollTopTimeline(ownProps.timelineId, true));
  }, 100),
  onScroll: debounce(() => {
    dispatch(scrollTopTimeline(ownProps.timelineId, false));
  }, 100),
});

export default connect(makeMapStateToProps, mapDispatchToProps)(StatusList);
