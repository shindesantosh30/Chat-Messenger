const mysql = require('mysql2/promise');
const config = require("../../config/database");
const Employee = require('../models/employee');
const { getPaginationResponse, isAlpha, validateEmail } = require('../utillity/utils');
const { response } = require('express');


class EmployeeController {

    static async getObject(id) {
        try {
            const instance = await Employee.findByPk(id);
            if (instance) {
                return instance;
            }
        } catch (error) {
            throw error;
        }
    }

    // Read a single employee by ID
    static async retrieve(request, response) {
        const id = parseInt(request.params.id);
        try {
            const employeeInstance = await EmployeeController.getObject(id);
            if (employeeInstance) {
                response.json(employeeInstance);
            } else {
                response.status(404).json({ message: 'Employee not found' });
            }
        } catch (error) {
            console.error('Error getting employee:', error);
            response.status(500).json({ error: 'Internal server error' });
        }
    }

    // Create a new employee
    static async create(request, response) {
        const req_data = request.body;

        try {
            if (!req_data || Object.keys(req_data).length === 0) {
                return response.status(400).json({ error: 'All fields should not be empty.' });
            }

            if (req_data.name && !isAlpha(req_data.name)) {
                return response.status(400).json({ error: 'Name should not contain special characters or numeric values.' });
            }

            if (req_data.email) {
                if (!validateEmail(req_data.email)) {
                    return response.status(400).json({ error: 'Invalid email address.' });
                }
                const existingEmployee = await Employee.findOne({ where: { email: req_data.email } });
                if (existingEmployee) {
                    return response.status(400).json({ error: 'Email already exists.' });
                }
            }
            const newEmployee = await Employee.create(req_data);
            console.log('New employee created:', newEmployee.toJSON());
            response.status(201).json(newEmployee);
        } catch (error) {
            console.error('Error creating employee:', error);
            response.status(500).json({ error: 'Internal server error' });
        }
    }

    // Update an employee by ID
    static async update(request, response) {
        const id = parseInt(request.params.id);
        const req_data = request.body;
        roles_queryset
        try {
            const employeeInstance = await EmployeeController.getObject(id);
            if (employeeInstance) {
                employeeInstance.name = req_data.name;
                employeeInstance.emp_id = req_data.emp_id;
                employeeInstance.adhar_card = req_data.adhar_card;
                employeeInstance.pan_card = req_data.pan_card;
                employeeInstance.joining_date = req_data.joining_date;
                employeeInstance.birth_date = req_data.birth_date;
                await employeeInstance.save();

                response.json(employeeInstance);
            } else {
                response.status(404).json({ message: 'Employee not found' });
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            response.status(500).json({ error: 'Internal server error' });
        }
    }

    static async list(request, response) {
        try {
            const employeeQueryset = await Employee.findAll();
            const data = getPaginationResponse(employeeQueryset, request);
            response.json(data);
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    }

    // Delete an employee by ID
    static async delete_employee(request, response) {
        const id = parseInt(request.params.id);

        try {
            const employee = await EmployeeController.getObject(id);
            if (employee) {
                await employee.destroy();
                response.sendStatus(204);
            } else {
                response.status(404).json({ message: 'Employee not found' });
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
            response.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = EmployeeController;
