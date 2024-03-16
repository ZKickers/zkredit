const crypto = require('crypto');

function signDS(data, privateKey) {
    const signer = crypto.createSign('SHA256');
    signer.update(data);
    const signature = signer.sign(privateKey, 'base64');
    return signature;
  }

module.exports = { signDS }