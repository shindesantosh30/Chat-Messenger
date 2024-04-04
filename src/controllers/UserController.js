const User = require('../models/user');

exports.getUserList = (req, res) => {
    const users = User.getAllUsers();
    res.send(users, 200);
};


exports.getAddUser = (req, res) => {
    res.render('addUser', { pageTitle: 'Add User' });
};

exports.postAddUser = (req, res) => {
    const { name } = req.body;
    User.addUser(name); // This is a mock example
    res.redirect('/users');
};
