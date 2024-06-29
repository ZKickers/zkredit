const express = require('express');
const router = express.Router();
const verifyToken = require('../Services/authMiddleware');
const sendClientInfo = require('../Services/generateProof');
const createTransaction = require('../Services/issueTx');
const Transaction = require('../models/Transaction');
const { errlog, paramsMissingLog, successLog, issueTxLog, reqlog } = require('../Services/logging');
const { ERROR_MSG } = require('../Services/errorHandling');

const validateIssueTXParams = (req, res, next) => {
    const requiredParams = ["creditorUsername", "clientFullName"];
    const missingParams = requiredParams.filter(param => !req.body[param]);
    if (missingParams.length > 0) {
        paramsMissingLog(missingParams.join(","))
        return res.status(400).send(`Missing required parameters: ${missingParams.join(', ')}`);
    }
    next();
};

const validateProofParams = (req, res, next) => {
    const requiredParams = ["txId", "address", "birthdate", "ssn"];
    const missingParams = requiredParams.filter(param => !req.body[param]);
    if (missingParams.length > 0) {
        paramsMissingLog(missingParams.join(","))
        return res.status(400).send(`Missing required parameters: ${missingParams.join(', ')}`);
    }
    next();
};

router.post('/issue-transaction', verifyToken, validateIssueTXParams, async (req, res) => {
    const action = "issueTx"
    try {
        const transaction = await createTransaction(req.body.clientFullName, req.body.creditorUsername, req.user.accountId);
        issueTxLog(transaction,req.user.username)
        res.status(201).json({ message: 'Transaction issued successfully', transaction: transaction });
    } catch (error) {
        errlog(action,error)
        res.status(500).send(ERROR_MSG[action]["unexpected"]);
    }
});

router.post('/generate-proof', verifyToken, validateProofParams, async (req, res) => {
    const action = "genProof"
    reqlog(action)
    try {
        const { txId, address, birthdate, ssn } = req.body; 
        const transaction = await Transaction.findById(txId);
        if (!transaction) {
            const errorMsg = ERROR_MSG[action].txNotFound
            errlog(action,errorMsg)
            return res.status(404).send(errorMsg);
        }
        if (transaction.status != "Pending_Client_Data") {
            const errorMsg = ERROR_MSG[action].wrongStatus
            errlog(action,errorMsg)
            return res.status(403).send(errorMsg);
        }

        const result = await sendClientInfo(transaction, address, birthdate, ssn);

        if (result.status === 'success') {
            successLog(req.user.username,action)
            res.status(200).send({ message: 'Client information received and proof is being generated', transaction: result.transaction });
        } else if(result.status === "Data Invalid"){
            const errorMsg = ERROR_MSG[action].dataInvalid
            errlog(action,errorMsg)
            res.status(400).send(errorMsg)
        } else {
            const errorMsg = ERROR_MSG[action]["unexpected"]
            errlog(action,errorMsg)
            res.status(400).send(errorMsg)
        }
    } catch (error) {
        errlog(action,error)
        const errorMsg = ERROR_MSG[action]["unexpected"]
        res.status(500).send(errorMsg);
    }
});

module.exports = router;
