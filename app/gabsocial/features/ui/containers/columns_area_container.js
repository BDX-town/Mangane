import { connect } from 'react-redux';
import ColumnsArea from '../components/columns_area';
import { getSettings } from 'gabsocial/actions/settings';

const mapStateToProps = state => ({
  columns: getSettings(state).get('columns'),
});

export default connect(mapStateToProps, null, null, { forwardRef: true })(ColumnsArea);
