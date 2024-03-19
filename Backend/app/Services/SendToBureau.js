const axios = require('axios');
const Serial = require('../Services/serialize');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');
const CIRCUIT_INPUT_PATH = 'circuitInput/';

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

async function serializeAndSaveData(clientInfo, responseData) {

        const serialized_clientData = Serial.clientData(clientInfo);
        console.log(serialized_clientData);
        Serial.saveJSON(serialized_clientData, CIRCUIT_INPUT_PATH + 'clientData.json');
    
        const serialized_resp = Serial.response(responseData);
        console.log(serialized_resp);
        Serial.saveJSON(serialized_resp, CIRCUIT_INPUT_PATH + 'response.json');
    
        console.log("Serialization completed");
 
}

async function sendClientInfo(clientInfo, token) {
    const url = 'http://localhost:8061/';
    const response = await axios.post(url, clientInfo);
    console.log('Response from server:');
    console.log(response.data);
    const { creditorUserName } = clientInfo;
    const creditorUser = await User.findOne({ username: creditorUserName });

    if (!creditorUser) {
        throw new Error(`Creditor with username ${creditorUserName} not found`);
    }

    const decodedToken = jwt.verify(token, 'secret');
    const clientId = decodedToken.accountId;

    await createTransaction(clientInfo, creditorUser, clientId);
    await serializeAndSaveData(clientInfo, response.data);
    
}

module.exports = sendClientInfo;
