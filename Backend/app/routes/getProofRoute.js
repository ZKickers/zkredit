const express = require('express');
const router = express.Router();
const verifyToken = require('../Services/authMiddleware');
const Transaction = require('../models/Transaction');
const getProof = require('../Services/getProof');

router.get('/:txId', verifyToken, async (req, res) => {
    try {
        const txId = req.params.txId;
        const existingTransaction = await Transaction.findById(txId);
        if (!existingTransaction) {
            return res.status(404).send('Transaction not found');
        }
        if (req.user.accountId !== existingTransaction.creditorAccountId) {
            return res.status(403).send('Forbidden: You are not authorized to verify transaction');
        }
        if (existingTransaction.status !== "Pending_Verification" && existingTransaction.status !== "Passes" && existingTransaction.status !== "Failed") {
            return res.status(403).send({ message: 'Could not get proof due to transaction status', transaction: existingTransaction });
        }
        const proof = await getProof(existingTransaction);
        res.status(200).json({ proof: proof });
    } catch (error) {
        console.error('Error getting proof:', error);
        res.status(500).json({ message: 'Getting Proof failed' });
    }
});

module.exports = router;
