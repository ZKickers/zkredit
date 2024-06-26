const Serial = require('../Services/serialize');
const Transaction = require('../models/Transaction');

async function handleThresholdEvent(transaction, threshold)
{
    try {
        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: transaction._id },
            { status: 'Pending_Client_Data',
              threshold: threshold
            },
            { new: true });
        return updatedTransaction;
    } catch (error) {
        console.error('Error handling threshold event:', error);
    }
}

module.exports = { handleThresholdEvent };