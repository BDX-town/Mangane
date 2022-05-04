import { connect } from 'react-redux';

import { addSchedule, removeSchedule } from '../../../actions/compose';
import ScheduleButton from '../components/schedule_button';

const mapStateToProps = state => ({
  active: state.getIn(['compose', 'schedule']) ? true : false,
  unavailable: !!state.getIn(['compose', 'id']),
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
