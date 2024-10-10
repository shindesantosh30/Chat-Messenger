const express = require('express');
const passport = require('passport');
const authGuard = require('../middleware/authMiddleware');

const router = express.Router();

// Google Login route
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

// Google Callback route
router.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/'
}), async (request, response) => {
  const jwt = require('jsonwebtoken');
  console.log("Request user : ", request.user);
  const token = jwt.sign({ userId: request.user.id }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPRE_IN });
  response.redirect(`${process.env.FRONT_END_BASE_URL}/login?token=${token}&uID=${request.user.id}`)
});

// Lazy-loaded routes (require/import when the route is accessed)
// Public routes (no authentication required)
router.use('/api/logout', async (req, res, next) => {
  const loginRoutes = require('./loginRouter');
  loginRoutes(req, res, next);
});

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
});

// Protected routes (authentication required)
router.use('/api/contact-users', authGuard, async (req, res, next) => {
  const userRouter = require('./userRoutes');
  userRouter(req, res, next);
});

router.use('/api/users', authGuard, async (req, res, next) => {
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

router.use('/api/followers', authGuard, async (req, res, next) => {
  const followersRoutes = require('./followersRouter');
  followersRoutes(req, res, next);
});

module.exports = router;
