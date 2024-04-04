
// src/routes/students.js
const express = require('express');
const router = express.Router();

const {getStudents, getStudentById, createStudent, updateStudent, deleteStudent} = require('../controllers/studentController');


// Read all students
router.get('/', getStudents);

// Read a single student by ID
router.get('/:id', getStudentById);

// Create a new student
router.post('/', createStudent);

// Update a student by ID
router.put('/:id', updateStudent);

// Delete a student by ID
router.delete('/:id', deleteStudent);

module.exports = router;