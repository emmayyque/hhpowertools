const jwt = require('jsonwebtoken')
require('dotenv').config
const jwtSecret = process.env.JWT_SECRET

const fetchUser = (req, res, next) => {
    // Get the User from the authToken and ID to request
    const authToken = req.header('auth-token')
    if (!authToken) {
        res.status(401).send({ error: "Please authenticate using a valid Token"})
    }

    try {
        const data = jwt.verify(authToken, jwtSecret)
        req.user = data.user
        next()
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid Token"})
    }
}

module.exports = fetchUser;