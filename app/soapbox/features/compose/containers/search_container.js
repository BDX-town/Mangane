import { connect } from 'react-redux';
import {
  changeSearch,
  clearSearch,
  submitSearch,
  showSearch,
} from '../../../actions/search';
import Search from '../components/search';
import { debounce } from 'lodash';

const mapStateToProps = state => ({
  value: state.getIn(['search', 'value']),
  submitted: state.getIn(['search', 'submitted']),
});

const mapDispatchToProps = (dispatch, { autoSubmit }) => {

  const debouncedSubmit = debounce(() => {
    dispatch(submitSearch());
  }, 900);

  return {
    onChange(value) {
      dispatch(changeSearch(value));

      if (autoSubmit) {
        debouncedSubmit();
      }
    },

    onClear() {
      dispatch(clearSearch());
    },

    onSubmit() {
      dispatch(submitSearch());
    },

    onShow() {
      dispatch(showSearch());
    },

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
