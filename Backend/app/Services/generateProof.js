require('dotenv').config();
const axios = require("axios");
const Serial = require("./serialize");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const Transaction = require("../models/Transaction");
const { CREDIT_BUREAU_API, CREDIT_BUREAU_TIMEOUT } = require("../../config");
const fs = require("fs");
const path = require("path");
const { deleteProof } = require("./deleteTx");
const { txUpdateLog, errlog, successLog, inProgLog } = require("./logging");

const index = __dirname.indexOf("/Services");
const PK_X_PATH = __dirname.substring(0, index) + "/static/publicKeyBJJ_X.pem";
const PK_Y_PATH = __dirname.substring(0, index) + "/static/publicKeyBJJ_Y.pem";
const PROOFS_PATH = __dirname.substring(0, index) + "/proofs/";
const async = require('async');
const bureauApi = process.env.EXPRESS_APP_CREDIT_BUREAU_API
let totalQueueingTime = 0;
let totalTasksProcessed = 0;
const maxConcurrentUsers = process.env.CONCURRENT_PROOFS;
const queue = async.queue(async (task) => {
  const startTime = Date.now();
  try {
    await task();
    const queueTime = Date.now() - startTime;
  } catch (error) {
    console.error('Error processing task:', error);
  }
}, parseInt(maxConcurrentUsers));

queue.drain(() => {
  console.log('All tasks have been processed');
  console.log('Total queueing time for all tasks:', totalQueueingTime, 'ms');
  console.log('Average queueing time per task:', totalQueueingTime / totalTasksProcessed, 'ms');
});

const addToQueue = (serialized_clientData, serialized_resp, transaction) => {
  const startTime = Date.now();
  queue.push(() => generateProof(serialized_clientData, serialized_resp, transaction), (err) => {
    if (err) {
      console.error('Task failed:', err);
    } else {
      const queueTime = Date.now() - startTime;
      totalQueueingTime += queueTime; // Accumulate total queueing time
      totalTasksProcessed++;
      console.log('Task completed. Queueing time:', queueTime, 'ms');
    }
    console.log(`Pending tasks: ${queue.length()}`);
  });
};

async function invalidateTransaction(txId) {
  await Transaction.findOneAndUpdate(
    { _id: txId },
    { status: "Invalid" },
    { new: true }
  );
  txUpdateLog(txid,"Invalid")
}

async function runCommand(command) {
  try {
    const { stdout, stderr } = await exec(command);
    if (stderr) {
      errlog("runCommand",stderr)
    }
    return stdout;
  } catch (error) {
    errlog("runCommand",stderr)
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

async function isWitnessComputed(txid) {

    outPath = `./proofs/${txid}/o.txt`
    try {
        const data = await fs.promises.readFile(outPath,'utf-8');
        const lines = data.split('\n');
        if (lines.length < 2)
            return false;
        return lines[1].trim() === `Witness file written to 'proofs/${txid}/witness'`;
    } catch (error) {
        errlog("checkOutputFileForWitness",error)
        return false;
    }
}

async function generateProof(
  serialized_clientData,
  serialized_resp,
  transaction
) {
    const directoryPath = path.join(PROOFS_PATH, transaction._id.toString());
    if (!fs.existsSync(directoryPath)) {
        await fs.promises.mkdir(directoryPath, { recursive: true });
    }
    let proof_arr = [];
    proof_arr.push(serialized_clientData);
    proof_arr.push(serialized_resp);
    proof_arr.push(await Serial.serializePK(PK_X_PATH, PK_Y_PATH));
    proof_arr.push(await Serial.serializeThreshold(transaction.threshold));

    if (!fs.existsSync(directoryPath)) {
        await fs.mkdirSync(directoryPath);
    }

    const filePath = PROOFS_PATH + transaction._id.toString() + "/input.json";
    await fs.promises.writeFile(filePath, JSON.stringify(proof_arr, null, 2));
    const witnessCommand = `cat ./proofs/${transaction._id.toString()}/input.json | zokrates compute-witness --abi --output proofs/${transaction._id.toString()}/witness  --stdin  > proofs/${transaction._id.toString()}/o.txt`;
    const generateProofCommand = `zokrates generate-proof --proof-path proofs/${transaction._id.toString()}/proof.json --witness proofs/${transaction._id.toString()}/witness`;

    const witnessFilePath =
        PROOFS_PATH + transaction._id.toString() + "/witness";

    inProgLog("Computing Witness")
    await runCommand(witnessCommand);
    await fs.promises.unlink(
        `./proofs/${transaction._id.toString()}/input.json`
    );
    if (await fileExists(witnessFilePath) && await isWitnessComputed(transaction._id)) {
        successLog(`TX ${transaction._id}`,"witness computation")
        inProgLog("Proof Generation")
        await runCommand(generateProofCommand);
        successLog(`TX ${transaction._id}`,"Proof generation")
        await Transaction.findOneAndUpdate(
            { _id: transaction._id },
            { status: "Pending_Verification" },
            { new: true }
        );
        txUpdateLog(transaction._id,"Pending_Verification","Pending_Proof")
        await fs.promises.unlink(
            `./proofs/${transaction._id.toString()}/witness`
        );
    } else {
        await deleteProof(transaction._id);
        await invalidateTransaction(transaction._id);
        throw new Error("Witness copmutation failed");
    }
}

function serializeData(clientInfo, responseData) {
  const serialized_clientData = Serial.clientData(clientInfo);
  const serialized_resp = Serial.response(responseData);
  return { serialized_clientData, serialized_resp };
}

async function sendClientInfo(transaction, address, birthdate, ssn) {
  const clientInfo = {
    fullname: transaction.fullNameOfClient,
    address: address,
    birthdate: birthdate,
    ssn: ssn,
  };

  try {
    const response = await axios.post(CREDIT_BUREAU_API, clientInfo, {
      timeout: CREDIT_BUREAU_TIMEOUT,
    });
    const { serialized_clientData, serialized_resp } = serializeData(
        clientInfo,
        response.data
    );
    const updatedTransaction = await Transaction.findOneAndUpdate(
        { _id: transaction._id },
        { status: "Pending_Proof" },
        { new: true }
      );
      txUpdateLog(transaction._id,"Pending_Proof","Pending_Client_Data")
      addToQueue(serialized_clientData, serialized_resp, transaction);
      return { status: "success", transaction: updatedTransaction };

  } catch (error) {
    if (error.code === "ECONNABORTED" || error.code === "EHOSTUNREACH") {
        console.error(`Timeout of ${CREDIT_BUREAU_TIMEOUT}ms reached on request to credit bureau`)
        return { status: "Error" };
    } else if (error.code === "ERR_BAD_REQUEST"){
        await deleteProof(transaction._id)
        await invalidateTransaction(transaction._id);
        return { status: "Data Invalid" };
    }
    errlog("genProof",error)
    return { status: "Error" };
  }
}

module.exports = sendClientInfo;
