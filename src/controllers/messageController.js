const Message = require('../models/message');
const User = require('../models/user')


class MessageController {

    singularName = "Message";

    static async getObject(id) {
        try {
            const message = await Message.findByPk(id);
            if (message) { return message; }
            else { return null; }
        } catch (error) { throw error; }
    }

    static async retrieve(request, response) {
        const id = parseInt(request.params.id);
        try {
            const instance = await this.getObject(id);

            if (instance) {
                instance['status'] = 200;
                response.status(200).json(instance);
            } else {
                response.status(404).json({ message: `${this.singularName} not found` });
            }
        } catch (error) {
            console.error(`Error retrieving ${this.singularName} :`, error);
            response.status(500).json({ error: 'Internal server error' });
        }
    }

    static saveMessage = async (message) => {
        try {

            console.log("req_data : ", message);

            const savedMessage = await Message.create({
                message: message.message,
                from_: message.from,
                to_: message.to
            });
            return savedMessage
        } catch (error) {
            throw error;
        }
    };

    static getMessages = async () => {
        try {
            const messages = await Message.findAll({
                include: [
                    { model: User, attributes: ['id', 'username'] }
                ]
            });
            return messages;
        } catch (error) {
            throw error;
        }
    };
    
    static async list(request, response) {
        try {
            const messageQueryset = await Message.findAll();
            const data = getPaginationResponse(messageQueryset, request);
            response.json(data);
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = MessageController;
