import { connect } from 'react-redux';

import { fetchTrendingStatuses } from 'soapbox/actions/trending_statuses';
import { getFeatures } from 'soapbox/utils/features';

import { expandSearch, setFilter } from '../../../actions/search';
import { fetchSuggestions, dismissSuggestion } from '../../../actions/suggestions';
import SearchResults from '../components/search_results';

const mapStateToProps = state => {
  const instance = state.get('instance');

  return {
    value: state.getIn(['search', 'submittedValue']),
    results: state.getIn(['search', 'results']),
    suggestions: state.getIn(['suggestions', 'items']),
    trendingStatuses: state.getIn(['trending_statuses', 'items']),
    trends: state.getIn(['trends', 'items']),
    submitted: state.getIn(['search', 'submitted']),
    selectedFilter: state.getIn(['search', 'filter']),
    features: getFeatures(instance),
  };
};

const mapDispatchToProps = dispatch => ({
  fetchSuggestions: () => dispatch(fetchSuggestions()),
  fetchTrendingStatuses: () => dispatch(fetchTrendingStatuses()),
  expandSearch: type => dispatch(expandSearch(type)),
  dismissSuggestion: account => dispatch(dismissSuggestion(account.get('id'))),
  selectFilter: newActiveFilter => dispatch(setFilter(newActiveFilter)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
