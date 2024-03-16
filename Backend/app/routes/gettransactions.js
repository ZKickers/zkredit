const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Route to get all transactions
router.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error retrieving transactions:', error);
        res.status(500).send('Internal server error');
    }
});

// Route to get a specific transaction by ID
router.get('/transactions/:transactionId', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.transactionId);
        if (!transaction) {
            return res.status(404).send('Transaction not found');
        }
        res.status(200).json(transaction);
    } catch (error) {
        console.error('Error retrieving transaction:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
