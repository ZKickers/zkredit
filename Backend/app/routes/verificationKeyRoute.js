const express = require('express');
const fs = require("fs")
const router = express.Router();
const path = require('path');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/', verifyToken, async (req, res) => {
    try {
        const index = __dirname.indexOf("/routes");
        const filePath = path.join(__dirname.substring(0, index), '/verification.key');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const vk = JSON.parse(fileContent);
        res.status(200).json(vk);
    } catch (error) {
        console.error('Error sending verification key:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
