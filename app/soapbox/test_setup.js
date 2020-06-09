'use strict';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { __clear as clearApiMocks } from 'soapbox/api';

const adapter = new Adapter();
configure({ adapter });

jest.mock('soapbox/api');
afterEach(() => clearApiMocks());

const middlewares = [thunk];
export const mockStore = configureMockStore(middlewares);
