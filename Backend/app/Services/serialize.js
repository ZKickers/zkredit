const fs = require("fs")
const path = require("path")
const NAME_MAX = 70
const ADDRESS_MAX = 100

function serializeResponse(apiResponse) {
  // Extract relevant fields from the API response
  // const { fullname, address, birthdate, ssn, score, signature } = apiResponse;
  address =  "123 Oak Saint Anytown, WI. 1111";
  birthdate =  "02-07-2001";
  fullname = "John Q. Doe";
  ssn = "210734803";
  score = 850;
  signature = {'R': ["24287f104fa8e92cc6379234ff6ae148f478af5b701c34ed573a01cc3b662f10","2076bcd6ea13565ab2d0290d8b0ced81f2289e28c02e9ae843fdab56147a72a5"], 'S':"2b07d92dada2d51d8231642762c3000e2f1e31e7f6f26de273bd4a282c90d166"}

  // console.log("looooooool")
  // console.log(signature.R)
  // console.log(signature.S)
  const response = {
      name: serializePadded(fullname,NAME_MAX),
      address: serializePadded(address,ADDRESS_MAX),
      birthdate: [...birthdate].map(char => char.charCodeAt(0).toString()),
      ssn: [...ssn].map(char => char.charCodeAt(0).toString()),
      score:  [(score >> 8).toString(), (score & 0xFF).toString()],
      sig: {
        R: signature.R.map(big => BigInt('0x' + big).toString()),
        S: BigInt('0x' + signature.S).toString()
      }
    };
    console.log("TAHHHHAAAA")
    console.log(signature.R.map(big => BigInt('0x' + big).toString()))
    console.log(BigInt('0x' + signature.S).toString())
    
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

  
// Export the function to be used in other files
module.exports = {
  response : serializeResponse,
  clientData : serializeClientData,
  saveJSON,
  serializePK,
  serializeThreshold
 };
