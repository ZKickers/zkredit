const axios = require('axios');
const Serial = require('./serialize');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');
const CIRCUIT_INPUT_PATH = 'circuitInput/'

async function sendClientInfo(clientInfo,token) {
    
    const url = 'http://localhost:8061/'; // Assuming the Flask server is running locally on port 8061
    try {
        const response = await axios.post(url, clientInfo);
        console.log('Response from server:');
        console.log(response.data);
        const { creditorUserName, fullname } = clientInfo;
        const creditorUser = await User.findOne({ username: creditorUserName });
        if (!creditorUser) {
            throw new Error(`Creditor with username ${creditorUserName} not found`);
          }
          const decodedToken = jwt.verify(token, 'secret');
          console.log(decodedToken);
          const clientId = decodedToken.accountId;
          console.log(clientId);
          const transactionData = {
            clientAccountId: clientId, // Assuming SSN is used as the client account ID
            creditorAccountId: creditorUser.accountId,
            fullNameOfClient: fullname,
            status: 'Pending_Threshold', // You can set the initial status here
          };
      
          // Step 3: Save the transaction
          const transaction = new Transaction(transactionData);
          await transaction.save();
          console.log("saved");
        const serialized_clientData = Serial.clientData(clientInfo)
        console.log(serialized_clientData);
        Serial.saveJSON(serialized_clientData,CIRCUIT_INPUT_PATH + 'clientData.json')
        const serialized_resp = Serial.response(response.data);
        console.log(serialized_resp);
        Serial.saveJSON(serialized_resp,CIRCUIT_INPUT_PATH + 'response.json')
        console.log("completed");
    } catch (error) {
        console.error('Error sending client info:', error);
        const { creditorUserName, fullname } = clientInfo;
        const creditorUser = await User.findOne({ username: creditorUserName });
        
        if (!creditorUser) {
            throw new Error(`Creditor with username ${creditorUserName} not found`);
        }

        const decodedToken = jwt.verify(token, 'secret');
        const clientId = decodedToken.accountId;

        const transactionData = {
            clientAccountId: clientId,
            creditorAccountId: creditorUser.accountId,
            fullNameOfClient: fullname,
            status: 'Insufficient', // Setting status to "Insufficient"
        };

        // Save the transaction with status "Insufficient"
        const transaction = new Transaction(transactionData);
        await transaction.save();
    }
}

module.exports = sendClientInfo;