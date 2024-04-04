const Roles = require('../models/roles');
const { getPaginationResponse } = require('../utillity/utils');
const mysql = require('mysql2/promise');
const config = require("../../config/database");


class RoleController {
    singularName = "Roles";

    static async getObject(id) {
        try {
            const roles = await Roles.findByPk(id);
            if (roles) {
                return roles;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    }

    static async retrieve(request, response) {
        const id = parseInt(request.params.id);
        try {

            const role_instance = await RoleController.getObject(id); // Use this.getObject

            if (role_instance) {
                role_instance['status'] = 200;
                response.status(200).json(role_instance);
            } else {
                response.status(404).json({ message: 'Role not found' });
            }
        } catch (error) {
            console.error('Error retrieving role:', error);
            response.status(500).json({ error: 'Internal server error' });
        }
    }


    static async create(request, response) {
        const req_data = request.body;
        try {
            if (!req_data || Object.keys(req_data).length === 0) {
                console.log("All fields should not be empty");
                return response.status(400).json({ error: 'All fields should not be empty.' });
            }

            const role_instance = await Roles.create(req_data);
            console.log('New role created:', role_instance.toJSON());

            response.status(201).json(role_instance);
        } catch (error) {
            console.error('Error creating role:', error);
            response.status(500).json({ error: 'Internal server error' });
        }
    }

    static async update(request, response) {
        const id = parseInt(request.params.id);
        const req_data = request.body;
        try {
            if (!id) {
                return response.status(404).json({ message: 'Role id is required' });
            }
            const role_instance = await RoleController.getObject(id);

            if (!role_instance) {
                return response.status(404).json({ message: 'Role not found' });
            }

            await role_instance.update(req_data);

            response.json({ message: 'Role updated successfully' });
        } catch (error) {
            console.error('Error updating role:', error);
            response.status(500).json({ error: 'Internal server error' });
        }
    }

    static async list(request, response) {
        try {
            const roles_queryset = await Roles.findAll();
            const data = getPaginationResponse(roles_queryset, request);
            response.json(data);
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    }

    static async delete_role(request, response) {
        const id = parseInt(request.params.id);
        try {
            if (!id) {
                return response.status(404).json({ message: 'Role id is required' });
            }
            const role_instance = await RoleController.getObject(id);

            if (!role_instance) {
                return response.status(404).json({ message: 'Role not found' });
            }
            await role_instance.update({ id_active: false });
            response.status(200).json({ message: 'Role deleted successfully' });
        } catch (error) {
            console.error('Error deleting role:', error);
            response.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = RoleController;



















// const getObject = async (id) => {
//     try {
//         const roles = await Roles.findByPk(id);
//         if (roles) {
//             return roles;
//         } else {
//             return null
//         }
//     } catch (error) {
//         return error
//     }
// };

// // Read a single student by ID
// const retrieve = (request, response) => {
//     const id = parseInt(request.params.id);
//     try {
//         if (!id) {
//             return response.status(404).json({ message: 'Role id is required' });
//         }
//         const role_instance = getObject(id)

//         if (role_instance) {
//             response.status(200).json(role_instance);
//         } else {
//             response.status(404).json({ message: 'Role not found' });
//         }
//     }
//     catch (error) {
//         console.error('Error updating role:', error);
//         response.status(500).json({ error: 'Internal server error' });
//     }
// };

// // Create a new role
// const create = async (request, response) => {
//     const req_data = request.body;
//     try {

//         if (!req_data || Object.keys(req_data).length === 0) {
//             console.log("All fields should not be empty");
//             return response.status(400).json({ error: 'All fields should not be empty.' });
//         }
//         console.log("request_data: ", req_data);

//         const role_instance = await Roles.create(req_data);
//         console.log('New role created:', role_instance.toJSON());

//         // Send a response after successfully creating the employee
//         response.status(201).json(role_instance);
//     } catch (error) {
//         console.error('Error creating role:', error);
//         response.status(500).json({ error: 'Internal server error' });
//     }
//     finally {
//         console.log("End request...");
//     }
// };

// // Update a student by ID
// const update = async (request, response) => {
//     const id = parseInt(request.params.id);
//     const req_data = request.body;
//     try {
//         if (!id) {
//             return response.status(404).json({ message: 'Role id is required' });
//         }
//         const role_instance = getObject(id)

//         if (!role_instance) {
//             return response.status(404).json({ message: 'Role not found' });
//         }

//         // Update the role attributes based on the updates provided
//         await role_instance.update(req_data);

//         response.json({ message: 'Role updated successfully' });
//     } catch (error) {
//         console.error('Error updating role:', error);
//         response.status(500).json({ error: 'Internal server error' });
//     }
// };

// // Get roles list
// const list = async (request, response) => {
//     await Roles.findAll()
//         .then(roles_queryset => {
//             const data = getPaginationResponse(roles_queryset, request);
//             response.json(data);
//         })
//         .catch(error => {
//             response.status(500).json({ message: 'Internal server error' });
//         });
// };

// // Delete a student by ID
// const delete_role = async (request, response) => {
//     const id = parseInt(request.params.id);
//     try {
//         if (!id) {
//             return response.status(404).json({ message: 'Role id is required' });
//         }
//         const role_instance = getObject(id)

//         if (!role_instance) {
//             return response.status(404).json({ message: 'Role not found' });
//         }
//         // Delete the role from the database
//         await role_instance.destroy();

//         response.status(200).json({ message: 'Role deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting role:', error);
//         response.status(500).json({ error: 'Internal server error' });
//     }
// };

// module.exports = {
//     retrieve,
//     create,
//     update,
//     list,
//     delete_role,
// };

