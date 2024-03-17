const crypto = require('crypto');
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

function pemToBigInt(key){
    const keyData = parsePEM(key);
    return convertToBigInt(keyData);
}


function sha256(message) {
  const hashBuffer = crypto.createHash('sha256').update(message).digest();
  const hashHex = hashBuffer.toString('hex');
  return BigInt('0x' + hashHex);
}

function getBytesCount(n) {
  let hex = n.toString(16);
  let numBytes = Math.ceil(hex.length / 2);
  if (hex.length > 1 && parseInt(hex[0], 16) >= 8) {
      numBytes += 1;
  }
  return numBytes;
}

function generateSecureRandomK(n) {
    let k;
    do {
        const buf = crypto.randomBytes(getBytesCount(n));
        k = BigInt('0x' + buf.toString('hex'));
        k_mod_n = invertModN(k,n)
    } while (k <= 1n || k >= n || !k_mod_n);
    return [k,k_mod_n];
}

function invertModN(num, mod) {
    const MOD = mod
    let [x, x_old] = [0n, 1n]
    while (mod){
        q = num / mod;
        [num, mod] = [mod, num % mod];
        [x, x_old] = [x_old - q * x, x];
    }
    if (num!=1) return undefined
    return (x_old + MOD) % MOD
}

function signBJJ(message, privateKey) {
    const secret = pemToBigInt(privateKey);
    console.log(jubjub.order)
    const h = sha256(message); // Hashed message
    const [k,inv_k_mod_n] = generateSecureRandomK(jubjub.order); // Secure random k
    const R = jubjub.mulPointEscalar(jubjub.Base8,k) // Random point R = k * G
    const r = R[0]; // x-coordinate of R
    const s = inv_k_mod_n * (h + secret * r) % jubjub.order;
    const s_str = s.toString() + "n"
    const r_str = r.toString() + "n"
    return { r_str, s_str };
}

module.exports = { signBJJ }