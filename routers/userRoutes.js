const express = require('express');
const router = express.Router();
const userController =require('../controllers/userController')
const { authenticateToken} = require('../middlewares/authenticateToken');
const { authorizeRoles }  = require('../middlewares/authorizeRoles');
const checkRole = require('../middlewares/roleMiddleware');
const authenticateUser = require('../middlewares/authMiddleware');


router.get('/admin', checkRole('Admin'), (req, res) => {
    res.render('adminDashboard', { user: req.user });
});

// Organizer-only route
router.get('/organizer', checkRole('Organizer'), (req, res) => {
    res.render('organizerDashboard', { user: req.user });
});

// Attendee-only route
router.get('/attendee', checkRole('Attendee'), (req, res) => {
    res.render('attendeeDashboard', { user: req.user });
});
router.get('/events', authenticateUser, checkRole('Attendee'), (req, res) => {
    const sampleEvents = [
        { name: 'Commerce Conference', description: 'A conference for commerce students.', date: '2024-12-15', location: 'Main Hall' },
        { name: 'Tech Talk', description: 'Discussing the latest in technology.', date: '2024-12-20', location: 'Auditorium' },
    ];
    res.render('events', { events: sampleEvents });
});
router
    .get('/',authenticateToken, authorizeRoles(["Admin"]), userController.getAllUsers)
    .get('/:id', userController.getUserByID)
    .post('/', userController.createNewUser)
    .put('/:id', userController.updateUserByID)
    .delete('/:id', userController.deleteUserByID)


module.exports = router;

