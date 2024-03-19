const axios = require('axios');

async function sendClientInfo(clientInfo) {
    
    const url = 'http://localhost:8061/'; // Assuming the Flask server is running locally on port 8061
    try {
        const response = await axios.post(url, clientInfo);
        console.log('Response from server:');
        console.log(response.data);
    } catch (error) {
        console.error('Error sending client info:', error.response);
    }
}

module.exports = sendClientInfo;