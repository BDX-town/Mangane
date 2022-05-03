import { render, RenderOptions } from '@testing-library/react';
import { merge } from 'immutable';
import React, { FC, ReactElement } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Action, applyMiddleware, createStore } from 'redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';

import NotificationsContainer from '../features/ui/containers/notifications_container';
import { default as rootReducer } from '../reducers';

// Mock Redux
// https://redux.js.org/recipes/writing-tests/
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let rootState = rootReducer(undefined, {} as Action);

// Apply actions to the state, one at a time
const applyActions = (state: any, actions: any, reducer: any) => {
  return actions.reduce((state: any, action: any) => reducer(state, action), state);
};

const createTestStore = (initialState: any) => createStore(rootReducer, initialState, applyMiddleware(thunk));

const TestApp: FC<any> = ({ children, storeProps, routerProps = {} }) => {
  let store: any;

  if (storeProps) {
    rootState = merge(rootState, storeProps);
    store = createTestStore(rootState);
  } else {
    store = createTestStore(rootState);
  }

  const props = {
    locale: 'en',
    store,
  };

  return (
    <Provider store={props.store}>
      <IntlProvider locale={props.locale}>
        <MemoryRouter {...routerProps}>
          {children}

          <NotificationsContainer />
        </MemoryRouter>
      </IntlProvider>
    </Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
  store?: any,
  routerProps?: any,
) => render(ui, {
  wrapper: () => <TestApp children={ui} storeProps={store} routerProps={routerProps} />,
  ...options,
});

const mockWindowProperty = (property: any, value: any) => {
  const { [property]: originalProperty } = window;
  delete window[property];

  beforeAll(() => {
    Object.defineProperty(window, property, {
      configurable: true,
      writable: true,
      value,
    });
  });

  afterAll(() => {
    window[property] = originalProperty;
  });
};

export * from '@testing-library/react';
export {
  customRender as render,
  mockStore,
  applyActions,
  rootState,
  rootReducer,
  mockWindowProperty,
  createTestStore,
};
