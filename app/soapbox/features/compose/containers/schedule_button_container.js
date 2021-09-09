import { connect } from 'react-redux';
import ScheduleButton from '../components/schedule_button';
import { addSchedule, removeSchedule } from '../../../actions/compose';

const mapStateToProps = state => ({
  active: state.getIn(['compose', 'schedule']) ? true : false,
});

const mapDispatchToProps = dispatch => ({

  onClick() {
    dispatch((dispatch, getState) => {
      if (getState().getIn(['compose', 'schedule'])) {
        dispatch(removeSchedule());
      } else {
        dispatch(addSchedule());
      }
    });
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleButton);
