import { debounce } from 'lodash';
import { connect } from 'react-redux';

import {
  changeSearch,
  clearSearch,
  submitSearch,
  showSearch,
} from '../../../actions/search';
import Search from '../components/search';

const mapStateToProps = state => ({
  value: state.getIn(['search', 'value']),
  submitted: state.getIn(['search', 'submitted']),
});

function redirectToAccount(accountId, routerHistory) {
  return (dispatch, getState) => {
    const acct = getState().getIn(['accounts', accountId, 'acct']);

    if (acct && routerHistory) {
      routerHistory.push(`/@${acct}`);
    }
  };
}

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

    onSelected(accountId, routerHistory) {
      dispatch(clearSearch());
      dispatch(redirectToAccount(accountId, routerHistory));
    },

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
