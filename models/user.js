const mongoose = require('mongoose');
const Joi = require('joi');
const Schema =mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Attendee', 'Organizer', 'Admin'], default: 'Attendee' },
},
{
    timestamps: true,
});
module.exports = mongoose.model('User', userSchema);

// how do i export this 
