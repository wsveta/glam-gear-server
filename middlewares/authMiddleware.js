require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/users');

async function authMiddleware(req, res, next) {
    const authorizationHeader = req.headers.authorization;

    if (typeof authorizationHeader === "undefined") {
        return res.status(401).send({ "message": "Not authorized1" });
    }

    const [bearer, token] = authorizationHeader.split(" ", 2);
    if (bearer !== "Bearer") {
        return res.status(401).send({ "message": "Not authorized2" });
    }
    jwt.verify(token, process.env.SECRET_KEY, async (error, decode) => {
        if (error) {
            return res.status(401).send({ "message": "Not authorized3" });
        }
        try {
            const user = await User.findById(decode.id);

            if (user === null) {
                return res.status(401).send({ "message": "Not authorized4" });
            }

            if (user.token !== token) {
                return res.status(401).send({ "message": "Not authorized5" });
            }

            req.user = {
                id: user._id,
                email: user.email
            }
            next();
        } catch (error) {
            res.status(400).send({ message: error.message })
            next(error);
        }
    })
}

module.exports = authMiddleware;
