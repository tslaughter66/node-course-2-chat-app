var socket = io(); <!-- makes a request to the server to open a web socket -->

<!-- socket listener for successful connect to server. -->
socket.on('connect', function () {
  console.log('Connected to server.');
});

<!-- socket listener for disconnect from server. -->
socket.on('disconnect', function () {
  console.log('Disconnected from server.');
});

// Listen for a new message.
socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a'); // format the createdAt time using moment.js
  // get the message template script using jQuery. Template is stored on index.html.
  var template = jQuery('#message-template').html();  //jQuery.html() gets the html values from the template.
  // use Mustache library to render the html. inject dynamic data into the template by passing an object to mustache.
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);   // use jQuery to insert the mustache html into the page.
});

// Listen for a new location message.
socket.on('newLocationMessage', function (message) {
  // format the createdAt time using createdAt
  var formattedTime = moment(message.createdAt).format('h:mm a');
  // get the message template script using jQuery. Template is stored on index.html.
  var template = jQuery('#location-message-template').html();  //jQuery.html() gets the html values from the template.
  // use Mustache library to render the html. inject dynamic data into the template by passing an object to mustache.
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);   // use jQuery to insert the mustache html into the page.
});

// jQuery lets you add a socket to a UI field.
// Add jQuery socket to listen for a submit message action
jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();   // prevents default action from occurring. In this case, a submit would submit the form to the server.

  // store the message text box as a jquert variable.
  var messageTextbox = jQuery('[name=message]');

  // emit createMessage event once user submits.
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function() {
    // acknowledement callback is run by the server after the listener completes.
    messageTextbox.val('')
  });
});

// Store the send-location button as a jQuery variable.
var locationButton = jQuery('#send-location');
locationButton.on('click', function (e) {
  // geolocation is stored on the navigator object. Primitive object on all browsers.

  if(!navigator.geolocation) {
    // If geolocation is not supported on browser, return message.
    return alert('Geolocation not supported by your browser.');
  }

  // disable the button while request is submitting.
  locationButton.attr('disabled', 'disabled').text('Sending location...');

  // getCurrentPostion uses geolocation to get location. Method takes two methods as parameters, success function and failure function.
  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location'); // re-enable the button when the request finishes.

    // Emit an event to create location message.
    socket.emit('createLocationMessage', {
      // pass latitude and longitude to event listener. Found on position object returned from geolocation.
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');  // re-enable the button when the request finishes.
    // Call failed, alert the user.
    alert('Unable to share location.');
  });
});
