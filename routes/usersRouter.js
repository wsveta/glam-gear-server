const express = require('express');
const { registerUser, verifyUser, resendVerificationEmail, loginUser, logoutUser } = require('../controllers/usersControllers');
const authMiddleware = require('../middlewares/authMiddleware');

const usersRouter = express.Router();

usersRouter.post('/register', registerUser);

usersRouter.get('/verify/:verificationToken', verifyUser);

usersRouter.post('/verify', resendVerificationEmail);

usersRouter.post('/login', loginUser);

usersRouter.post('/logout', authMiddleware, logoutUser);

module.exports = usersRouter;
