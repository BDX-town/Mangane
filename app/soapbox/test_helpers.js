'use strict';

import React from 'react';
import thunk from 'redux-thunk';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureMockStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';

// Mock Redux
// https://redux.js.org/recipes/writing-tests/
const middlewares = [thunk];
export const mockStore = configureMockStore(middlewares);

// Test Redux connected components
export const createComponentWithStore = (children, props = { store: mockStore(ImmutableMap()) }) => {
  return renderer.create(<Provider {...props}>{children}</Provider>);
};

// Testing i18n components
// https://formatjs.io/docs/react-intl/testing/#helper-function-2
export const createComponentWithIntl = (children, props = { locale: 'en' }) => {
  return renderer.create(<IntlProvider {...props}>{children}</IntlProvider>);
};
