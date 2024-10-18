const { Op } = require('sequelize');

const Group = require('../models/groups');
const GroupUser = require('../models/groupUser');
const User = require('../models/users');
const apiResponse = require('../utillity/api_response');

class GroupUsersController {
    static modelClass = GroupUser;

    static async getInstance(pk) {
        try {
            const instance = await GroupUser.findOne({
                where: { id: pk },
                include: [
                    {
                        model: User,
                        as: 'user',
                    },
                    {
                        model: Group,
                        as: 'group',
                    }
                ]
            });
            return instance || null;
        } catch (error) {
            console.error("Error fetching group user by primary key:", error);
            return null;
        }
    }

    static async get(request, response) {
        try {
            const userGrous = await GroupUser.findAll({
                where: {
                    userId: request.user.id,
                },
            });
            return response.status(200).json(apiResponse.responseOk(userGrous));
        } catch (error) {
            console.error("Error fetching userGrous:", error);
            return response.status(500).json(apiResponse.responseInternalServerError(error));
        }
    }

    static async getById(request, response) {
        try {
            const { id } = request.params;
            const instance = await GroupUsersController.getInstance(id);
            if (!instance) {
                return response.status(404).json(apiResponse.responseNotFound("Group user not found"));
            }

            return response.status(200).json(apiResponse.responseOk(await GroupUsersController.transform(instance)));
        } catch (error) {
            console.error("Error fetching group:", error);
            return response.status(500).json(apiResponse.responseInternalServerError(error));
        }
    }

    static async post(request, response) {
        try {
            const { users, isAdmin } = request.body;

            if (!users || !Array.isArray(users) || users.length === 0) {
                return response.status(400).json(apiResponse.responseBadRequest("Please select the users."));
            }

            const validUsers = [];

            for (const item of users) {
                if (!item?.userId) {
                    return response.status(400).json(apiResponse.responseBadRequest("Please select a valid user."));
                }

                if (!item?.groupId) {
                    return response.status(400).json(apiResponse.responseBadRequest("Please select a valid group."));
                }

                const userExists = await User.findByPk(item.userId);
                if (!userExists) {
                    return response.status(404).json(apiResponse.responseNotFound(`Selected user is not in your contact list.`));
                }

                const groupExists = await Group.findByPk(item.groupId);
                if (!groupExists) {
                    return response.status(404).json(apiResponse.responseNotFound(`Group does not exist.`));
                }
                if (await GroupUser.findOne({ where: { userId: item.userId, groupId: item.groupId } })) {
                    continue
                }
                validUsers.push({ userId: item.userId, groupId: item.groupId });
            }

            const newGroups = await GroupUser.bulkCreate(validUsers.map(({ userId, groupId }) => ({ userId, groupId, isAdmin: false })));

            return response.status(201).json(apiResponse.responseCreated(newGroups));
        } catch (error) {
            console.error("Error creating groups:", error);
            return response.status(500).json(apiResponse.responseInternalServerError(error));
        }
    }

    static async put(request, response) {
        try {
            const { id } = request.params;
            const { isAdmin } = request.body;

            if (typeof isAdmin !== 'boolean') {
                return response.status(400).json(apiResponse.responseBadRequest("Admin access must be a valid."));
            }
            console.log(id);

            const instance = await GroupUsersController.getInstance(id);
            if (!instance) {
                return response.status(404).json(apiResponse.responseNotFound("Group user not found"));
            }

            await instance.update({ isAdmin });

            return response.status(200).json(apiResponse.responseOk(request.body));
        } catch (error) {
            console.error("Error updating group user association:", error);
            return response.status(500).json(apiResponse.responseInternalServerError(error));
        }
    }

    static async delete(request, response) {
        try {
            const { id } = request.params;
            const instance = await GroupUsersController.getInstance(id);

            if (!instance) {
                return response.status(404).json(apiResponse.responseNotFound("Group not found"));
            }

            await instance.destroy();
            return response.status(200).json(apiResponse.responseOk("Group user deleted successfully"));
        } catch (error) {
            console.error("Error deleting group:", error);
            return response.status(500).json(apiResponse.responseInternalServerError(error));
        }
    }

    static async deleteAll(request, response) {
        try {
            const { idList } = request.body;

            if (!Array.isArray(idList) || idList.length === 0) {
                return response.status(400).json(apiResponse.responseBadRequest("idList must be a non-empty array."));
            }

            await GroupUser.destroy({
                where: {
                    id: {
                        [Op.in]: idList,
                    }
                }
            });

            return response.status(200).json(apiResponse.responseOk("Group users deleted successfully"));
        } catch (error) {
            console.error("Error deleting groups:", error);
            return response.status(500).json(apiResponse.responseInternalServerError(error));
        }
    }

    static async transform(instance) {
        return {
            id: instance.id,
            groupId: instance.groupId,
            isAdmin: instance.isAdmin,
            userId: instance.userId,
            createdAt: instance.createdAt,
            updatedAt: instance.updatedAt,
        };
    }
}

module.exports = GroupUsersController;
