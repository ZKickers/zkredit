const express = require('express');
const fs = require('fs');
const digsig = require('./digitalSig.js')
const func = require('./functions.js')
const app = express();

const PATH = 'DummyData/'
const PORT = 8061;

app.use(express.json());

app.post('/', (req, res) => {
    const userData = req.body;
    const dummyUser = JSON.parse(fs.readFileSync(PATH + 'dummyUser.json', 'utf8'));
    if (func.compareData(userData, dummyUser)) {
        const privateKey = fs.readFileSync(PATH + 'privateKey.pem', 'utf8');
        console.log(privateKey)
        const dummyReport = JSON.parse(fs.readFileSync(PATH + 'dummyReport.json', 'utf8'));
        const signature = digsig.signDS(JSON.stringify(dummyReport), privateKey);
        dummyReport.signature = signature;
        res.json(dummyReport);
    }else{
        res.status(403).json({ error: 'Data mismatch' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
