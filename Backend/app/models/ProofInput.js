const mongoose = require('mongoose');

const proofInputSchema = new mongoose.Schema({
  clientId: {
    type: Object,
    required: true
  },
  response: {
    type: Object,
    required: true
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction', // Reference to 'Transaction' collection
    required: true
  }
});

const proofInput = mongoose.model('proofInput', proofInputSchema);

module.exports = proofInput;
