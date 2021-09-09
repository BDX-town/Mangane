import { connect } from 'react-redux';
import ScheduleForm from '../components/schedule_form';
import { setSchedule } from '../../../actions/compose';

const mapStateToProps = state => ({
  schedule: state.getIn(['compose', 'schedule']),
  active: state.getIn(['compose', 'schedule']) ? true : false,
});

const mapDispatchToProps = dispatch => ({
  onSchedule(date) {
    dispatch(setSchedule(date));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleForm);
