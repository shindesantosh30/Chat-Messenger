const express = require('express');
const router = express.Router();

const {retrieve, create, update, list, delete_role} = require('../controllers/rolesController');


router.get('/:id', retrieve);

router.post('/', create);

router.put('/:id', update);

router.get('/', list);

router.delete('/:id', delete_role);

module.exports = router;