const axios = require('axios');
const Serial = require('./serialize');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const Transaction = require('../models/Transaction');
const { CREDIT_BUREAU_API } = require('../../config');
const fs = require('fs');
const path = require('path');

const index = __dirname.indexOf("/Services");
const PK_X_PATH = __dirname.substring(0, index) + "/static/publicKeyBJJ_X.pem";
const PK_Y_PATH = __dirname.substring(0, index) + "/static/publicKeyBJJ_Y.pem";
const PROOFS_PATH = __dirname.substring(0, index) + "/proofs/";

async function invalidateTransaction(txId)
{
    await Transaction.findOneAndUpdate(
        { _id: txId },
        { status: 'Invalid' },
        { new: true }
    );
}

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
        // console.log(`stdout:\n${stdout}`);
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

async function generateProof(serialized_clientData, serialized_resp, transaction) {
    const directoryPath = path.join(PROOFS_PATH, transaction._id.toString());
    if (!fs.existsSync(directoryPath)) {
        await fs.promises.mkdir(directoryPath, { recursive: true });
    }

    try {
        let proof_arr = [];
        proof_arr.push(serialized_clientData);
        proof_arr.push(serialized_resp);
        proof_arr.push(await Serial.serializePK(PK_X_PATH, PK_Y_PATH));
        proof_arr.push(await Serial.serializeThreshold(transaction.threshold));

        const directoryPath = PROOFS_PATH + transaction._id.toString() + '/';
        if (!fs.existsSync(directoryPath)) {
            await fs.mkdirSync(directoryPath);
        }

        const filePath = PROOFS_PATH + transaction._id.toString() + '/input.json';
        await fs.promises.writeFile(filePath, JSON.stringify(proof_arr, null, 2));

        console.log('JSON file has been saved successfully.');

        const witnessCommand = `cat ./proofs/${transaction._id.toString()}/input.json | zokrates compute-witness --abi --output proofs/${transaction._id.toString()}/witness  --stdin  > proofs/${transaction._id.toString()}/o.txt`;
        const generateProofCommand = `zokrates generate-proof --proof-path proofs/${transaction._id.toString()}/proof.json --witness proofs/${transaction._id.toString()}/witness`;

        const witnessFilePath = PROOFS_PATH + transaction._id.toString() + '/witness';

        await runCommand(witnessCommand);
        await fs.promises.unlink(`./proofs/${transaction._id.toString()}/input.json`);
        if (await fileExists(witnessFilePath)) {
            await runCommand(generateProofCommand);
            await Transaction.findOneAndUpdate(
                { _id: transaction._id },
                { status: 'Pending_Verification' },
                { new: true }
            );
            await fs.promises.unlink(`./proofs/${transaction._id.toString()}/witness`);

            console.log('File removed successfully');
        } else {
            console.log('Witness not created');
            await invalidateTransaction(transaction._id);
        }
    } catch (error) {
        console.error('Error handling proof generation:', error);
        await invalidateTransaction(transaction._id);
    }
}

function serializeData(clientInfo, responseData) {
    const serialized_clientData = Serial.clientData(clientInfo);
    const serialized_resp = Serial.response(responseData);
    console.log("Serialization completed");
    return { serialized_clientData, serialized_resp };
}

async function sendClientInfo(transaction, address, birthdate, ssn) {
    const clientInfo = {
        fullname: transaction.fullNameOfClient,
        address: address,
        birthdate: birthdate,
        ssn: ssn
    };

    // try {
        const response = await axios.post(CREDIT_BUREAU_API, clientInfo, {
            timeout: 2000
        });
        if (response && response.data) {
            const { serialized_clientData, serialized_resp } = serializeData(clientInfo, response.data);
            console.log(serialized_clientData);
            console.log(serialized_resp);
            const updatedTransaction = await Transaction.findOneAndUpdate(
                { _id: transaction._id },
                { status: 'Pending_Proof' },
                { new: true }
            );
            generateProof(serialized_clientData, serialized_resp, transaction).then(() => {
                console.log('Proof generation completed');
            }).catch(error => {
                throw new Error('Error generating proof:', error);
            });

            return {status: 'success', transaction: updatedTransaction};
        } else {
            throw new Error('No response received from the server');
        }
    // } catch (error) {
    //     if (error.code === 'ECONNREFUSED') {
    //         return { status: 'timeout', message: 'The request timed out' };
    //     }
    //     else if(error.response.data.error === 'Data mismatch')
    //     {
    //         await invalidateTransaction(transaction._id);
    //         return { status: 'Mismatch', message: 'An error occurred', details: error.message };
    //     }
    //     else {
    //         return { status: 'error', message: 'An error occurred', details: error.message };
    //     }
    // }
}

module.exports = sendClientInfo;
