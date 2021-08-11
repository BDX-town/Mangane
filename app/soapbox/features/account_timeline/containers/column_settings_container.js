import { connect } from 'react-redux';
import ColumnSettings from '../components/column_settings';
import { getSettings, changeSetting } from '../../../actions/settings';

const mapStateToProps = state => ({
  settings: getSettings(state).get('account_timeline'),
});

const mapDispatchToProps = (dispatch) => {
  return {
    onChange(key, checked) {
      dispatch(changeSetting(['account_timeline', ...key], checked));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ColumnSettings);
