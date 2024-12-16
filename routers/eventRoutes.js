const express = require("express");
const router = express.Router();
const Event = require("../models/eventModel"); // Path to your Event model
const eventController = require('../controllers/eventController')

// Get all events
router.get('/', async (req, res) => {
  const events = await Event.find();
  res.render('index', { events });
});

// Get event details
router.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id).populate('feedback.user');
  res.render('event-details', { event, user: req.user });
});

// Submit feedback
router.post('/:id/feedback', async (req, res) => {
  const { userId, rating, comment } = req.body;
  const event = await Event.findById(req.params.id);

  event.feedback.push({ user: userId, rating, comment });
  await event.save();
  res.redirect(`/events/${req.params.id}`);
});


//
router
  .get("/", eventController.getAllEvents)
  .get("/:id", eventController.getEventById)
  .post("/", eventController.createEvent)
  .put("/:id", eventController.updateEventById)
  .post("/rsvp", eventController.rsvpEvent)
  .delete("/:id", eventController.deleteEvent);

module.exports = router;
