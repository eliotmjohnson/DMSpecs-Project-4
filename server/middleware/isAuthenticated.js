// Import modules and environment variables
require('dotenv').config()
const jwt = require('jsonwebtoken')

// Get secret key to encode JWT
const {SECRET} = process.env

module.exports = {
    isAuthenticated: (req, res, next) => {
        // Get auth header value
        const headerToken = req.get('Authorization')

        // Validate token exists
        if (!headerToken) {
            console.log('ERROR IN auth middleware')
            res.sendStatus(401)
        }

        let token

        // Verifying the token
        try {
            token = jwt.verify(headerToken, SECRET)
        } catch (err) {
            err.statusCode = 500
            throw err
        }

        // If can't verify, return not authenticated
        if (!token) {
            const error = new Error('Not authenticated.')
            error.statusCode = 401
            throw error
        }

        next()
    }
}