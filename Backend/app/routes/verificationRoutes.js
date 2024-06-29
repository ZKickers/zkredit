const express = require('express');
const router = express.Router();
const verifyToken = require('../Services/authMiddleware');
const { validateTx } = require('../Services/validateTx');
const Transaction = require('../models/Transaction');

router.post('/', verifyToken, async (req, res) => {
    try {
        const accepted = req.body.accepted; 
        console.log(req.body);
        const txId = req.body.txId;
        if (typeof accepted !== 'boolean' || !txId) {
            return res.status(400).send('Invalid parameters');
        }
        const existingTransaction = await Transaction.findById(txId);
        if (!existingTransaction) {
            throw new Error('Transaction not found');
        }
        if(req.user.accountId !== existingTransaction.creditorAccountId)
        {
            return res.status(403).send('Forbidden: You are not authorized to verify transaction');
        }
        if(existingTransaction.status != "Pending_Verification")
        {
            return res.status(403).send('Transaction status cannot be verified as it is not Pending_Verification');
        }
        await validateTx(txId, accepted);
        res.status(200).json({ message: `${existingTransaction["fullNameOfClient"]} can now see result of his credit check.` });
    }catch (error) {
        console.error('Error validate transaction:', error);
        res.status(500).send("Couldn't update transaction.");
    }
});

module.exports = router;