'use strict';

import React from 'react';
import thunk from 'redux-thunk';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import rootReducer from 'soapbox/reducers';

// Mock Redux
// https://redux.js.org/recipes/writing-tests/
const middlewares = [thunk];
export const mockStore = configureMockStore(middlewares);

// Create test component with i18n and Redux store, etc
export const createComponent = (children, props = {}) => {
  props = ImmutableMap({
    locale: 'en',
    store: mockStore(rootReducer(ImmutableMap(), {})),
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
