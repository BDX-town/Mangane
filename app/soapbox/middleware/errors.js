import { showAlertForError } from '../actions/alerts';

const isFailType = type => type.endsWith('_FAIL');
const isRememberFailType = type => type.endsWith('_REMEMBER_FAIL');

const shouldShowError = ({ type, skipAlert }) => {
  return !skipAlert && isFailType(type) && !isRememberFailType(type);
};

export default function errorsMiddleware() {
  return ({ dispatch }) => next => action => {
    if (shouldShowError(action)) {
      dispatch(showAlertForError(action.error));
    }

    return next(action);
  };
}
