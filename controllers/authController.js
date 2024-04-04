const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Role = require('../models/roles');

async function register(req, res) {
    console.log("***************REGISTER******************");
    try {
        const { username, email, mobile, password, firstName, lastName, address, gender } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const role = await Role.findByPk(2);
        if (!role) {
            res.status(404).send('User role not fount');
        }

        const newUser = await User.create({ username, email, mobile, password: hashedPassword, firstName, lastName, address, gender, roleId: role.id });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function login(req, res) {
    console.log("***************LOGIN******************");
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, 'access_token', { expiresIn: '1h' });
        console.log("TOKEN : ", token);

        res.status(200).json({ token, user: { id: user.id, email: user.email, firstName: user.firstName } });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { register, login };
