const { Op } = require('sequelize');

const User = require('../models/users');
const { Follower, to_dict } = require('../models/followers');
const { UserSettings } = require('../models/userSettings');
const ApiResponse = require('../utillity/api_response');
const { getPaginationResponse } = require('../utillity/utils');


class FollowersController {

    static async create(request, response) {
        try {
            const { followerId, action } = request.body;

            if (!followerId) {
                return response.status(400).json(ApiResponse.responseBadRequest("Please select the follower."));
            }

            if (action === undefined || (action !== 1 && action !== 0)) {
                return response.status(400).json(ApiResponse.responseBadRequest("Invalid action. Must be follow or unfollow."));
            }

            const followerUser = await User.findByPk(followerId);
            if (!followerUser) {
                return response.status(404).json(ApiResponse.responseNotFound("Follower not found."));
            }

            const settings = await UserSettings.findOne({ where: { userId: followerId } });
            if (!settings) {
                return response.status(404).json(ApiResponse.responseNotFound("User settings not found."));
            }

            if (action === 1) {
                const [instance, created] = await Follower.findOrCreate({
                    where: {
                        userId: followerId,
                        followerId: request.user.id
                    },
                    defaults: {
                        requestStatus: settings.isPrivate ? 1 : 2,
                        isBlocked: false
                    }
                });

                if (!created) {
                    return response.status(200).json(ApiResponse.responseOk("You are already following this user."));
                }
                return response.status(200).json(ApiResponse.responseOk("Followed successfully."));
            }

            if (action === 0) {
                const instance = await Follower.findOne({
                    where: {
                        followerId: request.user.id,
                        userId: followerId
                    }
                });

                if (!instance) {
                    return response.status(404).json(ApiResponse.responseNotFound("Follow relationship not found."));
                }

                await instance.destroy();
                return response.status(200).json(ApiResponse.responseOk("Unfollowed successfully."));
            }
        } catch (error) {
            console.error("Error in follow/unfollow API:", error);
            return response.status(500).json(ApiResponse.responseInternalServerError("An error occurred while processing your request."));
        }
    }

    static async retrieve(request, response) {
        try {
            const { id } = request.params;

            if (!id) {
                return response.status(400).json(ApiResponse.responseBadRequest("Please select the follower."));
            }
            console.log(id, "", typeof parseInt(id));

            const instance = await Follower.findByPk(id, {
                include: [{ model: User, as: 'User' }]
            });

            if (!instance) {
                return response.status(404).json(ApiResponse.responseNotFound("Follower not found."));
            }
            const data = to_dict(instance);

            data.name = `${instance.User.firstName} ${instance.User.lastName}`;
            data.mobile = instance.User.mobile;
            data.username = instance.User.username;

            return response.status(200).json(ApiResponse.responseOk("Success", 200, true, data));

        } catch (error) {
            console.error("Error retrieving follower:", error);
            return response.status(500).json(ApiResponse.responseInternalServerError("An error occurred while retrieving the follower."));
        }
    }

    static async list(request, response) {
        try {
            const user = request.user;
            const { followers, followings } = request.query;
            let queryset;

            if (followings) {
                queryset = await Follower.findAll({
                    where: { followerId: user.id },
                    include: [{ model: User, as: 'User' }]
                });
                console.log("queryset ", queryset);

            } else if (followers) {
                queryset = await Follower.findAll({
                    where: { userId: user.id },
                    include: [{ model: User, as: 'FollowerUser' }]
                });
            } else {
                queryset = await Follower.findAll({
                    where: {
                        [Op.or]: [
                            { userId: user.id },
                            { followerId: user.id }
                        ],
                    },
                    include: [
                        { model: User, as: 'FollowerUser' },
                        { model: User, as: 'User' }
                    ]
                });
            }

            const transformData = queryset.map(transform);
            const data = getPaginationResponse(transformData, request);

            return response.status(200).json({
                status: 'success',
                data: data
            });
        } catch (error) {
            console.error('Error fetching follower/following list:', error);
            return response.status(500).json(ApiResponse.responseInternalServerError('An error occurred.'));
        }
    }
}

const transform = (instance) => {
    if (!instance) return null;
    return {
        userId: instance.userId,
        followerId: instance.followerId,
        requestStatus: instance.getRequestStatusDisplay(),
        createdAt: instance.createdAt,
        FollowerUser: instance.FollowerUser
            ? {
                name: `${instance.FollowerUser.firstName || ''} ${instance.FollowerUser.lastName || ''}`,
                username: instance.FollowerUser.username || ''
            }
            : {
                name: `${instance.User.firstName || ''} ${instance.User.lastName || ''}`,
                username: instance.User.username || ''
            }
    };
};

module.exports = FollowersController
