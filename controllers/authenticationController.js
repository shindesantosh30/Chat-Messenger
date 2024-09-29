require('dotenv').config();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/users');
const ResetToken = require('../models/resetToken');
const { sendResetEmail } = require('../utillity/authUtility');
const { getRequiredFields } = require('../utillity/helper');
const apiResponse = require('../utillity/api_response');


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
                return response.status(404).json(apiResponse.responseNotFound("User with this email is not registered"));
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // hashed token for storage
            const expiresAt = new Date(Date.now() + 900000); // 15-minute expiration

            await ResetToken.create({
                userId: user.id, token: hashedToken, expiresAt: expiresAt
            });

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
                return response.status(400).json(apiResponse.responseBadRequest("Token and password are required"));
            }

            // Hash the provided token to compare with stored hashed token
            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

            const tokenInstance = await ResetToken.findOne({ where: { token: hashedToken } });
            if (!tokenInstance) {
                return response.status(404).json(apiResponse.responseNotFound("Token not found or expired. Please try resetting your password again."));
            }

            if (tokenInstance.expiresAt < new Date()) {
                return response.status(400).json(apiResponse.responseBadRequest("Token has expired"));
            }

            const user = await User.findByPk(tokenInstance.userId);
            if (!user) {
                return response.status(404).json(apiResponse.responseNotFound("User not found"));
            }

            user.password = await bcrypt.hash(password, 10);
            await user.save();

            // Optionally, delete the reset token after successful password reset
            await ResetToken.destroy({ where: { userId: user.id } });

            return response.status(200).json(apiResponse.responseOk("Password has been reset successfully."));

        } catch (error) {
            console.error('Error in resetPassword:', error);
            return response.status(500).json(apiResponse.responseInternalServerError(error?.message || "Internal server error"));
        }
    }
}

module.exports = AuthController;
