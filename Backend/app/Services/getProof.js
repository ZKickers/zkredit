const fs = require('fs');
const path = require('path');

const index = __dirname.indexOf("/Services");
const PROOFS_PATH = __dirname.substring(0, index) + "/proofs/";

function getProof(transaction) {
    const filePath = path.join(PROOFS_PATH, transaction._id.toString(), 'proof.json');
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject(new Error("Error reading proof file"));
            }
            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            } catch (parseError) {
                reject(new Error("Error parsing JSON file"));
            }
        });
    });
}

module.exports = getProof;
