const { getErrorMessage } = require('../utillity/utils');
const User = require('../models/users');


class ProfileController {
    static async updateProfile(request, response) {
        try {
            const { firstName, lastName, mobile, email } = request.body;
            const userId = request.user.id; // Assuming user ID is available in the request object

            const user = await User.findByPk(userId);

            if (!user) {
                return response.status(404).json({ error: 'User not found' });
            }

            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.mobile = mobile || user.mobile;
            user.email = email || user.email;

            await user.save();

            response.status(200).json({ status_code: 200, message: 'Profile updated successfully', user });
        } catch (error) {
            response.status(500).send(getErrorMessage(error));
        }
    }
}

module.exports = ProfileController;
