const Follower = require('../models/followers');
const ApiResponse = require('../utillity/api_response');


class FollowersController {

    static async create() {
        
    }

    static async update() {

    }

    static async retrieve() {

    }

    static async remove() {

    }

    static async bulkRemove() {

    }

    static async list(request, response) {
        const user = request.user;
        const queryParams = request.query;

        return response.json(ApiResponse.responseOk())
    }
}
module.exports = FollowersController