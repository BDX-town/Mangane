'use strict';

import { __clear as clearApiMocks } from '../__mocks__/api';

// API mocking
jest.mock('soapbox/api');
afterEach(() => clearApiMocks());

// Mock IndexedDB
// https://dev.to/andyhaskell/testing-your-indexeddb-code-with-jest-2o17
require('fake-indexeddb/auto');

// Mock external dependencies
jest.mock('uuid', () => ({ v4: jest.fn(() => '1') }));

const intersectionObserverMock = () => ({ observe: () => null, disconnect: () => null });
window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);
