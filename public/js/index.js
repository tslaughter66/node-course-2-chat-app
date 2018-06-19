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
  // format the createdAt time using createdAt
  var formattedTime = moment(message.createdAt).format('h:mm a');

  // When the new message is received on client, create a new list HTML item using jQuery.
  var li = jQuery('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`);

  // Use jQuery to append the list HTML item containing the message information to the UI.
  jQuery('#messages').append(li);
});

// Listen for a new location message.
socket.on('newLocationMessage', function (message) {
  // format the createdAt time using createdAt
  var formattedTime = moment(message.createdAt).format('h:mm a');

  // When the new location message is received on client, create a new list HTML item using jQuery.
  var li = jQuery('<li></li>');
  // anchor tag is used to insert hyperlinks. target="_blank" tells the browser to open in a new tab.
  var a = jQuery('<a target="_blank">My current location.</a>');

  li.text(`${message.from} ${formattedTime}: `);
  // attr lets you add an attribute, in this case: the hyperlink
  a.attr('href', message.url);
  li.append(a);
  // Use jQuery to append the list HTML item containing the message information to the UI.
  jQuery('#messages').append(li);
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
