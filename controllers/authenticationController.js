require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const apiResponse = require('../utillity/api_response');
const { getRequiredFields } = require('../utillity/helper');
const { sendResetEmail } = require('../utillity/authUtility');


class AuthController {
    static async changePassword(request, response) {
        try {
            const user = request.user;

            const { old_password, password, confirm_password } = request.body;

            const fieldError = getRequiredFields(["old_password", "password", "confirm_password"], request.body);
            if (fieldError) {
                return response.status(400).json(apiResponse.responseBadRequest(fieldError));
            }

            if (password !== confirm_password) {
                return response.status(400).json(apiResponse.responseBadRequest("Password and confirm password should be the same"));
            }

            // Verify old password
            const isPasswordValid = await bcrypt.compare(old_password, user.password);
            if (!isPasswordValid) {
                return response.status(400).json(apiResponse.responseBadRequest("Old password is incorrect"));
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            user.password = hashedPassword;
            await user.save();

            // Return success response
            return response.status(200).json(apiResponse.responseOk("Password has been reset successfully"));
        } catch (error) {
            console.error("Error in resetPassword:", error);
            return response.status(500).json(apiResponse.responseInternalServerError("Internal Server Error"));
        }
    }

    static async forgetPassword(request, response) {
        try {
            const { email } = request.body;

            if (!email) {
                return response.status(400).json(apiResponse.responseBadRequest("Email is required"));
            }

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return response.status(404).json(apiResponse.responseNotFound("User with this email does not registered"));
            }
                                                                                                                                                                                                                                                                                                        
            const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30m' });

            console.log("resetToken : ", resetToken);

            await sendResetEmail(user.email, resetToken, request, 'Reset Password', user.firstName);

            return response.status(200).json(apiResponse.responseOk("Password reset link sent to your email."));

        } catch (error) {
            console.error('Error in forgetPassword:', error);
            return response.status(500).json(apiResponse.responseInternalServerError("Internal server error"));
        }
    }

    static async resetPassword(request, response) {
        try {
            const { token, password } = request.body;

            if (!token || !password) {
                return response.status(400).json(apiResponse.responseBadRequest("credentials are required"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findByPk(decoded.userId);
            if (!user) {
                return response.status(404).json(apiResponse.responseNotFound("User not found"));
            }

            user.password = await bcrypt.hash(password, 10);
            await user.save();

            return response.status(200).json(apiResponse.responseOk("Password has been reset successfully."));

        } catch (error) {
            console.error('Error in resetPassword:', error);
            return response.status(500).json(apiResponse.responseInternalServerError(error?.message));
        }
    }
}

module.exports = AuthController;
