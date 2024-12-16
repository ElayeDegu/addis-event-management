const jwt = require('jsonwebtoken');
const authenticateToken= (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).send('Token missing, please log in'); // so you have a save web so ppl cant asscess it with out the password

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log('JWT Secret:', process.env.ACCESS_TOKEN_SECRET); 
        if (err) return res.status(403).send('Invalid token');
        req.user = user; // Attach decoded user info to request
        next();
    });
}

module.exports = { authenticateToken }; 
