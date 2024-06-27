const Transaction = require('../models/Transaction');
const TxDeletionState = require('../models/TransactionDeletionState');
const User = require('../models/User');

async function createTransaction(clientFullname, creditorUserName, clientId) {
    const creditor = await User.findOne({ username: creditorUserName });
    if (!creditor) {
        throw new Error('Creditor not found');
    }
    const transactionData = {
                clientAccountId: clientId,
                creditorAccountId: creditor.accountId,
                fullNameOfClient: clientFullname,
                creditorUsername: creditorUserName,
                status: 'Pending_Threshold',
    };
    const transaction = new Transaction(transactionData);
    await transaction.save();
    const deletionStateData = {
        txId: transaction._id,
    }
    const deletionState = new TxDeletionState(deletionStateData);
    await deletionState.save();
    return transaction;
}

module.exports = createTransaction;
