import { composeWithDevTools } from '@redux-devtools/extension';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import errorsMiddleware from '../middleware/errors';
import soundsMiddleware from '../middleware/sounds';
import appReducer from '../reducers';

export default function configureStore() {
  return createStore(
    appReducer,
    composeWithDevTools(
      applyMiddleware(
        thunk,
        errorsMiddleware(),
        soundsMiddleware(),
      ),
    ),
  );
}
