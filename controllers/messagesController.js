const { Op, where } = require('sequelize');
const Message = require('../models/message');


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

            response.json(messages);
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

module.exports = MessageController;
