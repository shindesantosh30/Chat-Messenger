// import { get_pagination_resp } from '../utility/utils.js'; // Correct the path if needed

const {getPaginationResponse} = require('../utillity/utils');
 
// Dummy data - in-memory storage for students
let students = [
  { id: 1, name: 'John Doe', age: 20 },
  { id: 2, name: 'Jane Smith', age: 22 },
  { id: 3, name: 'Michael Johnson', age: 19 },
  { id: 4, name: 'Emily Davis', age: 21 },
  { id: 5, name: 'Daniel Williams', age: 23 },
  { id: 6, name: 'Olivia Brown', age: 20 },
  { id: 7, name: 'Matthew Jones', age: 22 },
  { id: 8, name: 'Ava Martinez', age: 19 },
  { id: 9, name: 'William Miller', age: 21 },
  { id: 10, name: 'Sophia Taylor', age: 23 },
  { id: 11, name: 'James Anderson', age: 20 },
  { id: 12, name: 'Isabella White', age: 22 },
  { id: 13, name: 'Alexander Lee', age: 19 },
  { id: 14, name: 'Ella Harris', age: 21 },
  { id: 15, name: 'Benjamin Clark', age: 23 },
];


  // Read all students
  const getStudents = (req, res) => {
    data = getPaginationResponse(students, req)
    res.json(data);
  };
  
  // Read a single student by ID
  const getStudentById = (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.find((s) => s.id === id);
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  };
  
  // Create a new student
  const createStudent = (req, res) => {
    const { name, age } = req.body;
    const newStudent = { id: students.length + 1, name, age };
    students.push(newStudent);
    res.status(201).json(newStudent);
  };
  
  // Update a student by ID
  const updateStudent = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, age } = req.body;
    const student = students.find((s) => s.id === id);
    if (student) {
      student.name = name;
      student.age = age;
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  };
  
  // Delete a student by ID
  const deleteStudent = (req, res) => {
    const id = parseInt(req.params.id);
    const index = students.findIndex((s) => s.id === id);
    if (index !== -1) {
      students.splice(index, 1);
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  };
  
  module.exports =  {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
  };
  