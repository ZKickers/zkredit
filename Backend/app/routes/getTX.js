const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const verifyToken = require("../Services/authMiddleware");
const User = require("../models/User");

// Route to get transactions by client ID
router.get("/client/", verifyToken, async (req, res) => {
  try {
    // if (req.user.accountId !== req.params.clientId) {
    //     return res.status(403).send('Forbidden: You are not authorized to view this transactions');
    // }
    const transactions = await Transaction.find({
      clientAccountId: req.user.accountId,
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error retrieving transactions by client ID:", error);
    res.status(500).send("Internal server error");
  }
});

router.get("/creditor/", verifyToken, async (req, res) => {
  try {
    // if (req.user.accountId !== req.params.clientId) {
    //     return res.status(403).send('Forbidden: You are not authorized to view this transactions');
    // }
    const transactions = await Transaction.find({
      creditorAccountId: req.user.accountId,
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error retrieving transactions by client ID:", error);
    res.status(500).send("Internal server error");
  }
});

router.get("/CreditorUsername", verifyToken, async (req, res) => {
  try {
    const txId = req.query.txId;
    const creditorId = req.query.creditorId;
    if (!creditorId) {
      return res.status(400).send("Creditor ID is not sent");
    }
    if (!txId) {
      return res.status(400).send("Transaction ID is not sent");
    }
    const transaction = await Transaction.findById(txId);
    if (!transaction) {
      return res.status(404).send("Transaction not found");
    }
    if (
      transaction.clientAccountId !== req.user.accountId ||
      transaction.creditorAccountId !== creditorId
    ) {
      return res
        .status(400)
        .send("Forbidden: You are not authorized to view creditor username");
    }
    const creditor = await User.findOne({
      accountId: transaction.creditorAccountId,
    });
    if (!creditor) {
      return res.status(404).send("Creditor not found");
    }
    return res.status(200).json(creditor.username);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
