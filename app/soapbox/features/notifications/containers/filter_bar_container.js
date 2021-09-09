import { connect } from 'react-redux';
import FilterBar from '../components/filter_bar';
import { setFilter } from '../../../actions/notifications';
import { getSettings } from 'soapbox/actions/settings';
import { getFeatures } from 'soapbox/utils/features';

const makeMapStateToProps = state => {
  const settings = getSettings(state);
  const instance = state.get('instance');
  const features = getFeatures(instance);

  return {
    selectedFilter: settings.getIn(['notifications', 'quickFilter', 'active']),
    advancedMode:   settings.getIn(['notifications', 'quickFilter', 'advanced']),
    supportsEmojiReacts: features.emojiReacts,
  };
};

const mapDispatchToProps = (dispatch) => ({
  selectFilter(newActiveFilter) {
    dispatch(setFilter(newActiveFilter));
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(FilterBar);
