const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        const { user } = req; // Assume `req.user` is populated after authentication
        if (!user) {
            return res.status(401).render('error', { message: 'Unauthorized: Please log in' });
        }
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).render('error', { message: 'Forbidden: Access Denied' });
        }
        next(); // User is authorized, proceed
    };
};

module.exports = checkRole;
