const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { createMessage, updateMessage, getSocketID, deleteMessage, getUserSocketId } = require('../controllers/messagesController');
const { updateSocketID, updateUsersOnlineStatus } = require('../controllers/userController');
require('dotenv').config();


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

const handleConnection = async (socket, io) => {
    console.log(`\n\x1b[34m👦 User \x1b[35m\x1b[1m${socket.user?.firstName}\x1b[35m\x1b[0m connected\x1b[0m\x1b[33m to the socket Id: \x1b[36m${socket.id}\x1b[0m`);
    let user = await socket.user;
    socket.join(user?.id);

    if (user) {
        await updateSocketID(user.id, socket.id);
        io.emit('user_online', {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile
        });
    }
};

const handlePrivateMessage = async (socket, io, messageData) => {
    try {
        const { messageInstance, socketId } = await createMessage(messageData);
        if (socketId) {
            io.to(socketId).emit('private message', messageInstance);
        } else {
            console.log(`\x1b[m31🚫 No socket ID found for the receiver.\x1b[0m`);
        }
        socket.emit('private message', messageInstance);
    } catch (error) {
        console.error('Error while sending private message:', error);
        socket.emit('error', { message: 'Failed to send message' });
    }
};

const handleTyping = async (io, data) => {
    const socketId = await getSocketID(data.recieverId);
    if (socketId) {
        io.to(socketId).emit('typing', data);
    } else {
        console.error('No socket ID found for receiver:', data.recieverId);
    }
};

const handleStopTyping = async (io, data) => {
    const socketId = await getSocketID(data.recieverId);
    if (socketId) {
        io.to(socketId).emit('stopTyping', data);
    } else {
        console.error('No socket ID found for receiver:', data.recieverId);
    }
};

const handleDeleteMessage = async (socket, io, messageId) => {
    try {
        const instance = await deleteMessage(messageId);
        let userId = socket.user.id;

        let socketId = userId == instance.senderId
            ? await getUserSocketId(instance.receiverId)
            : await getUserSocketId(instance.senderId);

        io.to(socketId).emit('delete_message', messageId);
        socket.emit('delete_message', { messageId });
    } catch (error) {
        console.error('Error deleting message:', error);
        socket.emit('error', { message: 'Failed to delete message' });
    }
};

const handleModifyMessage = async (socket, io, messageData) => {
    try {
        let userId = socket.user.id;
        const { updatedMessageInstance, socketId } = await updateMessage(messageData, userId);
        if (socketId) {
            io.to(socketId).emit('modify message', updatedMessageInstance);
        }
        socket.emit('modify message', updatedMessageInstance);
    } catch (error) {
        console.error('Error while sending modify message:', error);
        socket.emit('error', { message: 'Failed to send message' });
    }
};

const handleDisconnect = async (socket, io) => {
    let updatedUser = await updateUsersOnlineStatus(socket.user);
    io.emit('user_offline', updatedUser);
    console.log('\n\x1b[32⛔User -- ' + socket.user?.firstName + '\x1b[31 disconnected: socket Id ', socket.id, '\x1b[0m');
};

module.exports = {
    authenticateSocket,
    handleConnection,
    handlePrivateMessage,
    handleTyping,
    handleStopTyping,
    handleDeleteMessage,
    handleModifyMessage,
    handleDisconnect
}