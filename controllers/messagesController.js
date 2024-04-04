const { Op } = require('sequelize');
const Message = require('../models/message');

class MessageController {
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
}

module.exports = MessageController;
