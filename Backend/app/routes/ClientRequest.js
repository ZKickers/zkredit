const express = require('express');
const router = express.Router();
const verifyToken = require('../Services/authMiddleware');
const sendClientInfo = require('../Services/generateProof');
const createTransaction = require('../Services/issueTx')
const Transaction = require('../models/Transaction')

const validateIssueTXParams = (req, res, next) => {
    const requiredParams = ["creditorUsername", "clientFullName"];
    const missingParams = requiredParams.filter(param => !req.body[param]);
    if (missingParams.length > 0) {
      return res.status(400).json({ error: `Missing required parameters: ${missingParams.join(', ')}` });
    }
    next();
};

const validateProofParams = (req, res, next) => {
    const requiredParams = ["txId", "address", "birthdate", "ssn"];
    const missingParams = requiredParams.filter(param => !req.body[param]);
    if (missingParams.length > 0) {
      return res.status(400).json({ error: `Missing required parameters: ${missingParams.join(', ')}` });
    }

    next();
};
router.post('/issue-transaction', verifyToken, validateIssueTXParams, async (req, res)=>{
    try{
        console.log(req.body)
        console.log(req.user.accountId)
        // console.log()
        transaction = await createTransaction(req.body.clientFullName, req.body.creditorUsername,
            req.user.accountId);
        res.status(201).json({ message: 'Transaction issued successfully', transaction: transaction });
    }
    catch(error)
    {
        console.error('Error issuing transaction:', error.message);
        res.status(500).json({ error: error.message });
    }
});

router.post('/generate-proof', verifyToken, validateProofParams, async (req, res) => {
    try {
        const {txId, address, birthdate, ssn} = req.body; 
        const transaction = await Transaction.findById(txId);
        if (!transaction) {
            return res.status(404).send('Transaction not found');
        }
        if(transaction.status != "Pending_Client_Data")
        {
            return res.status(403).send('Transaction is not Pending_Client_Data');
        }
        // const clientInfo = req.body; 
        // console.log('Received client information:', clientInfo);
        // console.log('token:', token);
        // clientInfo[]
        const updatedtransaction = await sendClientInfo(transaction, address, birthdate, ssn);
        res.status(200).json({ 
            message: 'Client information received successfully',
            // transaction: transaction // Return the transaction object
        });
    } catch (error) {
        console.error('Error handling client information:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;

