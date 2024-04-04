const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/list', userController.getUserList);
router.get('/add', userController.getAddUser);
router.post('/', userController.postAddUser);




module.exports = router;
