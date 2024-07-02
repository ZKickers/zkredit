const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const { validateTx } = require('../Services/validateTx');
const Transaction = require('../models/Transaction');
const { ERROR_MSG } = require('../Services/errorHandling');
const { successLog, errlog, reqlog } = require('../Services/logging');

router.post('/', verifyToken, async (req, res) => {
    action = "confirmVerify"
    reqlog(action)
    try {
        const accepted = req.body.accepted; 
        const txId = req.body.txId;
        if (typeof accepted !== 'boolean' && accepted != "true" && accepted != "false" || !txId) {
            const errorMsg = ERROR_MSG[action].param
            errlog(action,errorMsg)
            return res.status(400).send(errorMsg);
        }
        const existingTransaction = await Transaction.findById(txId);
        if (!existingTransaction) {
            const errorMsg = ERROR_MSG.txNotFound
            errlog(action,errorMsg)
            return res.status(404).send(errorMsg);
        }
        if(req.user.accountId !== existingTransaction.creditorAccountId)
        {
            const errorMsg = ERROR_MSG[action].unauth
            errlog(action,errorMsg)
            return res.status(403).send(errorMsg);
        }
        if(existingTransaction.status != "Pending_Verification")
        {
            const errorMsg = ERROR_MSG[action].wrongStatus
            errlog(action,errorMsg)
            return res.status(400).send(errorMsg);
        }
        await validateTx(txId, accepted);
        successLog(req.user.username,action)
        res.status(200).json({ message: `${existingTransaction["fullNameOfClient"]} can now see result of his credit check.` });
    }catch (error) {
        errlog(action,error)
        return res.status(500).send(ERROR_MSG[action]["unexpected"])
    }
});

module.exports = router;
