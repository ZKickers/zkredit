const Transaction = require('../models/Transaction');


async function validateTx(txId, accepted)
{
    console.log(accepted);
    try {
        let status;
        if (accepted) {
            status = 'Passed';
        } else {
            status = 'Failed';
        }
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            { _id: txId},
            { status: status },
            { new: true }
        );
        console.log(updatedTransaction);
    } catch (error) {
        throw error;
    }
}

module.exports = { validateTx };