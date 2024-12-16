const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateUser = (req, res, next) => {
    // Get the token from the request header
    const token = req.header('Authorization')?.split(' ')[1]; // "Bearer <token>"
    
    if (!token) {
        return res.status(401).send('Access Denied: No token provided');
    }

    try {
        // Verify the token using the secret
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // Attach user info from the token to the request object
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(403).send('Invalid token');
    }
};

module.exports = authenticateUser;
