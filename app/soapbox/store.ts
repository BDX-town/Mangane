import { configureStore } from '@reduxjs/toolkit';
import { Map as ImmutableMap } from 'immutable';
import thunk, { ThunkDispatch } from 'redux-thunk';

import errorsMiddleware from './middleware/errors';
import soundsMiddleware from './middleware/sounds';
import { installAccountPurgeListener } from './persistence/cross-tab';
import { needsAccountPurge } from './persistence/lifecycle';
import { purgeAccountScope, resumePendingPurges } from './persistence/purge';
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

void resumePendingPurges(accountUrl => {
  store.dispatch({
    type: 'AUTH_LOGGED_OUT',
    account: ImmutableMap({ url: accountUrl }),
    standalone: false,
  });
}, {}, accountUrl => store.getState().auth.getIn(['users', accountUrl, 'access_token']));

installAccountPurgeListener((accountUrl, generation) => {
  if (!needsAccountPurge(accountUrl, generation)) return;
  const account = store.getState().auth.getIn(['users', accountUrl]);
  const accessToken = account?.get('access_token');
  void purgeAccountScope({ accountUrl, accessToken, propagate: false }, {
    remoteRevocation: async() => undefined,
    localLogout: () => {
      if (!account) return;
      store.dispatch({ type: 'AUTH_LOGGED_OUT', account, standalone: false });
    },
  });
});

export type Store = typeof store;

// Infer the `RootState` and `AppDispatch` types from the store itself
// https://redux.js.org/usage/usage-with-typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, {}, AnyAction>;
