const mysql = require('mysql2/promise');
const config = require("../../config/database");
const Companies = require('../models/companies');
const Address = require('../models/address');
const User = require('../models/user');

const { getPaginationResponse, isAlpha, validateEmail } = require('../utillity/utils');
const { response } = require('express');


class CompanyController {

    static async getObject(id) {
        try {
            const instance = await Companies.findByPk(id);
            if (instance) { return instance; }
        }
        catch (error) { throw error; }
    }

    static async retrieve(request, response) {
        const id = parseInt(request.params.id);
        try {
            const companyInstance = await CompanyController.getObject(id);
            if (companyInstance) {
                response.json(companyInstance);
            } else {
                response.status(404).json({ message: 'Company not found' });
            }
        } catch (error) {
            console.error('Error getting company:', error);
            response.status(500).json({ error: 'Internal server error' });
        }
    }

    static async create(request, response) {
        const req_data = request.body;
        try {
            if (!req_data || Object.keys(req_data).length === 0) {
                return response.status(400).json({ error: 'All fields should not be empty.' });
            }
            const user_data = req_data.user
            const address_data = req_data.address

            if (!address_data) {
                return response.status(400).json({ error: 'Address is required.' });
            }
            if (!user_data.first_name && !user_data.first_name) {
                return response.status(400).json({ error: 'First name and last name is required.' });
            }
            if (req_data.company_name && !isAlpha(req_data.company_name)) {
                return response.status(400).json({ error: 'Company name should not contain special characters or numeric values.' });
            }
            if (req_data.email, user_data.email) {
                if (!validateEmail(req_data.email) && !validateEmail(user_data.email)) {
                    return response.status(400).json({ error: 'Invalid email address.' });
                }
                const existingEmployee = await Companies.findOne({ where: { email: req_data.email } });
                if (existingEmployee) {
                    return response.status(400).json({ error: 'Email already exists.' });
                }
            }
            const addressInstance = await Address.create(address_data);
            console.log("addressInstance : ", addressInstance.id);

            delete req_data.user["user"];
            delete req_data.address["address"];
            const companyInstance = await Companies.create(req_data);

            user_data['company_id'] = companyInstance.id
            user_data['address_id'] = addressInstance.id

            console.log("req_data", req_data);
            const userInstance = await User.create(user_data);
            console.log("userInstance : ", userInstance.id);


            req_data["user"] = user_data
            req_data["address"] = address_data
            console.log('New company registered successfully:', companyInstance.toJSON());
            response.status(201).json(req_data);

        } catch (error) {
            console.error('Error creating company:', error);
            response.status(500).json({ error: 'Internal server error' });
        }
    }

    static async update(request, response) {
        const id = parseInt(request.params.id);
        const req_data = request.body;

        try {

            const companyInstance = await CompanyController.getObject(id);
            if (companyInstance) {
                companyInstance.company_name = req_data.company_name;
                companyInstance.email = req_data.email;
                companyInstance.mobile = req_data.mobile;
                companyInstance.username = req_data.username;
                companyInstance.cin_number = req_data.cin_number;
                companyInstance.gst_number = req_data.gst_number;
                companyInstance.website_url = req_data.website_url;
                companyInstance.registration_date = req_data.registration_date;

                await companyInstance.save();

                response.json(companyInstance);
            } else {
                response.status(404).json({ message: 'Companies not found' });
            }
        } catch (error) {
            console.error('Error updating company:', error);
            response.status(500).json({ error: 'Internal server error' });
        }
    }

    static async list(request, response) {
        try {
            const companyQueryset = await Companies.findAll();
            const data = getPaginationResponse(companyQueryset, request);
            response.json(data);
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    }

    // Delete an company by ID
    static async delete_company(request, response) {
        const id = parseInt(request.params.id);

        try {
            const company = await CompanyController.getObject(id);
            if (company) {
                await company.destroy();
                response.sendStatus(204);
            } else {
                response.status(404).json({ message: 'Companies not found' });
            }
        } catch (error) {
            console.error('Error deleting company:', error);
            response.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = CompanyController;
