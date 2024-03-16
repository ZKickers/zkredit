const crypto = require('crypto');

function genDS_RSA(data, privateKey) {
    const signer = crypto.createSign('SHA256');
    signer.update(data);
    const signature = signer.sign(privateKey, 'base64');
    return signature;
  }


module.exports = { genDS_RSA }