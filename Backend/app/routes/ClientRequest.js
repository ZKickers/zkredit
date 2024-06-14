const express = require('express');
const router = express.Router();
const verifyToken = require('../Services/authMiddleware');
const sendClientInfo = require('../Services/SendToBureau');
const createTransaction = require('../Services/issueTx')

const validateIssueTXParams = (req, res, next) => {
    const requiredParams = ["creditorUsername", "clientFullName"];
    const missingParams = requiredParams.filter(param => !req.body[param]);
    if (missingParams.length > 0) {
      return res.status(400).json({ error: `Missing required parameters: ${missingParams.join(', ')}` });
    }
    next();
};

const validateProofParams = (req, res, next) => {
    const requiredParams = ["fullname", "address", "birthdate", "ssn", "username", "creditorUsername"];
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
        transaction = await createTransaction(req.user.accountId, req.body.creditorUsername,
             req.body.clientFullName);
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
        const clientInfo = req.body; 
        const token = req.header('Authorization');
        console.log('Received client information:', clientInfo);
        console.log('token:', token);
        const transaction = await sendClientInfo(clientInfo, clientInfo["creditorUsername"], token);
        res.status(200).json({ 
            message: 'Client information received successfully',
            transaction: transaction // Return the transaction object
        });
    } catch (error) {
        console.error('Error handling client information:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;

