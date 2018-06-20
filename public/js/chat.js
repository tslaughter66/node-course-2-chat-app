var socket = io(); <!-- makes a request to the server to open a web socket -->

// autoscroll to the bottom of the page.
function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');     // Get all messages.
  var newMessage = messages.children('li:last-child');    // get the last message (just printed to screen.)
  // Heights
  var clientHeight = messages.prop('clientHeight');       // Height of current viewing section
  var scrollTop = messages.prop('scrollTop');             // Height above the current viewing section
  var scrollHeight = messages.prop('scrollHeight');       // Total Height
  var newMessageHeight = newMessage.innerHeight();        // Height of newest message
  var lastMessageHeight = newMessage.prev().innerHeight();  // Height of previous message.

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    // If the total of all heights is >= the total height of chat, scroll to bottom.
    messages.scrollTop(scrollHeight);
  }
}

<!-- socket listener for successful connect to server. -->
socket.on('connect', function () {
  // get user and room name params from the url using deparam method.
  var params = jQuery.deparam(window.location.search);  // location.search is a built in container on all browser. Acces using window.

  socket.emit('join', params, function(err) {
    // acknowledement function.
    if(err) {
      alert(err);   // alert the user of error.
      // If there is an error, redirect the user back to index page.
      window.location.href = '/';     // href lets you determine which page the user is on.
    } else {
      console.log('no error');
    }
  });
});

<!-- socket listener for disconnect from server. -->
socket.on('disconnect', function () {
  console.log('Disconnected from server.');
});

// Listener for updated user list from server.
socket.on('updateUserList', function (users) {
  // create a jQuery list object
  var ol = jQuery('<ol></ol>');

  // loop through users. For each one, append a new list item with the user name to the list object.
  users.forEach(function(user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  // add the list to the html. Using html replaces existing data (as compared to append which just adds new data on.)
  jQuery('#users').html(ol);
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
  scrollToBottom();                   // Autoscrolling to bottom of page.
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
  scrollToBottom();                   // Autoscrolling to bottom of page.
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
