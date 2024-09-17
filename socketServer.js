const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { createMessage, updateMessage, getSocketID, deleteMessage, getUserSocketId } = require('../controllers/messagesController');
const { updateSocketID, updateUsersOnlineStatus } = require('../controllers/userController')

require('dotenv').config();


const socketService = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "http://localhost:4200",
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
        }
    });

    io.use(async (socket, next) => {
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
    });

    io.on('connection', async (socket) => {
        console.log("🚀 User " + socket.user?.firstName + " connected to socket : ", socket.id);
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

        else { console.error('User information not available on socket.'); }

        socket.on('private message', async (messageData) => {
            try {
                const { messageInstance, socketId } = await createMessage(messageData);
                if (socketId) {
                    io.to(socketId).emit('private message', messageInstance);
                } else {
                    console.log('🚫 No socket ID found for the receiver.');
                }
                socket.emit('private message', messageInstance);
            } catch (error) {
                console.error('Error while sending private message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        socket.on('typing', async (data) => {
            const socketId = await getSocketID(data.recieverId);
            if (socketId) {
                io.to(socketId).emit('typing', data);
            } else {
                console.error('No socket ID found for receiver:', data.recieverId);
            }
        });

        socket.on('stopTyping', async (data) => {
            const socketId = await getSocketID(data.recieverId);
            if (socketId) {
                io.to(socketId).emit('stopTyping', data);
            } else {
                console.error('No socket ID found for receiver:', data.recieverId);
            }
        });

        socket.on('delete_message', async (messageId) => {
            try {
                instance = await deleteMessage(messageId)
                let userId = await socket.user.id;

                if (userId == instance.senderId) { var socketId = await getUserSocketId(instance.receiverId); }
                else { var socketId = await getUserSocketId(instance.senderId); }
                console.log("Socket Id : ", socketId);

                io.to(socketId).emit('delete_message', messageId)

                socket.emit('delete_message', { messageId });
            } catch (error) {
                console.error('Error deleting message:', error);
                socket.emit('error', { message: 'Failed to delete message' });
            }
        });

        socket.on('modify message', async (messageData) => {
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
        });

        socket.on('disconnect', async () => {
            if (socket.user) {
                let updatedUser = await updateUsersOnlineStatus(socket.user);
                io.emit('user_offline', updatedUser);
            }
            console.log('👋 User -- ' + socket.user?.firstName + '-- disconnected:', socket.id);
        });
    });
};


module.exports = socketService;