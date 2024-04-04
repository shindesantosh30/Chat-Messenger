const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { Sequelize } = require('sequelize');
const db = require('./models');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const sequelize = new Sequelize('chat_messanger', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
        await sequelize.sync();
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

// Middleware to serve static files from the public directory
app.use(express.static(__dirname + '/public'));

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


// Event listener for new socket connections
io.on('connection', (socket) => {
    console.log('Client connected');

    // Event listener for receiving new messages from clients
    socket.on('message', async (msg) => {
        try {
            // Insert the message into the database
            const newMessage = await db.Message.create({
                user: msg.user,
                message: msg.message
            });
            socket.broadcast.emit('message', newMessage);
        } catch (err) {
            console.error('Error inserting message into database:', err);
        }
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
