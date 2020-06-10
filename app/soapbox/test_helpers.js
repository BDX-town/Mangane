'use strict';

import React from 'react';
import thunk from 'redux-thunk';
import renderer from 'react-test-renderer';
import { IntlProvider } from 'react-intl';
import configureMockStore from 'redux-mock-store';

// Mock Redux
// https://redux.js.org/recipes/writing-tests/
const middlewares = [thunk];
export const mockStore = configureMockStore(middlewares);

// Testing i18n components
// https://formatjs.io/docs/react-intl/testing/#helper-function-2
export const createComponentWithIntl = (children, props = { locale: 'en' }) => {
  return renderer.create(<IntlProvider {...props}>{children}</IntlProvider>);
};
