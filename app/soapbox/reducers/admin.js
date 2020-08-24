import { ADMIN_REPORTS_FETCH_SUCCESS } from '../actions/admin';
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

const initialState = ImmutableMap({
  reports: ImmutableList(),
  report_count: 0,
});

export default function admin(state = initialState, action) {
  switch(action.type) {
  case ADMIN_REPORTS_FETCH_SUCCESS:
    return state.set('reports', fromJS(action.data.reports))
      .set('report_count', action.data.total);
  default:
    return state;
  }
};
