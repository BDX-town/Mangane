import { connect } from 'react-redux';
import SearchResults from '../components/search_results';
import { fetchSuggestions, dismissSuggestion } from '../../../actions/suggestions';
import { expandSearch } from '../../../actions/search';

const mapStateToProps = state => {
  return {
    results: state.getIn(['search', 'results']),
    suggestions: state.getIn(['suggestions', 'items']),
    submitted: state.getIn(['search', 'submitted']),
  };
};

const mapDispatchToProps = dispatch => ({
  fetchSuggestions: () => dispatch(fetchSuggestions()),
  expandSearch: type => dispatch(expandSearch(type)),
  dismissSuggestion: account => dispatch(dismissSuggestion(account.get('id'))),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
