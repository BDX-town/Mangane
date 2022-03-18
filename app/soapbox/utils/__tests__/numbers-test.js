import { isIntegerId } from '../numbers';

test('isIntegerId()', () => {
  expect(isIntegerId('0')).toBe(true);
  expect(isIntegerId('1')).toBe(true);
  expect(isIntegerId('508107650')).toBe(true);
  expect(isIntegerId('-1764036199')).toBe(true);
  expect(isIntegerId('106801667066418367')).toBe(true);
  expect(isIntegerId('9v5bmRalQvjOy0ECcC')).toBe(false);
  expect(isIntegerId(null)).toBe(false);
  expect(isIntegerId(undefined)).toBe(false);
  expect(isIntegerId()).toBe(false);
});
