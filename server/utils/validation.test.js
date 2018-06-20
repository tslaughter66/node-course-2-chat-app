const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    expect(isRealString({name: 'Some object'})).toBe(false);
  });
  it('should reject strings with only spaces', () => {
    expect(isRealString('    ')).toBe(false);
  });
  it('should allow string with non-space characters', () => {
    expect(isRealString('Here is some name')).toBe(true);
  });
});
