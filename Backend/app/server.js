const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const getTX = require('./routes/getTX');
const cors = require('cors');
const app = express();
const deleteTX = require('./routes/deleteTXRoute');
const ClientRequest = require('./routes/ClientRequest');
const thresholdRoute = require('./routes/thresholdRoute');
const verificationRoutes = require('./routes/verificationRoutes');
const verificationKeyRoute = require('./routes/verificationKeyRoute');
const getProofRoute = require('./routes/getProofRoute');
const { BACKEND_PORT, FRONTEND_URL, MONGODB_URI, CREDIT_BUREAU_API } = require('../config');
const os = require('os');

if (os.platform() === 'win32') {
  console.error('This application cannot run on Windows.');
  process.exit(1);
}

app.use(cors({
  origin: FRONTEND_URL
}));
app.use(bodyParser.json());

mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/getTX', getTX);
app.use('/deleteTX', deleteTX);
app.use('/ClientRequest', ClientRequest);
app.use('/Creditor', thresholdRoute);
app.use('/verifyTx', verificationRoutes);
app.use('/verification-key', verificationKeyRoute);
app.use('/getProof', getProofRoute);

app.listen(BACKEND_PORT, () => {
  console.log(`Backend Server is running on port ${BACKEND_PORT}`);
});