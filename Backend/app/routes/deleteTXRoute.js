const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const TxDeletionState = require('../models/TransactionDeletionState');
const verifyToken = require('../Services/authMiddleware');
const { deleteTxByClient, deleteTxByCreditor, deleteClientTxs, deleteCreditorTxs } = require('../Services/deleteTx');
const { ERROR_MSG } = require('../Services/errorHandling');
const { errlog, successLog, reqlog } = require('../Services/logging');


router.delete('/client/:id', verifyToken, async (req, res) => {
    action = "deleteTx"
    action_child = "deleteTxClient"
    reqlog(action_child)
    try {
        const transaction = await Transaction.findById(req.params.id);
        const deletionsState = await TxDeletionState.find({txId: req.params.id})
        if (!transaction || deletionsState == 1) {
            const errorMsg = ERROR_MSG.txNotFound
            errlog(action_child,errorMsg)
            return res.status(404).send(errorMsg);
        }
        if (req.user.accountId !== transaction.clientAccountId.toString()) {
            const errorMsg = ERROR_MSG[action].unauth
            errlog(action_child,errorMsg)
            return res.status(403).send(errorMsg);
        }
        await deleteTxByClient(transaction, deletionsState);
        successLog(req.user.username,action_child)
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        errlog(action_child,error)
        res.status(500).send(ERROR_MSG[action]["unexpected"]);
    }
});

router.delete('/creditor/:id', verifyToken, async (req, res) => {
    action = "deleteTx"
    action_child = "deleteTxCreditor"
    reqlog(action_child)
    try {
        const transaction = await Transaction.findById(req.params.id);
        const deletionsState = await TxDeletionState.find({txId: req.params.id})
        if (!transaction || deletionsState == 2) {
            const errorMsg = ERROR_MSG.txNotFound
            errlog(action_child,errorMsg)
            return res.status(404).send(errorMsg);
        }
        if (req.user.accountId !== transaction.creditorAccountId.toString()) {
            const errorMsg = ERROR_MSG[action].unauth
            errlog(action_child,errorMsg)
            return res.status(403).send(errorMsg);
        }
        await deleteTxByCreditor(transaction, deletionsState);
        successLog(req.user.username,action_child)
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        errlog(action_child,error)
        res.status(500).send(ERROR_MSG[action]["unexpected"]);
    }
});

router.delete('/transactions/client/:clientId', verifyToken, async (req, res) => {
    action = "deleteTxAll"
    action_child = "deleteTxAllClient"
    reqlog(action_child)
    try {
        if (req.user.accountId !== req.params.clientId) {
            const errorMsg = ERROR_MSG[action].unauth
            errlog(action_child,errorMsg)
            return res.status(403).send(errorMsg);
        }
        const transactions = await Transaction.find({ clientAccountId: req.params.clientId });
        await deleteClientTxs(transactions);
        successLog(req.user.username,action_child)
        res.status(200).json({ message: 'Transactions deleted successfully' });
    } catch (error) {
        errlog(action_child,error)
        res.status(500).send(ERROR_MSG[action]["unexpected"]);
    }
});

router.delete('/transactions/creditor/:creditorId', verifyToken, async (req, res) => {
    action = "deleteTxAll"
    action_child = "deleteTxAllClient"
    reqlog(action_child)
    try {
        if (req.user.accountId !== req.params.creditorId) {
            const errorMsg = ERROR_MSG[action].unauth
            errlog(action_child,errorMsg)
            return res.status(403).send(errorMsg);
        }
        const transactions = await Transaction.find({ creditorAccountId: req.params.creditorId });
        await deleteCreditorTxs(transactions);
        successLog(req.user.username,action_child)
        res.status(200).json({ message: 'Transactions deleted successfully' });
    } catch (error) {
        errlog(action_child,error)
        res.status(500).send(ERROR_MSG[action]["unexpected"]);
    }
});

module.exports = router;
