const axios = require('axios');
const ManipulateData = require('./serializeResponse');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

async function sendClientInfo(clientInfo) {
    
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
          const token = req.header('Authorization');
          const decodedToken = jwt.verify(token, 'secret');
          const clientId = decodedToken.accountId;
          const transactionData = {
            clientAccountId: clientId, // Assuming SSN is used as the client account ID
            creditorAccountId: creditorUser.accountId,
            fullNameOfClient: fullname,
            status: 'Pending_Verification', // You can set the initial status here
          };
      
          // Step 3: Save the transaction
          const transaction = new Transaction(transactionData);
          await transaction.save();
        const clientData = ManipulateData(response.data);
        saveJSON(clientData)
        // console.log(clientData);
    } catch (error) {
        console.error('Error sending client info:', error.response);
        const { creditorUserName, fullname } = clientInfo;
        const creditorUser = await User.findOne({ username: creditorUserName });
        
        if (!creditorUser) {
            throw new Error(`Creditor with username ${creditorUserName} not found`);
        }

        const token = req.header('Authorization');
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