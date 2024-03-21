const Serial = require('../Services/serialize');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');
const ProofInput = require('../models/ProofInput');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const fs_extra = require('fs-extra');

const index = __dirname.indexOf("/Services");
const PK_X_PATH = __dirname.substring(0, index) + "/static/publicKeyBJJ_X.pem"
const PK_Y_PATH = __dirname.substring(0, index) + "/static/publicKeyBJJ_Y.pem"
const PROOFS_PATH = __dirname.substring(0, index) + "/proofs/"

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

async function runCommand(command) {
    try {
        const { stdout, stderr } = await exec(command);
        console.log(`stdout:\n${stdout}`);
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
        return stdout; 
    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw error;
    }
}

async function fileExists(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}

async function handleThresholdEvent(creditorAccountId, transaction, threshold)
{
    try {
        const proofInput = await ProofInput.findOne({ transactionId: transaction._id });
        if (!proofInput) {
            throw new Error(`Proof data for this transaction is not found`);
        }
        let proof_arr = [];
        proof_arr.push(proofInput.clientId);
        const nonce = await generateNonce();
        proof_arr.push(await nonceToArray(nonce));
        proof_arr.push(proofInput.response);
        proof_arr.push(await Serial.serializePK(PK_X_PATH, PK_Y_PATH));
        proof_arr.push(await Serial.serializeThreshold(threshold));
        // console.log(proof_arr);
        // console.log(transaction._id)
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
        const witnessCommand = "cat ./proofs/" + transaction._id.toString() + "/input.json | zokrates compute-witness --abi --output proofs/" + transaction._id.toString() + "/witness  --stdin  > proofs/" + transaction._id.toString() + "/o.txt";
        const generateProofCommand = "zokrates generate-proof --proof-path proofs/" + transaction._id.toString() + "/proof.json --witness proofs/" + transaction._id.toString() + "/witness";
        const witnessFilePath = PROOFS_PATH + transaction._id.toString() + '/witness';
        await runCommand(witnessCommand) ;
        if (await fileExists(witnessFilePath)) {
            await runCommand(generateProofCommand);
            await Transaction.findOneAndUpdate(
                { _id: transaction._id },
                { status: 'Pending_Verification' },
                { new: true } 
            );
            // await fs.unlink("./proofs/" + transaction._id.toString() + "/input.json", (err) => {
            //     if (err) {
            //         console.error('Error removing file:', err);
            //     } else {
            //         console.log('File removed successfully');
            //     }
            // });
            // return true;
        } else {
            console.log('Witness not created');
        }
        return false;
    } catch (error) {
        console.error('Error handling threshold event:', error);
        return false;
        // return { error: 'Error handling threshold event' };
    }
}

module.exports = { handleThresholdEvent };