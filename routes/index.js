const express = require('express');
const userRouter = require('./userRoutes');
const messageRoutes = require('./messagesRoutes');
const loginRoutes = require('./loginRouter');
const registrationRoutes = require('./registrationRouter');
const profileRoutes = require('./profileRouter');

const authGuard = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (no authentication required)
router.use('/login', loginRoutes);
router.use('/registration', registrationRoutes);

// Protected routes (authentication required)
router.use('/contact-users', authGuard, userRouter);
router.use('/message', authGuard, messageRoutes);
router.use('/profile', authGuard, profileRoutes);

module.exports = router;
