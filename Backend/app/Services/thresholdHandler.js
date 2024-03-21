const Serial = require('../Services/serialize');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');
const ProofInput = require('../models/ProofInput');
const { exec } = require('child_process');
const fs = require('fs');
const PK_X_PATH = "/Users/omarkhairat/Documents/GitHub/zkredit/Backend/app/static/publicKeyBJJ_X.pem"
const PK_Y_PATH = "/Users/omarkhairat/Documents/GitHub/zkredit/Backend/app/static/publicKeyBJJ_Y.pem"
const PROOFS_PATH = "/Users/omarkhairat/Documents/GitHub/zkredit/Backend/app/proofs/"

function generateNonce() {
    const nonce = Buffer.alloc(32);
    for (let i = 0; i < 32; i++) {
        nonce[i] = Math.floor(Math.random() * 256);
    }
    return nonce;
  }

function nonceToArray(nonce) {
    const nonceArray = [];
    for (let i = 0; i < nonce.length; i++) {
        nonceArray.push(nonce[i].toString());
    }
    return nonceArray;
}

async function handleThresholdEvent(creditorAccountId, transaction, threshold)
{
    try {
        const proofInput = await ProofInput.findOne({ transactionId: transaction._id });
        if (!proofInput) {
            throw new Error(`Proof data for this transaction is not found`);
        }
        // console.log(proofInput.clientId);
        // console.log(proofInput.response);
        let proof_arr = [];
        proof_arr.push(proofInput.clientId);
        const nonce = await generateNonce();
        proof_arr.push(await nonceToArray(nonce));
        proof_arr.push(proofInput.response);
        proof_arr.push(await Serial.serializePK(PK_X_PATH, PK_Y_PATH));
        proof_arr.push(await Serial.serializeThreshold(threshold));
        console.log(proof_arr);

        // DELETE !!!!!!!!!!!!!!!!!!!!!!!! DIRECTORY
        console.log(transaction._id)
        const directoryPath = PROOFS_PATH+ transaction._id.toString() + '/';
        if (!fs.existsSync(directoryPath)) {
            await fs.mkdirSync(directoryPath);
        }
        const filePath = PROOFS_PATH + transaction._id.toString() + '/input.json';
        fs.writeFile(filePath, JSON.stringify(proof_arr, null, 2), (err) => {
            if (err) {
                console.error('Error writing JSON file:', err);
            } else {
                console.log('JSON file has been saved successfully.');
            }
        });
        
    } catch (error) {
        console.error('Error handling threshold event:', error);
        return { error: 'Error handling threshold event' };
    }
}

module.exports = { handleThresholdEvent };