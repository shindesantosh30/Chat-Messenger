const Message = require('../models/message')

const fetchUsers = async () => {
  const messages = await Message.findAll({
    include: [
      { model: User, as: 'sender' },
      { model: User, as: 'receiver' },
      { model: Asset, as: 'attachment' }, // 'attachment' must match the alias used in the association
    ],
  });
}

fetchUsers()