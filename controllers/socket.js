const socketIo = require('socket.io');
const { authenticateSocket, handleConnection, handlePrivateMessage, handleTyping, handleStopTyping, handleDeleteMessage, handleModifyMessage, handleDisconnect } = require('../utillity/socketHandlers');

const socketService = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "http://localhost:4200",
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
        }
    });

    io.use(authenticateSocket);

    io.on('connection', async (socket) => {
        await handleConnection(socket, io);

        socket.on('private message', async (messageData) => {
            await handlePrivateMessage(socket, io, messageData);
        });

        // Listen for group messages
        socket.on('group message', async (messageData) => {
            await handleGroupMessage(socket, io, messageData);
        });

        // Listen for user joining a group
        socket.on('join group', (groupId) => {
            handleJoinGroup(socket, groupId);
        });

        // Listen for user leaving a group
        socket.on('leave group', (groupId) => {
            handleLeaveGroup(socket, groupId);
        });

        socket.on('typing', async (data) => {
            await handleTyping(io, data);
        });

        socket.on('stopTyping', async (data) => {
            await handleStopTyping(io, data);
        });

        socket.on('delete_message', async (messageId) => {
            await handleDeleteMessage(socket, io, messageId);
        });

        socket.on('modify message', async (messageData) => {
            await handleModifyMessage(socket, io, messageData);
        });

        socket.on('disconnect', async () => {
            await handleDisconnect(socket, io);
        });
    });
};

module.exports = socketService;

