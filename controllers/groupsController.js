const Group = require('../models/groups');
const GroupUser = require('../models/groupUser');
const apiResponse = require('../utillity/api_response');
const { getRequiredFields } = require('../utillity/helper');
const { fullTextSearch } = require('../utillity/db');

class GroupsController {
    static async getInstance(pk) {
        try {
            const group = await Group.findByPk(pk);
            return group || null;
        } catch (error) {
            console.error("Error fetching group by primary key:", error);
            return null;
        }
    }

    static async get(request, response) {
        try {
            const whereClause = request.query.q ? fullTextSearch(['name'], request.query.q) : {};

            const userGroups = await GroupUser.findAll({
                where: {
                    userId: request.user.id,
                },
                attributes: ['groupId', 'isAdmin'],
                include: [
                    {
                        model: Group,
                        as: 'group',
                        where: whereClause,
                        attributes: ['id', 'name', 'description', 'createdBy', 'createdAt', 'updatedAt']
                    }
                ]
            });

            const transformedGroups = await Promise.all(
                userGroups.map(GroupsController.transformUserGroups)
            );

            return response.status(200).json(apiResponse.responseOk(transformedGroups));
        } catch (error) {
            console.error("Error fetching groups:", error);
            return response.status(500).json(apiResponse.responseInternalServerError(error.message));
        }
    }


    static async getById(request, response) {
        try {
            const { id } = request.params;
            const instance = await Group.findByPk(id);
            if (!instance) {
                return response.status(404).json(apiResponse.responseNotFound("Group not found"));
            }
            return response.status(200).json(apiResponse.responseOk(await GroupsController.transform(instance)));
        } catch (error) {
            console.error("Error fetching group:", error);
            return response.status(500).json(apiResponse.responseInternalServerError(error));
        }
    }

    static async post(request, response) {
        try {
            const { name, description, groupUsers } = request.body;
            const fieldError = getRequiredFields(["name", "groupUsers"], request.body);
            if (fieldError) {
                return response.status(400).json(apiResponse.responseBadRequest(fieldError));
            }
            if (!Array.isArray(groupUsers)) {
                return response.status(400).json(apiResponse.responseBadRequest("Please add the valid users"));
            }

            const groupInstance = await Group.create({
                name: name.trim(),
                description: description ? description.trim() : null,
                createdBy: request.user.id
            });

            const groupUsersData = [];

            for (let index = 0; index < groupUsers.length; index++) {
                groupUsersData.push({
                    groupId: groupInstance.id,
                    userId: groupUsers[index],
                    isAdmin: groupUsers[index] === request.user.id
                });
            }

            const groupUserInstances = await GroupUser.bulkCreate(groupUsersData);
            console.log("groupUserInstances : ", groupUserInstances);

            return response.status(201).json(apiResponse.responseCreated("Group created successfully.", 201, true, await GroupsController.transform(groupInstance)));
        } catch (error) {
            console.error("Error creating group:", error);
            return response.status(500).json(apiResponse.responseInternalServerError(error));
        }
    }

    static async put(request, response) {
        try {
            const { id } = request.params;
            const { name, description } = request.body;
            console.log(id);

            if (name && !name.trim()) {
                return response.status(400).json(apiResponse.responseBadRequest("Please add a valid group name"));
            }

            const instance = await Group.findByPk(id);
            if (!instance) {
                return response.status(404).json(apiResponse.responseNotFound("Group not found"));
            }

            await instance.update({ name: name.trim(), description });
            return response.status(200).json(apiResponse.responseOk(request.body));
        } catch (error) {
            console.error("Error updating group:", error);
            return response.status(500).json(apiResponse.responseInternalServerError(error));
        }
    }

    static async delete(request, response) {
        try {
            const { id } = request.params;
            const group = await Group.findByPk(id);

            if (!group) {
                return response.status(404).json(apiResponse.responseNotFound("Group not found"));
            }

            await group.destroy();
            return response.status(200).json(apiResponse.responseOk("Group deleted successfully"));
        } catch (error) {
            console.error("Error deleting group:", error);
            return response.status(500).json(apiResponse.responseInternalServerError(error));
        }
    }

    static async deleteAll(request, response) {
        try {
            await Group.destroy({ where: {}, truncate: true });
            return response.status(200).json(apiResponse.responseOk("All groups deleted successfully"));
        } catch (error) {
            console.error("Error deleting all groups:", error);
            return response.status(500).json(apiResponse.responseInternalServerError(error));
        }
    }

    static async transform(instance) {
        return {
            id: instance.id,
            name: instance.name,
            description: instance.description,
            createdBy: instance.createdBy,
            createdAt: instance.createdAt,
            updatedAt: instance.updatedAt,
        };
    }

    static async transformUserGroups(instance) {
        return {
            id: instance.group.id,
            name: instance.group.name,
            description: instance.group.description,
            createdBy: instance.group.createdBy,
            isAdmin: instance.isAdmin,
            createdAt: instance.group.createdAt,
            updatedAt: instance.group.updatedAt,
        };
    }
}

module.exports = GroupsController;
