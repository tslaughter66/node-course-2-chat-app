const expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object',() => {
    var expectedFrom = 'test from value';
    var expectedText = 'test text value';

    var message = generateMessage(expectedFrom,expectedText);

    expect(message.from).toBe(expectedFrom);
    expect(message.text).toBe(expectedText);
    expect(message.createdAt).toBeA('number');
  });
});
