const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const verifyToken = require("../middlewares/authMiddleware");
const User = require("../models/User");
const { reqlog, successLog, errlog } = require("../Services/logging");
const { ERROR_MSG } = require("../Services/errorHandling");

// Route to get transactions by client ID
router.get("/client/", verifyToken, async (req, res) => {
  const action = "getTx"
  const action_child = action + "Client"
  reqlog(action_child)
  try {
    const transactions = await Transaction.find({
      clientAccountId: req.user.accountId,
    });
    successLog(req.user.username, action_child)
    res.status(200).json(transactions);
  } catch (error) {
    errlog(action_child,error)
    res.status(500).send(ERROR_MSG["getTx"]);
  }
});

router.get("/creditor/", verifyToken, async (req, res) => {
  const action = "getTx"
  const action_child = action + "Creditor"
  reqlog(action_child)
  try {
    const transactions = await Transaction.find({
      creditorAccountId: req.user.accountId,
    });
    successLog(req.user.username, action_child)
    res.status(200).json(transactions);
  } catch (error) {
    errlog(action_child,error)
    res.status(500).send(ERROR_MSG["getTx"]);
  }
});

module.exports = router;
