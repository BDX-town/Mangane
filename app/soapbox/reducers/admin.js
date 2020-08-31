import { ADMIN_REPORTS_FETCH_SUCCESS } from '../actions/admin';
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

const initialState = ImmutableMap({
  reports: ImmutableList(),
  open_report_count: 0,
});

export default function admin(state = initialState, action) {
  switch(action.type) {
  case ADMIN_REPORTS_FETCH_SUCCESS:
    if (action.params && action.params.state === 'open') {
      return state
        .set('reports', fromJS(action.data.reports))
        .set('open_report_count', action.data.total);
    } else {
      return state.set('reports', fromJS(action.data.reports));
    }
  default:
    return state;
  }
};
