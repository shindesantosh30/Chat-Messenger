const socketIo = require('socket.io');
const Message = require('../models/message');
const { createMessage } = require('../controllers/messagesController');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
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
        console.log("🚀 User connected to socket", socket.id);

        // Make sure `socket.user` exists before calling updateSocketID
        if (socket.user) {
            await updateSocketID(socket.user, socket.id);
        } else {
            console.error('User information not available on socket.');
        }

        socket.on('private_message', async (data) => {
            try {
                const message = data.message;

                console.log("🍒 Sending Private Message :", message);

                const { newMessage, socketId } = await createMessage(message);

                if (socketId) {
                    // Emit the message to the receiver's socketId
                    io.to(socketId).emit('private_message', {
                        senderId: socket.id,
                        message: newMessage,
                    });

                    // Optionally, confirm to the sender that the message was sent
                    socket.emit('message_sent', {
                        message: newMessage,
                        status: 'sent'
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

        socket.on('delete_message', async (messageId) => {
            try {
                await Message.destroy({ where: { id: messageId } });
                io.emit('message_deleted', { messageId });
            } catch (error) {
                console.error('Error deleting message:', error);
                socket.emit('error', { message: 'Failed to delete message' });
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

async function updateSocketID(user, socketId) {
    try {
        // Update the user's socketId in the database
        const [updated] = await User.update(
            { socketId: socketId },
            { where: { id: user.id } }
        );

        if (updated) {
            console.log(`User's socketId updated successfully.`);
        } else {
            console.log(`User with id ${user.id} not found.`);
        }
    } catch (error) {
        console.error('Error updating socketId:', error);
        throw new Error('Failed to update socketId');
    }
}

module.exports = initializeSocket;
