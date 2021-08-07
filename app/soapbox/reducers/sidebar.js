import { SIDEBAR_OPEN, SIDEBAR_CLOSE } from '../actions/sidebar';

export default function sidebar(state={}, action) {
  switch(action.type) {
  case SIDEBAR_OPEN:
    return { sidebarOpen: true };
  case SIDEBAR_CLOSE:
    return { sidebarOpen: false };
  default:
    return state;
  }
}
