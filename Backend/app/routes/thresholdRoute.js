const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const Transaction = require('../models/Transaction');
const { handleThresholdEvent } = require('../Services/thresholdHandler');
const { validateTriggerThreshold } = require('../middlewares/thresholdValidation');

router.post('/trigger-threshold', verifyToken, validateTriggerThreshold, async (req, res) => {
    try {
        const { txId, threshold } = req.body;
        const transaction = await Transaction.findById(txId);
        if (!transaction) {
            return res.status(404).send('Transaction not found');
        }
        if (req.user.accountId !== transaction.creditorAccountId) {
            return res.status(403).send('Forbidden: You are not authorized to verify this transaction');
        }
        if (transaction.status !== "Pending_Threshold") {
            return res.status(403).send('Transaction is not Pending_Threshold');
        }
        const updatedTransaction = await handleThresholdEvent(transaction, threshold);
        res.status(200).json(updatedTransaction);
    } catch (error) {
        console.error('Error triggering threshold event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
