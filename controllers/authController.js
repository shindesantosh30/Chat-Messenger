const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Role = require('../models/roles');
const apiResponse = require('../utillity/api_response');


class RegistrationController {

    static async register(request, response) {
        try {
            const { user } = request.body;
            const { email, mobile, password, firstName, lastName, confirm_password } = user;

            if (!firstName || !lastName) {
                return response.status(400).json(apiResponse.responseBadRequest("First and last name is required"));
            }

            if (!password) {
                return response.status(400).json(apiResponse.responseBadRequest("Password is required"));
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("HERE");
            
            const role = await Role.findByPk(2);
            if (!role) {
                return response.status(404).send('User role not found');
            }
            const newUser = await User.create({
                email, mobile, password: hashedPassword, firstName, lastName, roleId: role.id
            });
            response.status(201).json({ status_code: 201, message: "Registration successfully"});
        } catch (error) {
            console.error('Exception ', error);
            response.status(500).send('Internal Server Error');
        }
    }
}
 
class LoginController {
    static async login(request, response) {
        try {
            const { email, password } = request.body;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return response.status(400).json({ error: 'User with this email is not registered' });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return response.status(400).json({ error: 'Password is incorrect, Please try again' });
            }
            // Generate JWT token
            const token = jwt.sign({ userId: user.id }, 'access_token', { expiresIn: '48h' });

            response.status(200).json({ "status_code": 200, token, user: { id: user.id, email: user.email, name: `${user.firstName} ${user.lastName}`}});

        } catch (error) {
            console.error('Error logging in:', error);
            response.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = { RegistrationController, LoginController };
