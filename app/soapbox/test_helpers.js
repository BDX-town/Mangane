'use strict';

import { mount } from 'enzyme';
import { Map as ImmutableMap } from 'immutable';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import rootReducer from 'soapbox/reducers';

export const rootState = rootReducer(undefined, {});
export const getState = () => rootState;

// Mock Redux
// https://redux.js.org/recipes/writing-tests/
const middlewares = [thunk];
export const mockStore = configureMockStore(middlewares);

// Create test component with i18n and Redux store, etc
export const createComponent = (children, props = {}) => {
  props = ImmutableMap({
    locale: 'en',
    store: mockStore(rootState),
  }).merge(props);

  return renderer.create(
    <Provider store={props.get('store')}>
      <IntlProvider locale={props.get('locale')}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </IntlProvider>
    </Provider>,
  );
};

export const createShallowComponent = (children, props = {}, routerProps = {}) => {
  props = ImmutableMap({
    locale: 'en',
    store: mockStore(rootReducer(ImmutableMap(), {})),
  }).merge(props);

  return mount(
    <Provider store={props.get('store')}>
      <IntlProvider locale={props.get('locale')}>
        <MemoryRouter {...routerProps}>
          {children}
        </MemoryRouter>
      </IntlProvider>
    </Provider>,
  );
};

// Apply actions to the state, one at a time
export const applyActions = (state, actions, reducer) => {
  return actions.reduce((state, action) => reducer(state, action), state);
};
