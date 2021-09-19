import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import appReducer from '../reducers';
import errorsMiddleware from '../middleware/errors';
import soundsMiddleware from '../middleware/sounds';

export default function configureStore() {
  return createStore(appReducer, compose(applyMiddleware(
    thunk,
    errorsMiddleware(),
    soundsMiddleware(),
  ), window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f));
}
