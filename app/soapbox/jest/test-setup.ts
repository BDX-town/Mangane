'use strict';

import '@testing-library/jest-dom/extend-expect';

import { __clear as clearApiMocks } from '../__mocks__/api';

// Polyfill structuredClone for fake-indexeddb in test environment
if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
}

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

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
