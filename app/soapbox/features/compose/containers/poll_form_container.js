import { connect } from 'react-redux';

import { addPollOption, removePollOption, changePollOption, changePollSettings, removePoll } from '../../../actions/compose';
import {
  clearComposeSuggestions,
  fetchComposeSuggestions,
  selectComposeSuggestion,
} from '../../../actions/compose';
import PollForm from '../components/poll_form';

const mapStateToProps = state => ({
  suggestions: state.getIn(['compose', 'suggestions']),
  options: state.getIn(['compose', 'poll', 'options']),
  expiresIn: state.getIn(['compose', 'poll', 'expires_in']),
  isMultiple: state.getIn(['compose', 'poll', 'multiple']),
});

const mapDispatchToProps = dispatch => ({
  onAddOption(title) {
    dispatch(addPollOption(title));
  },

  onRemoveOption(index) {
    dispatch(removePollOption(index));
  },

  onChangeOption(index, title) {
    dispatch(changePollOption(index, title));
  },

  onChangeSettings(expiresIn, isMultiple) {
    dispatch(changePollSettings(expiresIn, isMultiple));
  },

  onClearSuggestions() {
    dispatch(clearComposeSuggestions());
  },

  onFetchSuggestions(token) {
    dispatch(fetchComposeSuggestions(token));
  },

  onSuggestionSelected(position, token, accountId, path) {
    dispatch(selectComposeSuggestion(position, token, accountId, path));
  },

  onRemovePoll() {
    dispatch(removePoll());
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(PollForm);
