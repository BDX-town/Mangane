import { connect } from 'react-redux';

import { toggleStatusReport } from '../../../actions/reports';
import StatusCheckBox from '../components/status_check_box';

const mapStateToProps = (state, { id }) => ({
  status: state.getIn(['statuses', id]),
  checked: state.reports.new.status_ids.includes(id),
});

const mapDispatchToProps = (dispatch, { id }) => ({

  onToggle(e) {
    dispatch(toggleStatusReport(id, e.target.checked));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(StatusCheckBox);
