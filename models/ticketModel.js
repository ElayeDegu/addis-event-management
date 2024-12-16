const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ticketType: { type: String, enum: ['General', 'VIP'], required: true },
    price: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Valid', 'Used'], default: 'Valid' }
});

module.exports = mongoose.model('Ticket', ticketSchema);
//// new check them 