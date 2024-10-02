const { UserSettings, to_dict } = require('../models/userSettings')
const ApiResponse = require('../utillity/api_response')


class SettingsController {
    static async update(request, response) {

    }

    static async retrieve(request, response) {
        const instance = await UserSettings.findOne({ where: { userId: request.user.id } });

        if (!instance) {
            response.status(404).json(ApiResponse.responseBadRequest("Setting not found, Please try again later."))
        }
        const data = to_dict(instance)
        return response.status(200).json(data)
    }
}

module.exports = { SettingsController }