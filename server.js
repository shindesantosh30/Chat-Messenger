const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const messagesRouter = require('./routes/messagesRoutes');
const userRouter = require('./routes/userRoutes')
const sequelize = require('./config/sequelize')

const database = require('./models');
const Message = require('./models/message')
// const verifyToken = require('./routes/verifyToken')
const UserController  = require('./controllers/userController'); // Import the UserController
const router = express.Router();

// create server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Database connection
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
app.use(passport.initialize());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

passport.use(
    new LocalStrategy((username, password, done) => {
        // Verify user credentials here
        if (username === 'user' && password === 'password') {
            return done(null, { id: 1, username: 'user' });
        } else {
            return done(null, false, { message: 'Invalid credentials' });
        }
    })
);

// Create a token
const token = jwt.sign({ userId: 1 }, 'secret_key', { expiresIn: '1h' });

// Verify a token
jwt.verify(token, 'secret_key', (err, decodedToken) => {
    if (err) {
        console.error('Token verification failed');
    } else {
        console.log('Decoded token:', decodedToken);
    }
});

function checkAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied' });
    }
}

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

// Protect routes using JWT authentication
// app.get('/admin', verifyToken, checkAdmin, (req, res) => {
//     res.send('Admin panel');
// });

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', async (msg) => {
        try {
            console.log('Creating new message...');
            console.log('Message data:', msg);

            const newMessage = await Message.create({
                senderId: msg.senderId,
                receiverId: msg.receiverId,
                message: msg.message
            });

            console.log('New message created:', newMessage);
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
