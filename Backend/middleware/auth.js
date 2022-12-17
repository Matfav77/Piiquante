const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userID;
        req.auth = {
            userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error })
    }
}