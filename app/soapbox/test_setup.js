'use strict';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { __clear as clearApiMocks } from 'soapbox/api';

const adapter = new Adapter();
configure({ adapter });

jest.mock('soapbox/api');
afterEach(() => clearApiMocks());
