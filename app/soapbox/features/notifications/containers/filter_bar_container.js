import { connect } from 'react-redux';
import FilterBar from '../components/filter_bar';
import { setFilter } from '../../../actions/notifications';
import { getSettings } from 'soapbox/actions/settings';

const makeMapStateToProps = state => {
  const settings = getSettings(state);
  return {
    selectedFilter: settings.getIn(['notifications', 'quickFilter', 'active']),
    advancedMode:   settings.getIn(['notifications', 'quickFilter', 'advanced']),
  };
};

const mapDispatchToProps = (dispatch) => ({
  selectFilter(newActiveFilter) {
    dispatch(setFilter(newActiveFilter));
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(FilterBar);
