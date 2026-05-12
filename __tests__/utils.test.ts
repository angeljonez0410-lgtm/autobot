import { sum } from '../src/lib/utils';

test('sum adds two numbers', () => {
  expect(sum(1, 2)).toBe(3);
});
