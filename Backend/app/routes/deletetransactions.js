const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const verifyToken = require('../Services/authMiddleware');
// Route to delete a transaction by ID
router.delete('/transactions/client/:clientId', verifyToken, async (req, res) => {
    try {
        const deletedTransactions = await Transaction.deleteMany({ clientAccountId: req.params.clientId });
        if (deletedTransactions.deletedCount === 0) {
            return res.status(404).send('No transactions found for the client');
        }
        res.status(200).json({ message: 'Transactions deleted successfully' });
    } catch (error) {
        console.error('Error deleting transactions:', error);
        res.status(500).send('Internal server error');
    }
});
module.exports = router;