const fs = require("fs")
const path = require("path");
const { DATA_BYTES } = require("../../config");



function serializeResponse(apiResponse) {
  // Extract relevant fields from the API response
  const { fullname, address, birthdate, ssn, score, timestamp, signature } = apiResponse;
  const response = {
      name: serializePadded(fullname,NAME_MAX),
      address: serializePadded(address,ADDRESS_MAX),
      birthdate: [...birthdate].map(char => char.charCodeAt(0).toString()),
      ssn: [...ssn].map(char => char.charCodeAt(0).toString()),
      score:  intToBytes(score, DATA_BYTES.score),
      timestamp: intToBytes(timestamp, DATA_BYTES.timestamp),
      sig: {
        R: signature.R.map(big => BigInt('0x' + big).toString()),
        S: BigInt('0x' + signature.S).toString()
      }
    };
    return response;
}

function serializeClientData(clientInput) {
  // Extract relevant fields from the API response
  const { fullname, address, birthdate, ssn } = clientInput;
  const clientData = {
    name: serializePadded(fullname,NAME_MAX),
    address: serializePadded(address,ADDRESS_MAX),
    birthdate: [...birthdate].map(char => char.charCodeAt(0).toString()),
    ssn: [...ssn].map(char => char.charCodeAt(0).toString()),
  }

  return clientData;
};

function pemToBigInt(pemFilePath) {
  const pemContent = fs.readFileSync(pemFilePath, { encoding: 'utf8' });
    const base64Content = pemContent
      .replace('-----BEGIN PUBLIC KEY-----', '')
      .replace('-----END PUBLIC KEY-----', '')
      .trim();
  const binaryData = Buffer.from(base64Content, 'base64');
  let bigIntValue = BigInt('0x' + binaryData.toString('hex')).toString();
  return bigIntValue;
}

function serializePK(pathx, pathy) {
  return [
    pemToBigInt(pathx),
    pemToBigInt(pathy)
  ]
};
    
function saveJSON(obj,path){
  const jsonString = JSON.stringify(obj, null, 4);
  fs.writeFileSync(path, jsonString, 'utf8');
}

function readJSON(path) {
  const jsonString = fs.readFileSync(path, 'utf8');
  const obj = JSON.parse(jsonString);
  return obj;
}

function serializePadded(str,limit) {
  let res = [...str].map(char => char.charCodeAt(0).toString());
  while (res.length < limit) 
      res.push('0'); 
  return res
}

function serializeThreshold(thresh) {
  const mostSignificantPart = (thresh >> 8) & 0xFF;
  const leastSignificantPart = thresh & 0xFF;
  return [mostSignificantPart.toString(), leastSignificantPart.toString()];
}

function intToBytes(intVal,bytesCount) {
  let byteArray = new Array(bytesCount);

  for (let i = 0; i < bytesCount; i++) {
    let bytesShifted = bytesCount - 1 - i;
    byteArray[i] = (intVal >> (8 * bytesShifted)) & 0xFF;
    byteArray[i] = byteArray[i].toString()
  }
  
  return byteArray;
}
  
// Export the function to be used in other files
module.exports = {
  response : serializeResponse,
  clientData : serializeClientData,
  saveJSON,
  serializePK,
  serializeThreshold
 };
