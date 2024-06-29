const express = require('express');
const router = express.Router();
const verifyToken = require('../Services/authMiddleware');
const Transaction = require('../models/Transaction');
const { handleThresholdEvent } = require('../Services/thresholdHandler');
const { ERROR_MSG } = require('../Services/errorHandling');
const { errlog, successLog, reqlog } = require('../Services/logging');


const validateParams = (req, res, next) => {
    const requiredParams = ["txId", "threshold"];
    const missingParams = requiredParams.filter(param => !req.body[param]);
    if (missingParams.length > 0) {
      return res.status(400).send(`Missing required parameters: ${missingParams.join(', ')}`);
    }
    next();
};

router.post('/trigger-threshold', verifyToken, validateParams, async (req, res) => {
    const action = "triggerThres"
    reqlog(action)
    try {
        const { txId, threshold } = req.body;
        const transaction = await Transaction.findById(txId);
        if (!(threshold >= 350 && threshold <= 850))
        {
            const errorMsg = ERROR_MSG[action]["outOfBound"]
            errlog(action,errorMsg)
            return res.status(403).send(errorMsg)
        }
        if (!transaction) {
            const errorMsg = ERROR_MSG.txNotFound
            errlog(action,errorMsg)
            return res.status(404).send(errorMsg);
        }
        if(req.user.accountId !== transaction.creditorAccountId)
        {
            const errorMsg = ERROR_MSG[action].unauth
            errlog(action,errorMsg)
            return res.status(403).send(errorMsg);
        }
        if(transaction.status != "Pending_Threshold")
        {
            const errorMsg = ERROR_MSG[action].wrongStatus
            errlog(action,errorMsg)
            return res.status(403).send(errorMsg);
        }
        updatedTransaction = await handleThresholdEvent(transaction, threshold)
        successLog(req.user.username, action)
        res.status(200).json(updatedTransaction);
    } catch (error) {
        errlog(action,error)
        return res.status(403).send(ERROR_MSG[action]["unexpected"]);
    }
});


module.exports = router;