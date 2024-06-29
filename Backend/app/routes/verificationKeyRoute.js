const express = require('express');
const fs = require("fs")
const router = express.Router();
const path = require('path');
const verifyToken = require('../Services/authMiddleware');
const { successLog } = require('../Services/logging');
const { ERROR_MSG } = require('../Services/errorHandling');

router.get('/', verifyToken, async (req, res) => {
    const action = "getVK"
    reqlog(action)
    try {
        const index = __dirname.indexOf("/routes");
        const filePath = path.join(__dirname.substring(0, index), '/verification.key');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const vk = JSON.parse(fileContent);
        successLog(req.body.username,action)
        res.status(200).json(vk);
    } catch (error) {
        errlog(action,error)
        res.status(500).send(ERROR_MSG[action].unexpected);
    }
});

module.exports = router;
