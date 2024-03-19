const fs = require("fs")
const NAME_MAX = 70
const ADDRESS_MAX = 100

function serializeResponse(apiResponse) {
  // Extract relevant fields from the API response
  const { fullname, address, birthdate, ssn, score, signature } = apiResponse;

  const response = {
      name: serializePadded(fullname,NAME_MAX),
      address: serializePadded(address,ADDRESS_MAX),
      birthdate: [...birthdate].map(char => char.charCodeAt(0).toString()),
      ssn: [...ssn].map(char => char.charCodeAt(0).toString()),
      score:  [(score >> 8).toString(), (score & 0xFF).toString()],
      signature: {
        R: signature.R.map(big => BigInt('0x' + big).toString()),
        S: BigInt('0x' + signature.S).toString()
      }
    };
    
    return response;
}

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

  
// Export the function to be used in other files
module.exports = {ManipulateData: serializeResponse , saveJSON };

PATH = 'C:\\MyStuff\\GP\\zkredit\\FakeBureauAPI\\response.json'
resp = readJSON(PATH)
res = serializeResponse(resp)
saveJSON(res,'response.json')