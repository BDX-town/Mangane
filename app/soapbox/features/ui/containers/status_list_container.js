import { connect } from 'react-redux';
import StatusList from '../../../components/status_list';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import { createSelector } from 'reselect';
import { debounce } from 'lodash';
import { dequeueTimeline } from 'soapbox/actions/timelines';
import { scrollTopTimeline } from '../../../actions/timelines';
import { getSettings } from 'soapbox/actions/settings';

const makeGetStatusIds = () => createSelector([
  (state, { type }) => getSettings(state).get(type, ImmutableMap()),
  (state, { type }) => state.getIn(['timelines', type, 'items'], ImmutableList()),
  (state)           => state.get('statuses'),
  (state)           => state.get('me'),
], (columnSettings, statusIds, statuses, me) => {
  return statusIds.filter(id => {
    if (id === null) return true;

    const statusForId = statuses.get(id);
    let showStatus    = true;

    if (columnSettings.getIn(['shows', 'reblog']) === false) {
      showStatus = showStatus && statusForId.get('reblog') === null;
    }

    if (columnSettings.getIn(['shows', 'reply']) === false) {
      showStatus = showStatus && (statusForId.get('in_reply_to_id') === null);
    }

    if (columnSettings.getIn(['shows', 'direct']) === false) {
      showStatus = showStatus && (statusForId.get('visibility') !== 'direct');
    }

    return showStatus;
  });
});

const mapStateToProps = (state, { timelineId }) => {
  const getStatusIds = makeGetStatusIds();

  const queuedItems = state.getIn(['timelines', timelineId, 'queuedItems'], ImmutableList());
  console.log('queuedItems:', queuedItems);

  const filteredQueuedItems = queuedItems.filter((id) => getStatusIds(state, { type: timelineId }).includes(id));
  console.log('filteredQueuedItems:', filteredQueuedItems);

  const filteredQueuedItemsCount = filteredQueuedItems.count();
  console.log('filteredQueuedItemsCount:', filteredQueuedItemsCount);

  return {
    statusIds: getStatusIds(state, { type: timelineId }),
    isLoading: state.getIn(['timelines', timelineId, 'isLoading'], true),
    isPartial: state.getIn(['timelines', timelineId, 'isPartial'], false),
    hasMore:   state.getIn(['timelines', timelineId, 'hasMore']),
    totalQueuedItemsCount: filteredQueuedItemsCount,
  };
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

export default connect(mapStateToProps, mapDispatchToProps)(StatusList);
