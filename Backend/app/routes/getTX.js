const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const verifyToken = require('../Services/authMiddleware');

// Route to get transactions by client ID
router.get('/transactions/client/:clientId', verifyToken, async (req, res) => {
    try {
        const transactions = await Transaction.find({ clientAccountId: req.params.clientId });
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error retrieving transactions by client ID:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
