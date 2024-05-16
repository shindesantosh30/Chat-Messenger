const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');

const authRoutes = require('./routes/auth');
const messagesRouter = require('./routes/messagesRoutes');
const userRouter = require('./routes/userRoutes')
const Message = require('./models/message')
const User = require('./models/users')

require('dotenv').config();
const jwt = require('jsonwebtoken'); 
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

// io.on('connection', (socket) => {
//     console.log('socket connected');

//     socket.on('message', async (message) => {
//         try {
//             const newMessage = await Message.create({
//                 senderId: message.senderId,
//                 receiverId: message.receiverId,
//                 message: message.message
//             });
//             socket.broadcast.emit('message', newMessage);
//         } catch (err) {
//             console.error('Error inserting message into database:', err);
//         }
//     });
// });

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        console.log("token ........ ", token);
        if (!token || !token.startsWith('Bearer ')) {
            return next(new Error('Authentication credentials were not provided.'));
        }
        const authToken = token.split(' ')[1];
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return next(new Error('Invalid username or password'));
        }
        console.log("USER FOUND ", user);
        // Set user object on socket for later use
        socket.user = user;
        next();
    } catch (error) {
        console.error('Error:', error.message);
        next(new Error('Unauthorized'));
    }
});

io.on('connection', async (socket) => {
    try {
        // Retrieve user ID from socket.user
        const userId = socket.user.id;
        console.log('User connected:', userId, 'Socket ID:', socket.id);

        // Update user's socketId in the database
        await User.update({ socketId: socket.id }, { where: { id: userId } });

        // Handle disconnection
        socket.on('disconnect', async () => {
            // Clear user's socketId in the database upon disconnection
            await User.update({ socketId: null }, { where: { id: userId } });
            console.log('User disconnected:', userId, 'Socket ID:', socket.id);
        });

        // Handle incoming messages
        socket.on('message', async (message) => {
            console.log("LOG ", socket.id);
            // Check if the message is intended for the currently connected client
            if (message.receiverId === userId) {
                console.log("CONDITION SATISFIED");
                const newMessage = await Message.create({
                    senderId: message.senderId,
                    receiverId: message.receiverId,
                    message: message.message
                });
                // Broadcast the message only to the intended recipient
                io.to(socket.id).emit('message', newMessage);
            }
        });
    } catch (err) {
        console.error('Error handling socket connection:', err);
    }
});

const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}
development server is running on : http://localhost:${PORT}/`);
});
