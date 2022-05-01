import { showAlertForError } from '../actions/alerts';

import type { AnyAction } from 'redux';
import type { ThunkMiddleware } from 'redux-thunk';

/** Whether the action is considered a failure. */
const isFailType = (type: string): boolean => type.endsWith('_FAIL');

/** Whether the action is a failure to fetch from browser storage. */
const isRememberFailType = (type: string): boolean => type.endsWith('_REMEMBER_FAIL');

/** Whether the error contains an Axios response. */
const hasResponse = (error: any): boolean => Boolean(error && error.response);

/** Whether the error should be shown to the user. */
const shouldShowError = ({ type, skipAlert, error }: AnyAction): boolean => {
  return !skipAlert && hasResponse(error) && isFailType(type) && !isRememberFailType(type);
};

/** Middleware to display Redux errors to the user. */
export default function errorsMiddleware(): ThunkMiddleware {
  return ({ dispatch }) => next => action => {
    if (shouldShowError(action)) {
      dispatch(showAlertForError(action.error));
    }

    return next(action);
  };
}
