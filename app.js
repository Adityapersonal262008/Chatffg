const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve static files from the "public" folder
app.use(express.static(__dirname + '/public')); 

// Socket.io logic
let users = {};

io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  socket.on('join', (username) => {
    users[socket.id] = username;
    io.emit('user-joined', username);
  });

  socket.on('send-message', (message) => {
    const username = users[socket.id];
    if (username) {
      io.emit('new-message', { username, message });
    }
  });

  socket.on('disconnect', () => {
    const username = users[socket.id];
    if (username) {
      io.emit('user-left', username);
      delete users[socket.id];
    }
  });
});

// Start the server
http.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
