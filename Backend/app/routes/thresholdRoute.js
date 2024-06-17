const express = require('express');
const router = express.Router();
const verifyToken = require('../Services/authMiddleware');
const Transaction = require('../models/Transaction');
const { handleThresholdEvent } = require('../Services/thresholdHandler');


const validateParams = (req, res, next) => {
    const requiredParams = ["txId", "threshold"];
    const missingParams = requiredParams.filter(param => !req.body[param]);
    if (missingParams.length > 0) {
      return res.status(400).json({ error: `Missing required parameters: ${missingParams.join(', ')}` });
    }
    next();
};

router.post('/trigger-threshold', verifyToken, validateParams, async (req, res) => {
    try {
        const { txId, threshold } = req.body;
        const transaction = await Transaction.findById(txId);
        console.log(transaction)
        if (!(threshold >= 0 && threshold <= 850))
        {
            return res.status(403).send("Threshold is not within (0-65535)")
        }
        if (!transaction) {
            return res.status(404).send('Transaction not found');
        }
        if(req.user.accountId !== transaction.creditorAccountId)
        {
            return res.status(403).send('Forbidden: You are not authorized to verify transaction');
        }
        if(transaction.status != "Pending_Threshold")
        {
            console.log(transaction.status )
            return res.status(403).send('Transaction is not Pending_Threshold');
        }
        updatedTransaction = await handleThresholdEvent(transaction, threshold)
        console.log(updatedTransaction)
        res.status(200).json(updatedTransaction);
    } catch (error) {
        console.error('Error triggering threshold event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;