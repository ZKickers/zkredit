const express = require('express');
const router = express.Router();
const verifyToken = require('../Services/authMiddleware');
const Transaction = require('../models/Transaction');
const { handleThresholdEvent } = require('../Services/thresholdHandler');

const validateParams = (req, res, next) => {
    const requiredParams = ["txId", "threshold"];
    const missingParams = requiredParams.filter(param => !req.body[param]);
    if (missingParams.length > 0) {
      return res.status(400).json({ error: `Missing required parameters: ${missingParams.join(', ')}` });
    }
    next();
};

router.post('/trigger-threshold', verifyToken, validateParams, async (req, res) => {
    try {
        const { txId, threshold } = req.body;
        const transaction = await Transaction.findById(txId);
        if (!(threshold >= 0 && threshold <= 65535))
        {
            return res.status(403).send("Threshold is not within (0-65535)")
        }
        if (!transaction) {
            return res.status(404).send('Transaction not found');
        }
        await handleThresholdEvent(req.user.accountId, transaction, threshold);
        res.status(200).json({ error: 'done' });

        // Assuming 'file_path' is the path to the file you want to send
        // const file_path = 'path/to/your/file.ext';
        // res.status(200).download(file_path); // Send the file as an attachment

        // Alternatively, if you want to send the file as the response body:
        // res.status(200).sendFile(file_path);

    } catch (error) {
        console.error('Error triggering threshold event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;