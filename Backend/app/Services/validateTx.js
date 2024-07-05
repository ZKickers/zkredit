const Transaction = require('../models/Transaction');
const { deleteProof } = require('../Services/deleteTx'); 


async function validateTx(txId, accepted)
{
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
        await deleteProof(txId);
    } catch (error) {
        throw error;
    }
}

module.exports = { validateTx };