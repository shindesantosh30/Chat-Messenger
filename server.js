const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');

const authRoutes = require('./routes/auth');
const messagesRouter = require('./routes/messagesRoutes');
const userRouter = require('./routes/userRoutes')
const Message = require('./models/message')
require('dotenv').config();

// create server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const authGuard = require('./middleware/authMiddleware');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Routes
app.get('/messenger', (req, response) => { response.sendFile(path.join(__dirname, 'index.html')); });

app.get('/register', (req, response) => { response.sendFile(path.join(__dirname, 'views', 'register.html')); });

app.get('/', (req, response) => { response.sendFile(path.join(__dirname, 'views', 'login.html')); });

app.use('/user', authRoutes);
app.use('/message', authGuard, messagesRouter);
app.use('/contact-users', authGuard, userRouter);

io.on('connection', (socket) => {
    console.log('socket connected');

    socket.on('message', async (message) => {
        try {
            const newMessage = await Message.create({
                senderId: message.senderId,
                receiverId: message.receiverId,
                message: message.message
            });
            socket.broadcast.emit('message', newMessage);
        } catch (err) {
            console.error('Error inserting message into database:', err);
        }
    });
});

const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}
development server is running on : http://localhost:${PORT}/`);
});
