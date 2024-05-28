const express = require('express');
const { registerUser, verifyUser, resendVerificationEmail, loginUser } = require('../controllers/usersControllers');

const usersRouter = express.Router();

usersRouter.post('/signup', registerUser);

usersRouter.get('/verify/:verificationToken', verifyUser);

usersRouter.post('/verify', resendVerificationEmail);

usersRouter.post('/login', loginUser);

module.exports = usersRouter;
