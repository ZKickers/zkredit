const mongoose = require('mongoose');

const txDeletionStateSchema = new mongoose.Schema({
  txId: { type: String, unique: true },
  state: { type: Number, default: 0, required: true}
});

const TxDeletionState = mongoose.model('TxDeletionState', txDeletionStateSchema);

module.exports = TxDeletionState;
