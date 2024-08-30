// const socketIo = require('socket.io');
// const jwt = require('jsonwebtoken');
// const Message = require('../models/message');
// const User = require('../models/users');
// const { createMessage, getSocketID } = require('../controllers/messagesController');
// const { updateSocketID, updateUsersOnlineStatus } = require('../controllers/userController')

// require('dotenv').config();


// const initializeSocket = (server) => {
//     const io = socketIo(server, {
//         cors: {
//             origin: "http://localhost:4200",
//             methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
//         }
//     });

//     io.use(async (socket, next) => {
//         try {
//             const token = socket.handshake.headers.authorization;

//             if (!token || !token.startsWith('Bearer ')) {
//                 return next(new Error('Authentication credentials were not provided.'));
//             }
//             const authToken = token.split(' ')[1];
//             const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

//             const user = await User.findByPk(decoded.userId);
//             if (!user) {
//                 return next(new Error('User not found'));
//             }
//             socket.user = user;
//             next();
//         } catch (error) {
//             console.error('Authentication error:', error.message);
//             next(new Error('Unauthorized'));
//         }
//     });

//     io.on('connection', async (socket) => {
//         console.log("🚀 User connected to socket : ", socket.id);
//         let user = socket.user;
//         socket.join(user?.id);

//         if (user) {
//             await updateSocketID(user, socket.id);
//             io.emit('user_online', user);
//         } else {
//             console.error('User information not available on socket.');
//         }

//         socket.on('private message', async (messageData) => {
//             try {
//                 const { message, socketId } = await createMessage(messageData);
//                 io.to(socketId).emit('private message', message);

//                 // Also send the message back to the sender
//                 socket.emit('private message', message);
//             } catch (error) {
//                 socket.emit('error', { message: 'Failed to send message' });
//             }
//         });
        
//         socket.on('typing', async (data) => {
//             const socketId = await getSocketID(data.recieverId);
//             if (socketId) {
//                 io.to(socketId).emit('typing', data);
//             } else {
//                 console.error('No socket ID found for receiver:', data.recieverId);
//             }
//         });

//         socket.on('stopTyping', async (data) => {
//             const socketId = await getSocketID(data.recieverId);
//             if (socketId) {
//                 io.to(socketId).emit('stopTyping', data);
//             } else {
//                 console.error('No socket ID found for receiver:', data.recieverId);
//             }
//         });

//         socket.on('delete_message', async (messageId) => {
//             try {
//                 await Message.destroy({ where: { id: messageId } });
//                 io.emit('message_deleted', { messageId });
//             } catch (error) {
//                 console.error('Error deleting message:', error);
//                 socket.emit('error', { message: 'Failed to delete message' });
//             }
//         });

//         socket.on('disconnect', async () => {
//             if (socket.user) {
//                 await updateUsersOnlineStatus(socket.user);
//                 io.emit('user_offline', socket.user); // Emit offline status
//             }
//             console.log('👋 User disconnected:', socket.id);
//         });
//     });
// };


// module.exports = initializeSocket;



// const socketIo = require('socket.io');
// const {
//     authenticateSocket,
//     handlePrivateMessage,
//     handleTyping,
//     handleStopTyping,
//     handleDeleteMessage,
//     handleDisconnect
// } = require('../utillity/socketUtility'); // Correct path

// const initializeSocket = (server) => {
//     const io = socketIo(server, {
//         cors: {
//             origin: "http://localhost:4200",
//             methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
//         }
//     });

//     io.use(authenticateSocket);

//     io.on('connection', async (socket) => {
//         console.log("🚀 User connected to socket: ", socket.id);

//         let user = socket.user;
//         socket.join(user?.id);

//         if (user) {
//             await updateSocketID(user, socket.id);
//             io.emit('user_online', user);
//         } else {
//             console.error('User information not available on socket.');
//         }

//         socket.on('private message', (messageData) => handlePrivateMessage(socket, io, messageData));
//         socket.on('typing', (data) => handleTyping(socket, io, data));
//         socket.on('stopTyping', (data) => handleStopTyping(socket, io, data));
//         socket.on('delete_message', (messageId) => handleDeleteMessage(socket, io, messageId));

//         socket.on('disconnect', () => handleDisconnect(socket, io));
//     });
// };

// module.exports = initializeSocket;
