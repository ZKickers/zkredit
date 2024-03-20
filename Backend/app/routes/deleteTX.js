const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const ProofInput = require('../models/ProofInput');
const verifyToken = require('../Services/authMiddleware');

router.delete('/transactions/:id', verifyToken, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).send('Transaction not found');
        }
        if (req.user.accountId !== transaction.clientAccountId.toString()) {
            return res.status(403).send('Forbidden: You are not authorized to delete this transaction');
        }
        await Transaction.deleteOne({ _id: req.params.id });
        await ProofInput.deleteMany({ transactionId: req.params.id });

        res.status(200).json({ message: 'Transaction and associated proofInput objects deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).send('Internal server error');
    }
});

router.delete('/transactions/client/:clientId', verifyToken, async (req, res) => {
    try {
        const deletedTransactions = await Transaction.find({ clientAccountId: req.params.clientId });
        if (req.user.accountId !== req.params.clientId) {
            return res.status(403).send('Forbidden: You are not authorized to delete these transactions');
        }
        await Transaction.deleteMany({ clientAccountId: req.params.clientId });
        const proofInputIds = deletedTransactions.map(transaction => transaction._id);
        await ProofInput.deleteMany({ transactionId: { $in: proofInputIds } });
        if (deletedTransactions.length === 0) {
            return res.status(404).send('No transactions found for the client');
        }
        
        res.status(200).json({ message: 'Transactions and associated proofInput objects deleted successfully' });
    } catch (error) {
        console.error('Error deleting transactions:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
