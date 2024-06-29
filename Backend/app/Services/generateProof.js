const axios = require("axios");
const Serial = require("./serialize");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const Transaction = require("../models/Transaction");
const { CREDIT_BUREAU_API, CREDIT_BUREAU_TIMEOUT } = require("../../config");
const fs = require("fs");
const path = require("path");
const { deleteProof } = require("./deleteTx");

const index = __dirname.indexOf("/Services");
const PK_X_PATH = __dirname.substring(0, index) + "/static/publicKeyBJJ_X.pem";
const PK_Y_PATH = __dirname.substring(0, index) + "/static/publicKeyBJJ_Y.pem";
const PROOFS_PATH = __dirname.substring(0, index) + "/proofs/";

async function invalidateTransaction(txId) {
  await Transaction.findOneAndUpdate(
    { _id: txId },
    { status: "Invalid" },
    { new: true }
  );
}

async function runCommand(command) {
  try {
    const { stdout, stderr } = await exec(command);
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

async function isWitnessComputed(txid) {
    outPath = `./proofs/${txid}/o.txt`
    try {
        const data = await fs.readFile(outPath, 'utf-8');
        const lines = data.split('\n');
        if (lines.length < 2)
            return false;
        return lines[1] === `Witness file written to 'proofs/${txid}/witness'`;
    } catch (error) {
        console.error(`While computing witness, This error occured : ${error}`)
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

  try {
    let proof_arr = [];
    proof_arr.push(serialized_clientData);
    proof_arr.push(serialized_resp);
    proof_arr.push(await Serial.serializePK(PK_X_PATH, PK_Y_PATH));
    proof_arr.push(await Serial.serializeThreshold(transaction.threshold));

    const directoryPath = PROOFS_PATH + transaction._id.toString() + "/";
    if (!fs.existsSync(directoryPath)) {
      await fs.mkdirSync(directoryPath);
    }

    const filePath = PROOFS_PATH + transaction._id.toString() + "/input.json";
    await fs.promises.writeFile(filePath, JSON.stringify(proof_arr, null, 2));
    const witnessCommand = `cat ./proofs/${transaction._id.toString()}/input.json | zokrates compute-witness --abi --output proofs/${transaction._id.toString()}/witness  --stdin  > proofs/${transaction._id.toString()}/o.txt`;
    const generateProofCommand = `zokrates generate-proof --proof-path proofs/${transaction._id.toString()}/proof.json --witness proofs/${transaction._id.toString()}/witness`;

    const witnessFilePath =
      PROOFS_PATH + transaction._id.toString() + "/witness";

    await runCommand(witnessCommand);
    await fs.promises.unlink(
      `./proofs/${transaction._id.toString()}/input.json`
    );
    if (await fileExists(witnessFilePath) && isWitnessComputed(transaction._id)) {
      await runCommand(generateProofCommand);
      await Transaction.findOneAndUpdate(
        { _id: transaction._id },
        { status: "Pending_Verification" },
        { new: true }
      );
      await fs.promises.unlink(
        `./proofs/${transaction._id.toString()}/witness`
      );
    } else {
        await deleteProof(transaction._id);
        await invalidateTransaction(transaction._id);
    }
  } catch (error) {
    await deleteProof(transaction._id);
    console.error(`While proof generation, this error occured : ${error}`);
    await invalidateTransaction(transaction._id);
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
    generateProof(serialized_clientData, serialized_resp, transaction)
    .then(() => {
        console.log("Proof generation completed");
    })
    return { status: "success", transaction: updatedTransaction };

  } catch (error) {
    console.log(error)
    if (error.code === "ECONNABORTED" || error.code === "EHOSTUNREACH") {
        console.error(`Timeout of ${CREDIT_BUREAU_TIMEOUT}ms reached on request to credit bureau`)
        return { status: "Error" };
    } else if (error.code === "ERR_BAD_REQUEST"){
        console.error(`Client ${transaction.clientAccountId} entered invalid data`)
        await deleteProof(transaction._id)
        await invalidateTransaction(transaction._id);
        return { status: "Data Invalid" };
    }
    console.error(error)
    return { status: "Error" };
  }
}

module.exports = sendClientInfo;