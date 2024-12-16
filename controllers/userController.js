const User = require('../models/user');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // find from mdb
        res.send(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getUserByID = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const createNewUser =  async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            userName: req.body.userName,
            password: hashedPassword,
            role: req.body.role || 'Attendee',
        });

        // to save on our db
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

const updateUserByID =  async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // find by id
        if (!user) return res.status(404).send('User not found');

        user.name = req.body.name || user.name; // update
        user.email = req.body.email || user.email;
        user.userName = req.body.email || user.userName;
        user.role = req.body.role || user.role;
        await user.save(); // until save wait

        res.send(user);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

const deleteUserByID = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.send('User deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports={getAllUsers, createNewUser, updateUserByID, deleteUserByID, getUserByID };
