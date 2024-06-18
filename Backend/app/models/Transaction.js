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
    creditorUsername: {
        type: String,
        required: true
    },
    fullNameOfClient: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending_Threshold', 'Pending_Client_Data', 'Pending_Proof', 'Invalid', 'Pending_Verification', 'Passed', 'Failed'],
        default: 'Pending_Threshold'
    },
    threshold: {
        type: Number,
        default: 85
    }
}, {
    timestamps: true // Enable timestamps feature
});


const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

// Pending_Threshold,
//         Pending_Client_Data,
//         Pending_Proof,
//         Pending_Verification,
//         Accepted,
//         Invalid,
//         Failed,
//         Rejected,
