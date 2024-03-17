const jubjub = require('@zk-kit/baby-jubjub');
const fs = require("fs")

const PRIVATE = 0
const PUBLIC = 1

function savePublicKey(formated64) {
    const pemString = `-----BEGIN PUBLIC KEY-----\n${formated64}\n-----END PUBLIC KEY-----\n`;
    fs.writeFileSync('publicKeyBJJ.pem', pemString);
}

function savePrivateKey(formated64) {
    const pemString = `-----BEGIN EC PRIVATE KEY-----\n${formated64}\n-----END EC PRIVATE KEY-----\n`;
    fs.writeFileSync('privateKeyBJJ.pem', pemString);
}

function saveKey(keyInt,isPublic){
    const hex = keyInt.toString(16);
    const paddedHex = hex.length % 2 === 0 ? hex : '0' + hex;
    const b =  Buffer.from(paddedHex, 'hex');
    const packedPointBase64 = b.toString('base64');
    const formated64 =  packedPointBase64.match(/.{1,64}/g).join('\n');
    if (isPublic) savePublicKey(formated64) 
    else savePrivateKey(formated64)
}

// Define two points on the BabyJubJub curve.
const p1 = [BigInt(0), BigInt(1)] // Point at infinity (neutral element).
const p2 = [BigInt(1), BigInt(0)] // Example point.

// Add the two points on the curve.
const p3 = jubjub.addPoint(p1, p2)

// Add the result with Base8, another point on the curve, to get a new point.
const privateKey = jubjub.addPoint(jubjub.Base8, p3)
console.log(privateKey[0])
// saveKey(privateKey[0],PRIVATE)

// Multiply the base point by the x-coordinate of the secret scalar to get the public key.
const publicKey = jubjub.mulPointEscalar(jubjub.Base8, privateKey[0])
const packedPoint = jubjub.packPoint(publicKey)
// saveKey(packedPoint,PUBLIC)
