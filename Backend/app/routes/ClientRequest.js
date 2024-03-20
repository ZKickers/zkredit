const express = require('express');
const router = express.Router();
const verifyToken = require('../Services/authMiddleware');
const sendClientInfo = require('../Services/SendToBureau');

const validateParams = (req, res, next) => {
    const requiredParams = ["fullname", "address", "birthdate", "ssn", "username", "creditorUsername"];
    const missingParams = requiredParams.filter(param => !req.body[param]);
    if (missingParams.length > 0) {
      return res.status(400).json({ error: `Missing required parameters: ${missingParams.join(', ')}` });
    }

    next();
};


router.post('/client', verifyToken, validateParams, async (req, res) => {
    try {
        const clientInfo = req.body; 
        const token = req.header('Authorization');
        console.log('Received client information:', clientInfo);
        console.log('token:', token);
        const transaction = await sendClientInfo(clientInfo, clientInfo["creditorUsername"], token);
        res.status(200).json({ 
            message: 'Client information received successfully',
            transaction: transaction // Return the transaction object
        });
    } catch (error) {
        console.error('Error handling client information:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;

