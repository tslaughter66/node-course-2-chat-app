const expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

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

describe('generateLocationMessage', () => {
  it('should generate correct location message object', () => {
    var expectedFrom = 'test from value';
    var latitude = '1';
    var longitude = '1';
    var expectedUrl = 'https://www.google.com/maps?q=1,1'

    var message = generateLocationMessage(expectedFrom, latitude, longitude);

    expect(message.from).toBe(expectedFrom);
    expect(message.url).toBe(expectedUrl);
    expect(message.createdAt).toBeA('number');
  });
});
