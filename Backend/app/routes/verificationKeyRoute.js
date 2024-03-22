const express = require('express');
const router = express.Router();
const path = require('path');
const verifyToken = require('../Services/authMiddleware');

router.get('/', verifyToken, async (req, res) => {
    try {
        const index = __dirname.indexOf("/routes");
        const filePath = path.join(__dirname.substring(0, index), '/verification.key');
        console.log(filePath);
        res.sendFile(filePath);
    } catch (error) {
        console.error('Error sending verification key:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
