const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Route to delete a transaction by ID
router.delete('/transactions/:transactionId', async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.transactionId);
        if (!deletedTransaction) {
            return res.status(404).send('Transaction not found');
        }
        res.status(200).json(deletedTransaction);
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
