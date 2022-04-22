import { connect } from 'react-redux';

import { getSettings, changeSetting } from '../../../actions/settings';
import ColumnSettings from '../components/column_settings';

const mapStateToProps = state => ({
  settings: getSettings(state).get('community'),
});

const mapDispatchToProps = (dispatch) => {
  return {
    onChange(key, checked) {
      dispatch(changeSetting(['community', ...key], checked));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ColumnSettings);
