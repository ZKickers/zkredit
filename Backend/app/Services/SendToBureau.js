const axios = require('axios');
const Serial = require('../Services/serialize');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');
const ProofInput = require('../models/ProofInput');
const BUREAU_ENDPOINT = 'http://192.168.0.100:8061';


async function createTransaction(clientInfo, creditorUser, clientId) {
    try
    {
        const transactionData = {
            clientAccountId: clientId,
            creditorAccountId: creditorUser.accountId,
            fullNameOfClient: clientInfo.fullname,
            status: 'Pending_Threshold', // You can set the initial status here
        };
    
        // Save the transaction
        const transaction = new Transaction(transactionData);
        await transaction.save();
        console.log("Transaction saved");
        return transaction; 
    }
    catch (error) {
        console.error('Error sending client info:', error);
        const { creditorUserName } = clientInfo;
        const creditorUser = await User.findOne({ username: creditorUserName });
        if (!creditorUser) {
            throw new Error(`Creditor with username ${creditorUserName} not found`);
        }

        const decodedToken = jwt.verify(token, 'secret');
        const clientId = decodedToken.accountId;

        const transactionData = {
            clientAccountId: clientId,
            creditorAccountId: creditorUser.accountId,
            fullNameOfClient: clientInfo.fullname,
            status: 'Insufficient', // Setting status to "Insufficient"
        };

        // Save the transaction with status "Insufficient"
        const transaction = new Transaction(transactionData);
        await transaction.save();
    }

}



async function serializeAndSaveData(clientInfo, responseData, transaction) {

        const serialized_clientData = Serial.clientData(clientInfo);
        console.log(serialized_clientData);

    
        const serialized_resp = Serial.response(responseData);
        console.log(serialized_resp);

        const newProofInput = new ProofInput({
            clientId: serialized_clientData,
            response: serialized_resp,
            transactionId: transaction._id
          });

        console.log(newProofInput);
        newProofInput.save()
    
        console.log("Serialization completed");
 
}

async function sendClientInfo(clientInfo, creditorUserName, token) {
    const response = await axios.post(BUREAU_ENDPOINT, clientInfo);
    console.log('Response from server:');
    console.log(response.data);
    const creditorUser = await User.findOne({ username: creditorUserName });
    if (!creditorUser) {
        throw new Error(`Creditor with username ${creditorUserName} not found`);
    }

    const decodedToken = jwt.verify(token, 'secret');
    const clientId = decodedToken.accountId;
    const creditorId = creditorUser.accountId;
    const transaction = await createTransaction(clientInfo, creditorUser, clientId);
    await serializeAndSaveData(clientInfo, response.data, transaction);
    return transaction;
}

module.exports = sendClientInfo;
