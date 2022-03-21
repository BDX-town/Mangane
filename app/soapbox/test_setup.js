'use strict';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { __clear as clearApiMocks } from 'soapbox/api';

// Enzyme
const adapter = new Adapter();
configure({ adapter });

// API mocking
jest.mock('soapbox/api');
afterEach(() => clearApiMocks());

jest.mock('uuid', () => ({ v4: jest.fn(() => 1) }));
