import { showAlertForError } from '../actions/alerts';

const isFailType = type => type.endsWith('_FAIL');
const isRememberFailType = type => type.endsWith('_REMEMBER_FAIL');

const hasResponse = error => Boolean(error && error.response);

const shouldShowError = ({ type, skipAlert, error }) => {
  return !skipAlert && hasResponse(error) && isFailType(type) && !isRememberFailType(type);
};

export default function errorsMiddleware() {
  return ({ dispatch }) => next => action => {
    if (shouldShowError(action)) {
      dispatch(showAlertForError(action.error));
    }

    return next(action);
  };
}
