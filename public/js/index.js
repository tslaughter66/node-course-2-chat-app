var socket = io(); <!-- makes a request to the server to open a web socket -->

<!-- socket listener for successful connect to server. -->
socket.on('connect', function () {
  console.log('Connected to server.');
});

<!-- socket listener for disconnect from server. -->
socket.on('disconnect', function () {
  console.log('Disconnected from server.');
});

socket.on('newMessage', function (message) {
  console.log('New message from server.', message);

  // When the new message is received on client, create a new list HTML item using jQuery.
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  // Use jQuery to append the list HTML item containing the message information to the UI.
  jQuery('#messages').append(li);
});

// jQuery lets you add a socket to a UI field.
jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();   // prevents default action from occurring. In this case, a submit would submit the form to the server.

  // emit createMessage event once user submits.
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function() {

  });
})
