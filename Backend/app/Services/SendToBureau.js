const axios = require('axios');
const Serial = require('../Services/serialize');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');
const ProofInput = require('../models/ProofInput');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 }); // WebSocket server
const creditorConnections = {}; // Store WebSocket connections for each creditor
const BUREAU_ENDPOINT = 'http://127.0.0.1:8061/';


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

function notifyCreditor(creditorId, transactionData, clientFullName) {
    const ws = creditorConnections[creditorId];
    if (ws) {
        ws.send(JSON.stringify({ 
            type: 'transaction_notification',
            transactionData: transactionData,
            clientFullName: clientFullName
        }));
    } else {
        console.log(`Creditor ${creditorId} is not connected`);
    }
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
    wss.on('connection', (ws) => {
        console.log('WebSocket client connected');
    
        // Handle messages from WebSocket clients
        ws.on('transaction', (transaction) => {
            console.log(`Received message from client: ${transaction}`);
        });
    
        // Store creditor's WebSocket connection
        ws.on('creditorId', (creditorId) => {
            creditorConnections[creditorId] = ws;
        });
    });
    notifyCreditor(creditorId, transaction, clientInfo['fullname']);
    return transaction;
}

module.exports = sendClientInfo;
