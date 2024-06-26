const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const TxDeletionState = require('../models/TransactionDeletionState');
const verifyToken = require('../Services/authMiddleware');
const { deleteTxByClient, deleteTxByCreditor, deleteClientTxs, deleteCreditorTxs } = require('../Services/deleteTx');


router.delete('/client/:id', verifyToken, async (req, res) => {
    try {
        console.log()
        const transaction = await Transaction.findById(req.params.id);
        const deletionsState = await TxDeletionState.find({txId: req.params.id})
        if (!transaction || deletionsState == 1) {
            return res.status(404).send('Transaction not found');
        }
        if (req.user.accountId !== transaction.clientAccountId.toString()) {
            return res.status(403).send('Forbidden: You are not authorized to delete this transaction');
        }
        await deleteTxByClient(transaction, deletionsState);
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).send('Transaction deletion failed');
    }
});

router.delete('/creditor/:id', verifyToken, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        const deletionsState = await TxDeletionState.find({txId: req.params.id})
        if (!transaction || deletionsState == 2) {
            return res.status(404).send('Transaction not found');
        }
        if (req.user.accountId !== transaction.creditorAccountId.toString()) {
            return res.status(403).send('Forbidden: You are not authorized to delete this transaction');
        }
        await deleteTxByCreditor(transaction, deletionsState);
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).send('Transaction deletion failed');
    }
});

router.delete('/transactions/client/:clientId', verifyToken, async (req, res) => {
    try {
        if (req.user.accountId !== req.params.clientId) {
            return res.status(403).send('Forbidden: You are not authorized to delete these transactions');
        }
        const transactions = await Transaction.find({ clientAccountId: req.params.clientId });
        await deleteClientTxs(transactions);
        res.status(200).json({ message: 'Transactions deleted successfully' });
    } catch (error) {
        console.error('Error deleting transactions:', error);
        res.status(500).send('Transactions deletion failed');
    }
});

router.delete('/transactions/creditor/:creditorId', verifyToken, async (req, res) => {
    try {
        if (req.user.accountId !== req.params.creditorId) {
            return res.status(403).send('Forbidden: You are not authorized to delete these transactions');
        }
        const transactions = await Transaction.find({ creditorAccountId: req.params.creditorId });
        await deleteCreditorTxs(transactions);
        res.status(200).json({ message: 'Transactions deleted successfully' });
    } catch (error) {
        console.error('Error deleting transactions:', error);
        res.status(500).send('Transactions deletion failed');
    }
});

module.exports = router;
