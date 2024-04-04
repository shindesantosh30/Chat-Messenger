const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const messageController = require('../real-time-chat-app/src/controllers/messageController');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static(__dirname + '/public'));

// Socket.IO logic
io.on('connection', async (socket) => {
  console.log('a user connected');

  try {
    // Retrieve latest messages from the database
    const messages = await messageController.getMessages();
    // Emit messages to the newly connected client
    socket.emit('initialMessages', messages);
  } catch (error) {
    console.error('Error fetching initial messages:', error);
  }

  // Listen for chat messages
  socket.on('chat message', async (msg) => {
    console.log('message: ' + msg);
 
    try {
      // Save message to database
      await messageController.saveMessage(msg);
      console.log('Message saved to database');
    } catch (error) {
      console.error('Error saving message to database:', error);
    }

    // Broadcast message to all connected clients
    io.emit('chat message', msg);
  });
 
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
