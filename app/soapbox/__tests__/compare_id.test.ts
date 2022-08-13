import compareId from '../compare_id';

test('compareId', () => {
  expect(compareId('3', '3')).toBe(0);
  expect(compareId('10', '1')).toBe(1);
  expect(compareId('99', '100')).toBe(-1);
});
