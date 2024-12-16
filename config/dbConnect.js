const mongoose = require('mongoose');

// MongoDB Connection
const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log(
            `Connected to my authentication_MongoDB Atlas: ${connect.connection.host}, | ${connect.connection.name}`
        );
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1); // Exit the process with failure
    }
};

// Export Both
module.exports = { dbConnect };
