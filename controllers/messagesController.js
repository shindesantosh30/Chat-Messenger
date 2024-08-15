const { Op } = require('sequelize');
const Message = require('../models/message');
const User = require('../models/users');


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

    // static async list(request, response) {
    //     try {
    //         const { sender, receiver } = request.query;

    //         // Fetch messages where senderId matches sender and receiverId matches receiver, or vice versa
    //         const messages = await Message.findAll({
    //             where: {
    //                 [Op.or]: [
    //                     { senderId: sender, receiverId: receiver },
    //                     { senderId: receiver, receiverId: sender }
    //                 ]
    //             },
    //             order: [['createdAt', 'ASC']]
    //         });

    //         response.json(messages);
    //     } catch (error) {
    //         console.error(error);
    //         response.status(500).json({ message: 'Internal server error' });
    //     }
    // }

    static async list(request, response) {
        try {
            const { sender, receiver } = request.query;

            // Fetch messages where senderId matches sender and receiverId matches receiver, or vice versa
            const messages = await Message.findAll({
                where: {
                    [Op.or]: [
                        { senderId: sender, receiverId: receiver },
                        { senderId: receiver, receiverId: sender }
                    ]
                },
                order: [['createdAt', 'ASC']]
            });
            messages['code'] = 200
            response.json(messages);
        } catch (error) {
            // console.error(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    }

    static async retrieve(request, response) {
        try {
            const getId = req.params.id;

            const message = await Message.findByPk(getId);

            if (message) {
                response.json(message);
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
        console.log('Creating message with data:', data);

        const newMessage = await Message.create({
            senderId: data.message.senderId,
            receiverId: data.message.receiverId,
            message: data.message.message,
            createdAt: data.message.createdAt,
        });

        console.log('Message created successfully:', newMessage);

        const receiver = await User.findByPk(data.message.receiverId, {
            attributes: ['socketId']
        });

        const socketId = receiver ? receiver.socketId : null;

        return { newMessage, socketId };

    } catch (error) {
        console.error('Error in createMessage:', error);
        throw new Error('Unable to create messages');
    }
}

module.exports = {
    
    MessageController,
    createMessage
};
