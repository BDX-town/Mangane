'use strict';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { server } from 'soapbox/msw';

// Enzyme
const adapter = new Adapter();
configure({ adapter });

// Setup MSW
// https://mswjs.io/docs/api/setup-server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
