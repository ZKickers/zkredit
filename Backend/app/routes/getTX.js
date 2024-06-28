const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const verifyToken = require("../Services/authMiddleware");
const User = require("../models/User");

// Route to get transactions by client ID
router.get("/client/", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      clientAccountId: req.user.accountId,
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error retrieving transactions by client ID:", error);
    res.status(500).send("Couldn't retrieve transactions. Please try again.");
  }
});

router.get("/creditor/", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      creditorAccountId: req.user.accountId,
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error retrieving transactions by client ID:", error);
    res.status(500).send("Couldn't retrieve transactions. Please try refreshing.");
  }
});

module.exports = router;