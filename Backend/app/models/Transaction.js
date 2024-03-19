const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    clientAccountId: {
        type: String,
        required: true
    },
    creditorAccountId: {
        type: String,
        required: true
    },
    fullNameOfClient: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Insufficient', 'Pending_Threshold','Pending_Verification', 'Success', 'Fail'],
        default: 'Insufficient'
    }
});


const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
