import { connect } from 'react-redux';
import SearchResults from '../components/search_results';
import { fetchSuggestions, dismissSuggestion } from '../../../actions/suggestions';
import { expandSearch, setFilter } from '../../../actions/search';

const mapStateToProps = state => {
  return {
    value: state.getIn(['search', 'submittedValue']),
    results: state.getIn(['search', 'results']),
    suggestions: state.getIn(['suggestions', 'items']),
    submitted: state.getIn(['search', 'submitted']),
    selectedFilter: state.getIn(['search', 'filter']),
  };
};

const mapDispatchToProps = dispatch => ({
  fetchSuggestions: () => dispatch(fetchSuggestions()),
  expandSearch: type => dispatch(expandSearch(type)),
  dismissSuggestion: account => dispatch(dismissSuggestion(account.get('id'))),
  selectFilter: newActiveFilter => dispatch(setFilter(newActiveFilter)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
