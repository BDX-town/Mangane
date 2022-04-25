import { configureStore } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';

import errorsMiddleware from './middleware/errors';
import soundsMiddleware from './middleware/sounds';
import appReducer from './reducers';

export const store = configureStore({
  reducer: appReducer,
  middleware: [
    thunk,
    errorsMiddleware(),
    soundsMiddleware(),
  ],
  devTools: true,
});

export type Store = typeof store;

// Infer the `RootState` and `AppDispatch` types from the store itself
// https://redux.js.org/usage/usage-with-typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<{}, {}, AnyAction>;
