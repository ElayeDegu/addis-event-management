const express = require('express');
const chapaController = require('../controllers/chapaController');
const router = express.Router();

router.post('/payment', chapaController.initiatePayment); // Payment initiation
router.get('/callback', chapaController.verifyPayment);  // Callback verification

module.exports = router;
