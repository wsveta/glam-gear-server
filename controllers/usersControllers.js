const User = require('../models/users.js')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { v4 } = require('uuid');
const { userRegisterSchema, userLoginSchema } = require('../schemas/userSchemas.js');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const transport = nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 465,
    secure: true,
    auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASSWORD
    }
});

const registerUser = async (req, res, next) => {
    const { name, password, email } = req.body;
    try {
        await userRegisterSchema.validateAsync({ name, password, email });

        const processedName = name.trim();
        const processedPas = password.trim();
        const processedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: processedEmail });

        if (user !== null) {
            return res.status(409).send({ message: "Email in use" })
        }

        const passwordHash = await bcrypt.hash(processedPas, 10);
        const verificationToken = v4();

        await transport.sendMail({
            to: email,
            from: 'phone-book@zohomail.eu',
            subject: "Welcome to Glam Gear! Quick email check to start",
            html: `To confirm you registration please click on the <a href="http://localhost:5000/users/verify/${verificationToken}">link</a>`,
            text: `To confirm you registration please open the link http://localhost:5000/users/verify/${verificationToken}`,
        });

        const data = await User.create({ name: processedName, password: passwordHash, email: processedEmail, verificationToken });

        res.status(201).send({ user: { email: data.email, name: data.name } });
    } catch (error) {
        res.send({ message: error.message });
    }
}

const verifyUser = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken });

        if (user === null) {
            return res.status(404).send({ message: 'User not found' });
        }

        await User.findOneAndUpdate({ verificationToken }, { verify: true, verificationToken: null });

        res.status(200).send({ message: "Verification successful" });
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
}

const resendVerificationEmail = async (req, res, next) => {
    const { email } = req.body;

    try {
        await emailSchema.validateAsync({ email });
        const processedEmail = email.toLowerCase().trim();

        if (!processedEmail) {
            return res.status(400).send({ message: "Missing required field email" });
        }

        const user = await User.findOne({ email: processedEmail });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        if (user.verify === true) {
            return res.status(400).send({ message: "Verification has already been passed" });
        }

        const verificationToken = v4();

        await transport.sendMail({
            to: email,
            from: 'phone-book@zohomail.eu',
            subject: "Welcome to Glam Gear! Quick email check to start",
            html: `To confirm you registration please click on the <a href="http://localhost:5000/users/verify/${verificationToken}">link</a>`,
            text: `To confirm you registration please open the link http://localhost:5000/users/verify/${verificationToken}`,
        });

        await User.findOneAndUpdate({ email: processedEmail }, { verificationToken });

        res.status(200).send({ message: "Verification email send" });
    } catch (error) {
        res.status(404).send({ message: error.message });
    }

}

const loginUser = async (req, res, next) => {
    const { password, email } = req.body;

    try {
        await userLoginSchema.validateAsync({ password, email });

        const processedPas = password.trim();
        const processedEmail = email.toLowerCase().trim();

        if (user === null) {
            return res.status(401).send({ "message": "Email or password is wrong" })
        }

        const isMatch = await bcrypt.compare(processedPas, user.password);

        if (!isMatch) {
            return res.status(401).send({ "message": "Email or password is wrong" })
        }

        if (user.verify === false) {
            return res.status(401).send({ message: "Your account is not verified yet" });
        }

        const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.SECRET_KEY, { expiresIn: "1h" });

        await User.findByIdAndUpdate(user._id, { token });

        res.status(200).send({ token, user: { email: user.email } });

    } catch (error) {
        res.send({ message: error.message });
    }
}

module.exports = {
    registerUser,
    verifyUser,
    resendVerificationEmail,
    loginUser
};