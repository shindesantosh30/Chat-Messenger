const express = require('express');
const authGuard = require('../middleware/authMiddleware');

const router = express.Router();

// Lazy-loaded routes (require/import when the route is accessed)

// Public routes (no authentication required)
router.use('/auth/login', async (req, res, next) => {
  const loginRoutes = require('./loginRouter');
  loginRoutes(req, res, next);
});

router.use('/auth/signup', async (req, res, next) => {
  const registrationRoutes = require('./registrationRouter');
  registrationRoutes(req, res, next);
});

router.use('/auth/forget-password', async (req, res, next) => {
  const forgetPassword = require('./forget_password');
  forgetPassword(req, res, next);
});

router.use('/auth/reset-password', async (req, res, next) => {
  const resetPassword = require('./reset_password');
  resetPassword(req, res, next);
});

router.use('/auth/change-password', authGuard, async (req, res, next) => {
  const changePassword = require('./changePassword');
  changePassword(req, res, next);

})

// Protected routes (authentication required)
router.use('/api/contact-users', authGuard, async (req, res, next) => {
  const userRouter = require('./userRoutes');
  userRouter(req, res, next);
});

router.use('/api/message', authGuard, async (req, res, next) => {
  const messageRoutes = require('./messagesRoutes');
  messageRoutes(req, res, next);
});

router.use('/api/profile', authGuard, async (req, res, next) => {
  const profileRoutes = require('./profileRouter');
  profileRoutes(req, res, next);
});

router.use('/api/upload', authGuard, async (req, res, next) => {
  const fileUploadRoutes = require('./fileUploadRouter');
  fileUploadRoutes(req, res, next);
});

module.exports = router;
