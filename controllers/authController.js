const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Role = require('../models/roles');
const apiResponse = require('../utillity/api_response');



async function register(request, response) {
    console.log("***************REGISTER******************");
    try {
        const { username, email, mobile, password, firstName, lastName, address, gender } = request.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        if (!firstName) {
            const response = apiResponse.responseBadRequest(message="First name is required");
            res.status(response.code).json(response);
        }
        const role = await Role.findByPk(2);
        if (!role) {
            response.status(404).send('User role not found');
        }

        const newUser = await User.create({ username, email, mobile, password: hashedPassword, firstName, lastName, address, gender, roleId: role.id });
        response.status(201).json(newUser);
    } catch (error) {
        console.error('Exception ', error);
        response.status(500).send('Internal Server Error');
    }
}

async function login(request, response) {
    console.log("***************LOGIN******************");
    try {
        const { email, password } = request.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return response.status(400).json({ error: 'Email does not exists' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return response.status(400).json({ error: 'Invalid password' });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, 'access_token', { expiresIn: '8h' });

        response.status(200).json({ token, user: { id: user.id, email: user.email, firstName: user.firstName } });

    } catch (error) {
        console.error('Error logging in:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { register, login };
