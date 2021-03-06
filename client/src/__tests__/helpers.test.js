/* global describe test expect */
const { generateQueryParam } = require('../helpers/helpers');

describe('helpers', () => {
  describe('generateQueryParam', () => {
    test('basic functionality', () => {
      expect(generateQueryParam('key', 'value')).toBe('key=value');
    });
  });
});
