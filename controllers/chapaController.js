const axios = require('axios');
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

exports.initiatePayment = async (req, res) => {
    try {
        const { amount, email, firstName, lastName, tx_ref } = req.body;

        const response = await axios.post(
            'https://api.chapa.co/v1/transaction/initialize',
            {
                amount,
                currency: 'ETB',
                email,
                first_name: firstName,
                last_name: lastName,
                tx_ref,
                callback_url: 'http://yourdomain.com/chapa/callback',
                return_url: 'http://yourdomain.com/payment/success',
                customization: {
                    title: 'Spot Link',
                    description: 'Event',
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
                },
            }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error initializing payment:', error.response?.data || error.message);
        res.status(500).json({ error: 'Payment initialization failed.' });
    }
};

exports.verifyPayment = async (req, res) => {
    const tx_ref = req.query.tx_ref;

    try {
        const response = await axios.get(
            `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
            {
                headers: {
                    Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
                },
            }
        );

        if (response.data.status === 'success') {
            // Save payment details in the database
            console.log('Payment successful:', response.data);
            res.redirect('/payment/success');
        } else {
            console.error('Payment verification failed:', response.data);
            res.redirect('/payment/failed');
        }
    } catch (error) {
        console.error('Error verifying payment:', error.response?.data || error.message);
        res.redirect('/payment/failed');
    }
};
