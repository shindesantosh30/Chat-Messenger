const express = require('express');
const { retrieve, create, update, list, delete_employee } = require('../controllers/employeeController');

const router = express.Router();


router.get('/:id', retrieve);

router.post('/', create);

router.put('/:id', update);

router.get('/', list);

router.delete('/:id', delete_employee);

module.exports = router;