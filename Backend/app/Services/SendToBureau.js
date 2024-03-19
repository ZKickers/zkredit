const axios = require('axios');
const ManipulateData = require('./ManipulateData');
async function sendClientInfo(clientInfo) {
    
    const url = 'http://localhost:8061/'; // Assuming the Flask server is running locally on port 8061
    try {
        const response = await axios.post(url, clientInfo);
        console.log('Response from server:');
        console.log(response.data);
        const clientData = ManipulateData(response.data);
        console.log(clientData);

    } catch (error) {
        console.error('Error sending client info:', error.response);
    }
}

module.exports = sendClientInfo;