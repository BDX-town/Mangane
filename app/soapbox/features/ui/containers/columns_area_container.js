import { connect } from 'react-redux';

import { getSettings } from 'soapbox/actions/settings';

import ColumnsArea from '../components/columns_area';

const mapStateToProps = state => ({
  columns: getSettings(state).get('columns'),
});

export default connect(mapStateToProps, null, null, { forwardRef: true })(ColumnsArea);
