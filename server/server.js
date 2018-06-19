const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
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

  // Send a welcome message to just the user.
  socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app!'));

  // Broadcast a 'New user joined.' message to all other users.
  socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined.'));

  // listener for create message event.
  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    // io.emit sends an event to ALL sockets.
    // Server received a message from the client -> broadcast it to all users.
    io.emit('newMessage', generateMessage(message.from,message.text));
    callback(); // calls the callback method sent in by the socket.
  });

  // listener for create location message event.
  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected.');
  });
});

// tell web app to start listening on the given port.
server.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
