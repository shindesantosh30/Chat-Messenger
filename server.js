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

// const sequelize = require('./config/sequelize')
// Database connection
// (async () => {
//     try {
//         await sequelize.authenticate();
//         await sequelize.sync();
//         console.log('All models were sync successfully.');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// })();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.use('/user', authRoutes);
app.use('/message', messagesRouter);
app.use('/contact-users', userRouter);

io.on('connection', (socket) => {
    console.log('socket is on');

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
development server is running : http://localhost:${PORT}/`);
});
