const fs = require('fs');
const jubjub = require('@zk-kit/baby-jubjub');

function parsePEM(privateKeyPem) {
  const pemData = privateKeyPem.replace(/-----BEGIN (.*)-----/, '')
                                .replace(/-----END (.*)-----/, '')
                                .replace(/\s/g, ''); // Remove whitespace
  const decodedData = atob(pemData);
  const byteArr = new Uint8Array(decodedData.length);
  for (let i = 0; i < decodedData.length; ++i) {
      byteArr[i] = decodedData.charCodeAt(i);
  }
  return byteArr;
}

function convertToBigInt(keyData) {
  const privateKeyBigInt = BigInt('0x' + keyData.reduce((acc, val) => {
      return acc + val.toString(16).padStart(2, '0');
  }, ''));
  return privateKeyBigInt;
}

function pemToPoint(path){
    const key = fs.readFileSync(path, 'utf8');
    const keyData = parsePEM(key);
    packedPoint =  convertToBigInt(keyData);
    return jubjub.unpackPoint(packedPoint)
}

const A_big = pemToPoint('publicKeyBJJ.pem')
const A = A_big.map(int => int.toString());
module.exports = {A}