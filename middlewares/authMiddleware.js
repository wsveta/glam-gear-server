require('dotenv').config();

function authMiddleware(req, res, next) {
    if (!req.user) {
        return res.status(401).send({ message: "Unauthorized" });
    }

    const authorizationHeader = req.headers['authorization'];

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const token = authorizationHeader.split(' ')[1];

        try {
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

            const currentTime = Math.floor(Date.now() / 1000);

            if (decodedToken.exp <= currentTime) {
                return res.status(401).send({ message: "Token expired" });
            }

            if (decodedToken.iat > currentTime) {
                return res.status(401).send({ message: "Invalid token issue time" });
            }
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
    } else {
        return res.status(401).send({ message: "Unauthorized" })
    };
    next();
}

module.exports = authMiddleware;