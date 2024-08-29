const jwt = require('jsonwebtoken');
const { updateUsersOnlineStatus } = require('../controllers/userController');
const { createMessage, getSocketID } = require('../controllers/messagesController');
const Message = require('../models/message');
const User = require('../models/users');

// Middleware for socket authentication
const authenticateSocket = async (socket, next) => {
    try {
        const token = socket.handshake.headers.authorization;

        if (!token || !token.startsWith('Bearer ')) {
            return next(new Error('Authentication credentials were not provided.'));
        }
        const authToken = token.split(' ')[1];
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return next(new Error('User not found'));
        }
        socket.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        next(new Error('Unauthorized'));
    }
};

// Handle private message event
const handlePrivateMessage = async (socket, io, messageData) => {
    try {
        const { message, socketId } = await createMessage(messageData);
        io.to(socketId).emit('private message', message);

        // Also send the message back to the sender
        socket.emit('private message', message);
    } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
    }
};

// Handle typing event
const handleTyping = async (socket, io, data) => {
    const socketId = await getSocketID(data.recieverId);
    if (socketId) {
        io.to(socketId).emit('typing', data);
    } else {
        console.error('No socket ID found for receiver:', data.recieverId);
    }
};

// Handle stop typing event
const handleStopTyping = async (socket, io, data) => {
    const socketId = await getSocketID(data.recieverId);
    if (socketId) {
        io.to(socketId).emit('stopTyping', data);
    } else {
        console.error('No socket ID found for receiver:', data.recieverId);
    }
};

// Handle delete message event
const handleDeleteMessage = async (socket, io, messageId) => {
    try {
        await Message.destroy({ where: { id: messageId } });
        io.emit('message_deleted', { messageId });
    } catch (error) {
        console.error('Error deleting message:', error);
        socket.emit('error', { message: 'Failed to delete message' });
    }
};

// Handle user disconnect event
const handleDisconnect = async (socket, io) => {
    if (socket.user) {
        await updateUsersOnlineStatus(socket.user);
        io.emit('user_offline', socket.user);
    }
    console.log('👋 User disconnected:', socket.id);
};

module.exports = {
    authenticateSocket,
    handlePrivateMessage,
    handleTyping,
    handleStopTyping,
    handleDeleteMessage,
    handleDisconnect
};
