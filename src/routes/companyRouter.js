const express = require('express');
const { retrieve, create, update, list, delete_company } = require('../controllers/companyController');

const router = express.Router();


router.get('/:id', retrieve);

router.post('/', create);

router.put('/:id', update);

router.get('/', list);

router.delete('/:id', delete_company);

module.exports = router;