const io = require('socket.io-client');

// Connect to the WebSocket server
const socket = io('http://localhost:8080'); // Replace 'http://localhost:3000' with your server address and port

// Handle connection event
socket.on('connect', () => {
    console.log('Connected to WebSocket server');

    // Emit a 'response' event to the server
    socket.emit('joinRoom', "acc_8k2iltctv");
});

// Handle 'response' event from the server
socket.on('response', (data) => {
    console.log('Response from server:', data);
});

// Handle disconnection event
socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
});