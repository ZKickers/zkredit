const express = require('express');
const router = express.Router();
const verifyToken = require('../Services/authMiddleware');
const sendClientInfo = require('../Services/SendToBureau');
router.post('/client', verifyToken, async (req, res) => {
    try {
        const clientInfo = req.body; 
        const token = req.header('Authorization');
        console.log('Received client information:', clientInfo);
        console.log('token:', token);
        sendClientInfo(clientInfo,token);
        res.status(200).json({ message: 'Client information received successfully' });
    } catch (error) {
        console.error('Error handling client information:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;

