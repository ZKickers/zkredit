const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const { validateTx } = require('../Services/validateTx');
const Transaction = require('../models/Transaction');
const { validateTransactionUpdate } = require('../middlewares/verifyTxValidation');

router.post('/', verifyToken, validateTransactionUpdate, async (req, res) => {
    try {
        const { accepted, txId } = req.body;
        const existingTransaction = await Transaction.findById(txId);
        if (!existingTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        if (req.user.accountId !== existingTransaction.creditorAccountId) {
            return res.status(403).send('Forbidden: You are not authorized to verify this transaction');
        }
        if (existingTransaction.status !== "Pending_Verification") {
            return res.status(403).send('Transaction status cannot be verified as it is not Pending_Verification');
        }
        await validateTx(txId, accepted);
        const updatedTransaction = await Transaction.findById(txId);
        res.status(200).json({ message: 'Transaction updated successfully', transaction: updatedTransaction});
    } catch (error) {
        console.error('Error validating transaction:', error);
        res.status(500).json({ message: 'Transaction update failed' });
    }
});

module.exports = router;
