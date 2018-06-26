const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

// create the web application and server
var app = express();                    // express web application.
var server = http.createServer(app);    // using http library, create server to run app on.
var io = socketIO(server);              // adds web sockets to server.
var users = new Users();                 // initialize the users object.

// Middleware
app.use(express.static(publicPath));    // static middleware

// io.on registers a listener for a certain event and do something when the event happens.
io.on('connection', (socket) => {
  console.log('New user connected.');

  // listener for a new join.
  socket.on('join', (params, callback) => {
    // Validate the user name and room name on the params.
    if(!isRealString(params.name) || !isRealString(params.room)) {
      // call callback with an error message.
      return callback('Name and room name are required.');
    }
    if(params.name.trim().toUpperCase() === 'ADMIN') {
      // call callback with an error message.
      return callback('Name not allowed.');
    }

    // socket.join is built-in functionality that are similar to rooms.
    socket.join(params.room);

    // Add the new user to the Users object.
    users.removeUser(socket.id);        // remove the user from other rooms.
    users.addUser(socket.id, params.name, params.room);   // add the user to the user list.

    // emit the updated user list.
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    // Send a welcome message to just the user.
    socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app!'));

    // Broadcast a 'New user joined.' message to all other users. Note: .to() method emits to only that socket.
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} has joined.`));

    // If no errors, call callback.
    callback();
  });

  // listener for create message event.
  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    // Validate that user exists and they sent a real string
    if (user && isRealString(message.text)) {
      // Server received a message from the client -> broadcast it to all users in this room (io.to).
      io.to(user.room).emit('newMessage', generateMessage(user.name,message.text));
    }
    callback(); // calls the callback method sent in by the socket.
  });

  // listener for create location message event.
  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    if(user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has left.`));
    }
  });
});

// tell web app to start listening on the given port.
server.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
