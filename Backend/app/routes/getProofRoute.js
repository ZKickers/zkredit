const express = require('express');
const router = express.Router();
const verifyToken = require('../Services/authMiddleware');
const Transaction = require('../models/Transaction');
const getProof = require('../Services/getProof');
const { ERROR_MSG } = require('../Services/errorHandling');
const { errlog, successLog, reqlog } = require('../Services/logging');

router.get('/:txId', verifyToken, async (req, res) => {
    const action = "getPRoof"
    reqlog(action)
    try {
        const txId = req.params.txId;
        const existingTransaction = await Transaction.findById(txId);
        if (!existingTransaction) {
            const errorMsg = ERROR_MSG.txNotFound
            errlog(action,errorMsg)
            return res.status(404).send(errorMsg);
        }
        if (req.user.accountId !== existingTransaction.creditorAccountId) {
            const errorMsg = ERROR_MSG[action].unauth
            errlog(action,errorMsg)
            return res.status(403).send(errorMsg);
        }
        if (existingTransaction.status !== "Pending_Verification" 
        && existingTransaction.status !== "Passes"
        && existingTransaction.status !== "Failed") {
            const errorMsg = ERROR_MSG[action].wrongStatus
            errlog(action,errorMsg)
            return res.status(403).send({ message: errorMsg, transaction: existingTransaction });
        }
        const proof = await getProof(existingTransaction);
        successLog(req.user.username,action)
        res.status(200).json({ proof: proof });
    } catch (error) {
        errlog(action,error)
        return res.status(500).send(ERROR_MSG[action]["unexpected"])
    }
});

module.exports = router;
