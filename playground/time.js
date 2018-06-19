var moment = require('moment');

var someTimestamp = moment().valueOf();

var createdAt = 1234;
var date = moment(createdAt);  // gets a new moment object that represents the current time at variable creation.

console.log(date.format('h:mm a'));
console.log(someTimestamp);
