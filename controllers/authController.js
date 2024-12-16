const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Database model

// Registration Function
const registerUser = async (req, res) => {
    try {
        const { userName, password, role } = req.body;

        // Ensure required fields are provided
        if (!userName || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Check for duplicate username in the database
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(409).json({ message: "Username is already taken" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user in the database
        const newUser = new User({ 
            userName, 
            password: hashedPassword, 
            role 
        });
        await newUser.save();

        // Respond with success
        res.status(201).json({ message: `User registered successfully with userName: ${userName}` });
    } catch (err) {
        console.error("Error during registration:", err.message);
        res.status(500).json({ message: "Something went wrong during registration" });
    }
};

// Login Function
const login = async (req, res) => {
    try {
        const { userName, password } = req.body;

        // Validate request body
        if (!userName || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Find the user in the database
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).render("login", { messages: { error: `Cannot find user with userName: ${userName}` } });
        }

        // Verify the password using bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(403).render("login", { messages: { error: "Invalid credentials" } });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role }, // Payload with user ID and role
            process.env.ACCESS_TOKEN_SECRET, // Secret key from .env file
            { expiresIn: "1h" } // Token expiration time
        );

        // Respond with the generated token
        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).json({ message: "Something went wrong during login" });
    }
};

// Export the functions for use in routes
module.exports = { registerUser, login };