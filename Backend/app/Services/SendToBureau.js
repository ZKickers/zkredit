const axios = require('axios');
const Serial = require('../Services/serialize');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');
const { CREDIT_BUREAU_API } = require('../../config');
const fs = require('fs');
const path = require('path');


const index = __dirname.indexOf("/Services");
const PK_X_PATH = __dirname.substring(0, index) + "/static/publicKeyBJJ_X.pem";
const PK_Y_PATH = __dirname.substring(0, index) + "/static/publicKeyBJJ_Y.pem";
const PROOFS_PATH = __dirname.substring(0, index) + "/proofs/";

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

// async function readFileIntoVariable(filePath) {
//     const chunkSize = 10 * 1024 * 1024; // 10 MB
//     const chunks = [];

//     return new Promise((resolve, reject) => {
//         const stream = fs.createReadStream(filePath, { encoding: 'utf8', highWaterMark: chunkSize });

//         stream.on('data', (chunk) => {
//             chunks.push(chunk);
//         });

//         stream.on('end', () => {
//             resolve(chunks);
//         });

//         stream.on('error', (error) => {
//             console.error('Error reading file:', error);
//             reject(error);
//         });
//     });
// }

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

async function generateProof(serialized_clientData, serialized_resp, transaction) {
    const directoryPath = path.join(PROOFS_PATH, transaction._id.toString());
    if (!fs.existsSync(directoryPath)) {
        await fs.promises.mkdir(directoryPath, { recursive: true });
    }
    try
    {
        let proof_arr = [];
        proof_arr.push(serialized_clientData);
        const nonce = await generateNonce();
        proof_arr.push(await nonceToArray(nonce));
        proof_arr.push(serialized_resp);
        proof_arr.push(await Serial.serializePK(PK_X_PATH, PK_Y_PATH));
        proof_arr.push(await Serial.serializeThreshold(transaction.threshold));
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
        // console.log("witnessFilePath: " + witnessFilePath);
        await runCommand(witnessCommand) ;
        if (await fileExists(witnessFilePath)) {
            await runCommand(generateProofCommand);
            await Transaction.findOneAndUpdate(
                { _id: transaction._id },
                { status: 'Pending_Verification' },
                { new: true } 
            );
            await fs.unlink("./proofs/" + transaction._id.toString() + "/input.json", (err) => {
                if (err) {
                    console.error('Error removing file:', err);
                } else {
                    console.log('File removed successfully');
                }
            });
            await fs.unlink("./proofs/" + transaction._id.toString() + "/witness", (err) => {
                if (err) {
                    console.error('Error removing file:', err);
                } else {
                    console.log('File removed successfully');
                }
            });
            // return true;
        } else {
            console.log('Witness not created');
            await Transaction.findOneAndUpdate(
                { _id: transaction._id },
                { status: 'Invalid' },
                { new: true } 
            );
        }
        // return true;
    }
    catch (error) {
        console.error('Error handling threshold event:', error);
    }


    // try {
    //     const { initialize } = await import('zokrates-js');
    //     const zokratesProvider = await initialize();

    //     const programPath = path.resolve('./out');
    //     const provingKeyPath = path.resolve('./proving.key');

    //     const programChunks = await readFileIntoVariable(programPath);
    //     const program = programChunks.join('');
    //     const provingKey = await fs.promises.readFile(provingKeyPath);

    //     console.log(`Program length: ${program.length}`);
    //     console.log(provingKey);
    // } catch (error) {
    //     console.error('Error generating proof:', error);
    // }
}

function serializeData(clientInfo, responseData) {
    const serialized_clientData = Serial.clientData(clientInfo);
    console.log("serializeData", serialized_clientData);

    const serialized_resp = Serial.response(responseData);
    console.log(serialized_resp);

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

    try {
        const response = await axios.post(CREDIT_BUREAU_API, clientInfo);
        console.log('Response from server:', response.data);

        const { serialized_clientData, serialized_resp } = serializeData(clientInfo, response.data);

        // await generateProof(serialized_clientData, serialized_resp, transaction);
    generateProof(serialized_clientData, serialized_resp, transaction)
    .then(() => {
        return "Proof is being generated"
    })
    .catch((error) => {
        console.error('Error generating proof:', error);
    });

        // return transaction;
    } catch (error) {
        console.error('Error sending client info:', error);
        throw error;
    }
}

module.exports = sendClientInfo;
