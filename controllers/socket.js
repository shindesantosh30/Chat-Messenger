const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('../models/message');
const User = require('../models/users');
const { createMessage, getSocketID } = require('../controllers/messagesController');

require('dotenv').config();

const initializeSocket = (server) => {
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
            const jwtSecret = process.env.JWT_SECRET || 'authToken';

            const authToken = token.split(' ')[1];
            const decoded = jwt.verify(authToken, jwtSecret);

            const user = await User.findByPk(decoded.userId);
            if (!user) {
                return next(new Error('Invalid user.'));
            }
            // Attach user to socket for future use
            socket.user = user;
            next();
        } catch (error) {
            console.error('Authentication error:', error.message);
            next(new Error('Unauthorized'));
        }
    });

    io.on('connection', async (socket) => {
        console.log("🚀 User connected to socket id : ", socket.id);

        socket.join(socket.user?.id);

        if (socket.user) {
            await updateSocketID(socket.user, socket.id);
            io.emit('user_online', socket.user); // Emit online status
        } else {
            console.error('User information not available on socket.');
        }

        socket.on('private message', async (data) => {
            try {
                // Assuming `createMessage` returns the new message and receiver's socketId
                const { newMessage, socketId } = await createMessage(data);

                console.log("🚀 Recipient Socket ID:", socketId);

                if (socketId) {
                    // Emit the message to the receiver's socketId
                    io.to(socketId).emit('private message', {
                        newMessage
                    });
                } else {
                    console.error('Receiver socketId not found.');
                    socket.emit('error', { message: 'Receiver not available' });
                }
            } catch (error) {
                console.error('Error handling private message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });



        socket.on('typing', async (data) => {
            console.log("Received typing event data:", data);
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
                await Message.destroy({ where: { id: messageId } });
                io.emit('message_deleted', { messageId });
            } catch (error) {
                console.error('Error deleting message:', error);
                socket.emit('error', { message: 'Failed to delete message' });
            }
        });

        socket.on('disconnect', async () => {
            if (socket.user) {
                await updateUsersOnlineStatus(socket.user);
                io.emit('user_offline', socket.user); // Emit offline status
            }
            console.log('User disconnected:', socket.id);
        });

    });
};

async function updateSocketID(user, socketId) {
    try {
        const [updated] = await User.update(
            { socketId: socketId, isOnline: true },
            { where: { id: user.id } }
        );

        if (updated) {
            console.log(`User's socketId updated successfully: ${socketId}`);
        } else {
            console.log(`User with id ${user.id} not found.`);
        }
    } catch (error) {
        console.error('Error updating socketId:', error);
        throw new Error('Failed to update socketId');
    }
}

async function updateUsersOnlineStatus(user) {
    try {
        const [updated] = await User.update(
            { isOnline: false },
            { where: { id: user.id } }
        );

        if (updated) {
            console.log(`User's online status updated successfully for user ID: ${user.id}`);
        } else {
            console.log(`User with id ${user.id} not found.`);
        }
    } catch (error) {
        console.error('Error updating online status:', error);
        throw new Error('Failed to update online status');
    }
}

module.exports = initializeSocket;
