const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

// create the web application and server
var app = express();                    // express web application.
var server = http.createServer(app);    // using http library, create server to run app on.
var io = socketIO(server);              // adds web sockets to server.

// Middleware
app.use(express.static(publicPath));    // static middleware

// io.on registers a listener for a certain event and do something when the event happens.
io.on('connection', (socket) => {
  console.log('New user connected.');

  // socket.emit sends an event to the client.
  // emit a newMessage to the client.
  socket.emit('newMessage', {
    from: 'Tim',
    text: 'New Message sent from server to client.',
    createdAt: 123
  });

  socket.on('createMessage', (message) => {
    console.log('Message received on server from client.', message)
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected.');
  });
});

// tell web app to start listening on the given port.
server.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
