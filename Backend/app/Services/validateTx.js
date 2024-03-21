const Transaction = require('../models/Transaction');


async function validateTx(txId, accepted)
{
    try {
        let status;
        if (accepted) {
            status = 'Success';
        } else {
            status = 'Fail';
        }
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            { _id: txId},
            { status: status },
            { new: true }
        );
    } catch (error) {
        throw error;
    }
}

module.exports = { validateTx };