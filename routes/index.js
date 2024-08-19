const express = require('express');
const userRouter = require('./userRoutes');
const messageRoutes = require('./messagesRoutes');
const loginRoutes = require('./loginRouter');
const registrationRoutes = require('./registrationRouter');
const profileRoutes = require('./profileRouter');
const fileUploadRoutes = require('./fileUploadRouter');

const authGuard = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (no authentication required)
router.use('api/login', loginRoutes);
router.use('api/registration', registrationRoutes);

// Protected routes (authentication required)
router.use('/api/contact-users', authGuard, userRouter);
router.use('/api/message', authGuard, messageRoutes);
router.use('/api/profile', authGuard, profileRoutes);
router.use('/api/upload', authGuard, fileUploadRoutes);

module.exports = router;
