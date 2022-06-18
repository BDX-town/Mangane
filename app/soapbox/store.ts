import { configureStore } from '@reduxjs/toolkit';
import thunk, { ThunkDispatch } from 'redux-thunk';

import errorsMiddleware from './middleware/errors';
import soundsMiddleware from './middleware/sounds';
import appReducer from './reducers';

import type { AnyAction } from 'redux';

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
export type AppDispatch = ThunkDispatch<RootState, {}, AnyAction>;
