const { Op } = require('sequelize');
const Message = require('../models/message');
const User = require('../models/users');
const Asset = require('../models/assets');
const { removeFile } = require('../controllers/fileUploadController')

class MessageController {

    static async update(request, response) {
        try {
            const getId = request.params.id;
            const userId = request.user.id;
            const message = request.body.message;

            if (!message) {
                return response.status(400).json({ message: 'Message is required' });
            } else if (message.trim() === '') {
                return response.status(400).json({ message: 'Message cannot be empty' });
            }

            const messageInstance = await Message.findOne({ where: { id: getId } });
            if (!messageInstance) {
                return response.status(404).json({ message: 'Message not found' });
            }
            const [instanceCount] = await Message.update({ message: message },
                {
                    where: {
                        id: getId,
                        senderId: userId
                    }
                }
            );

            if (instanceCount > 0) {
                response.status(200).json({ message: 'Message updated successfully' });
            } else {
                response.status(404).json({ message: 'Message not found' });
            }
        } catch (error) {
            console.error('Error updating message:', error);
            response.status(500).json({ message: 'Internal server error' });
        }
    }

    static async list(request, response) {
        try {
            const { sender, receiver } = request.query;

            // Fetch messages with attachment data
            const messages = await Message.findAll({
                where: {
                    [Op.or]: [
                        { senderId: sender, receiverId: receiver },
                        { senderId: receiver, receiverId: sender }
                    ]
                },
                include: [
                    {
                        model: Asset,
                        as: 'attachment',
                        attributes: ['id', 'fileName', 'filePath', 'fileSize', 'mimeType']
                    }
                ],
                order: [['createdAt', 'ASC']]
            });

            // Add a response code to the messages object
            messages['code'] = 200;

            response.status(200).json(messages);
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    }

    static async retrieve(request, response) {
        try {
            const getId = req.params.id;

            const message = await Message.findByPk(getId);

            if (message) {
                response.status(200).json(message);
            } else {
                response.status(404).json({ message: 'Message not found' });
            }
        } catch (error) {
            console.error('Error fetching message:', error);
            response.status(500).json({ message: 'Internal server error' });
        }
    }

    static async remove(request, response) {
        try {
            const getId = request.params.id;
            const userId = request.user.id;
            const messageInstance = await Message.findOne({ where: { id: getId, senderId: userId } });
            if (!messageInstance) {
                return response.status(404).json({ message: 'Message not found' });
            }

            if (messageInstance.senderId !== userId) {
                return response.status(403).json({ message: 'You are not authorized to delete this message' });
            }

            await messageInstance.destroy();

            response.json({ message: 'Message deleted successfully' });
        } catch (error) {
            console.error('Error deleting message:', error);
            response.status(500).json({ message: 'Internal server error' });
        }
    }
}

async function createMessage(data) {
    try {
        let messageInstance = await Message.create({
            senderId: data.message.senderId,
            receiverId: data.message.receiverId,
            message: data.message.message,
            createdAt: data.message.createdAt,
            attachmentId: data.message.attachmentId,
        });

        if (data.message.attachmentId) {
            const attachment = await Asset.findByPk(data.message.attachmentId, {
                attributes: ['id', 'fileName', 'filePath', 'fileSize', 'mimeType']
            });
            messageInstance = messageInstance.toJSON()
            messageInstance.attachment = attachment;
        }

        const user = await User.findByPk(data.message.receiverId, { attributes: ['socketId'] });
        const socketId = user ? user.socketId : null;

        return { messageInstance, socketId };

    } catch (error) {
        console.error('Error in createMessage:', error);
        throw new Error('Unable to create messages');
    }
}

async function updateMessage(message, userId) {
    try {
        const { id, message: newMessage, senderId, receiverId } = message;

        const [updateCount] = await Message.update(
            {
                message: newMessage,
                isEdited: true
            },
            {
                where: { id: id }
            }
        );

        const updatedMessageInstance = await Message.findByPk(id);

        const receiverUserId = (userId === senderId) ? receiverId : userId;

        const user = await User.findByPk(receiverUserId, { attributes: ['socketId'] });
        const socketId = user ? user.socketId : null;

        return { updatedMessageInstance, socketId };

    } catch (error) {
        console.error('Unable to update message:', error);
        throw new Error('Unable to update message');
    }
}

async function deleteMessage(messageId) {
    const instance = await Message.findByPk(messageId, {
        attributes: ['id', 'senderId', 'receiverId']
    });
    if (!instance) { throw new Error('Message not found'); }

    if (instance?.attachmentId) {
        await removeFile(instance.attachmentId)
    }
    instance.destroy();
    return instance;
}

async function getUserSocketId(userId) {
    try {
        const receiver = await User.findByPk(userId, { attributes: ['socketId'] });

        return receiver ? receiver.socketId : null;

    } catch (error) {
        throw new Error('Unable to retrieve socketId for user');
    }
}

const getSocketID = async (recieverId) => {
    try {
        const user = await User.findByPk(recieverId, {
            attributes: ['socketId'],
        });
        return user ? user.socketId : null;
    } catch (error) {
        console.error('Error fetching socket ID:', error);
        return null;
    }
};

module.exports = {
    MessageController,
    createMessage,
    getSocketID,
    deleteMessage,
    getUserSocketId,
    updateMessage
};
