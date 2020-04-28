import { connect } from 'react-redux';
import ColumnSettings from '../components/column_settings';
import { getSettings, changeSetting } from '../../../actions/settings';

const mapStateToProps = state => ({
  settings: getSettings(state).get('public'),
});

const mapDispatchToProps = (dispatch) => {
  return {
    onChange(key, checked) {
      dispatch(changeSetting(['public', ...key], checked));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ColumnSettings);
