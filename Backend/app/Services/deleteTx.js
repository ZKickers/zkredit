const Transaction = require('../models/Transaction');
const TxDeletionState = require('../models/TransactionDeletionState');
const fs = require('fs');
const path = require('path');

const index = __dirname.indexOf("/Services");
const PROOFS_PATH = __dirname.substring(0, index) + "/proofs/";

function deleteProof(txId) {
    const directoryPath = PROOFS_PATH + txId.toString();
    if (fs.existsSync(directoryPath)) {
        console.log("dddddd")
        fs.rm(directoryPath, { recursive: true, force: true }, (err) => {
            if (err) {
                throw new Error(`Error deleting directory ${directoryPath}:`, err);
            } else {
                console.log(`Directory ${directoryPath} deleted successfully`);
            }
        });
    }
}

async function deleteTxByClient(transaction, txDeletionState)
{
    const txId = transaction._id;
    if(txDeletionState[0].state == 2)
    {
        await Transaction.deleteOne({ _id: txId });
        await TxDeletionState.deleteOne({ txId: txId });
        
    }
    else
    {
        await TxDeletionState.findOneAndUpdate(
            { txId: txId },
            { state: 1 },
            { new: true }
        );
    }
    await deleteProof(txId);
}

async function deleteTxByCreditor(transaction, txDeletionState)
{
    const txId = transaction._id;
    if(txDeletionState[0].state == 1)
    {
        await Transaction.deleteOne({ _id: txId });
        await TxDeletionState.deleteOne({ txId: txId });
    }
    else
    {
        await TxDeletionState.findOneAndUpdate(
            { txId: txId },
            { state: 2 },
            { new: true }
        );
    }
}

async function deleteClientTxs(transactions)
{
    for(let transaction of transactions)
    {
        const deletionsState = await TxDeletionState.find({txId: transaction._id});
        await deleteTxByClient(transaction, deletionsState);
    }
}

async function deleteCreditorTxs(transactions)
{
    for(let transaction of transactions)
    {
        const deletionsState = await TxDeletionState.find({txId: transaction._id});
        await deleteTxByCreditor(transaction, deletionsState);
    }
}

module.exports = {
    deleteProof,
    deleteTxByClient,
    deleteTxByCreditor,
    deleteClientTxs,
    deleteCreditorTxs
};
