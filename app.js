const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const { Sequelize } = require('sequelize');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

/* ROUTES */
const authRoutes = require('./routes/auth');
/* MODELS */
const User = require('./models/users');
/*DB */
const database = require('./models');

// Database connection
const sequelize = new Sequelize('messanger', 'root', 'password', { host: 'localhost', dialect: 'mysql' });

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

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

// Socket.io
io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', async (msg) => {
        try {
            const newMessage = await database.Message.create({
                user: msg.user,
                message: msg.message
            });
            socket.broadcast.emit('message', newMessage);
        } catch (err) {
            console.error('Error inserting message into database:', err);
        }
    });
});

// Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});