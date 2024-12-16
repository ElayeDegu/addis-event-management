const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticketModel');
const Event = require('../models/eventModel'); // Assuming an Event model exists

router.get('/user/:id', async (req, res) => {
    const tickets = await Ticket.find({ user: req.params.id }).populate('event');
    res.render('user-tickets', { tickets });
});

// Ticket Purchase
router.post('/purchase', async (req, res) => {
    const { userId, eventId, ticketType } = req.body;

    try {
        // Validate event
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Set ticket price based on type
        const prices = { General: 50, VIP: 100 }; // Example prices
        const price = prices[ticketType];
        if (!price) return res.status(400).json({ message: 'Invalid ticket type' });

        // Create ticket
        const ticket = new Ticket({ event: eventId, user: userId, ticketType, price });
        await ticket.save();

        res.status(201).json({ message: 'Ticket purchased successfully', ticket });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
