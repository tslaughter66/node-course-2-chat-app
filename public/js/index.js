var socket = io(); <!-- makes a request to the server to open a web socket -->

<!-- socket listener for successful connect to server. -->
socket.on('connect', function () {
  console.log('Connected to server.')

  <!-- socket.emit sends an event to the server. -->
  socket.emit('createMessage', {
    from: 'C-to-S from.',
    text: 'C-to-S  Text'
  });

  socket.on('newMessage', function (newMessage) {
    console.log('newMessage received on client from server.', newMessage);
  });
});

<!-- socket listener for disconnect from server. -->
socket.on('disconnect', function () {
  console.log('Disconnected from server.');
});
